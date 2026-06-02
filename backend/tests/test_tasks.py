import pytest
from fastapi import status


class TestCreateTask:
    def test_create_task_success(self, client, auth_headers):
        response = client.post("/tasks", json={
            "title": "New Task",
            "description": "Task description",
            "priority": "high",
        }, headers=auth_headers)
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["title"] == "New Task"
        assert data["priority"] == "high"
        assert data["completed"] is False

    def test_create_task_empty_title(self, client, auth_headers):
        response = client.post("/tasks", json={"title": ""}, headers=auth_headers)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_create_task_unauthorized(self, client):
        response = client.post("/tasks", json={"title": "Task"})
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_create_task_invalid_priority(self, client, auth_headers):
        response = client.post("/tasks", json={
            "title": "Task",
            "priority": "urgent",
        }, headers=auth_headers)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestListTasks:
    def test_list_tasks(self, client, auth_headers, sample_tasks):
        response = client.get("/tasks", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 3

    def test_list_tasks_filter_completed(self, client, auth_headers, sample_tasks):
        response = client.get("/tasks?completed=true", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["completed"] is True

    def test_list_tasks_filter_pending(self, client, auth_headers, sample_tasks):
        response = client.get("/tasks?completed=false", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 2
        assert all(t["completed"] is False for t in data)

    def test_list_tasks_filter_priority(self, client, auth_headers, sample_tasks):
        response = client.get("/tasks?priority=high", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["priority"] == "high"


class TestGetTask:
    def test_get_task_success(self, client, auth_headers, sample_tasks):
        task_id = sample_tasks[0].id
        response = client.get(f"/tasks/{task_id}", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["title"] == "Task 1"

    def test_get_task_not_found(self, client, auth_headers):
        response = client.get("/tasks/9999", headers=auth_headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestUpdateTask:
    def test_update_task_title(self, client, auth_headers, sample_tasks):
        task_id = sample_tasks[0].id
        response = client.put(f"/tasks/{task_id}", json={
            "title": "Updated Title",
        }, headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["title"] == "Updated Title"

    def test_update_task_mark_complete(self, client, auth_headers, sample_tasks):
        task_id = sample_tasks[0].id
        response = client.put(f"/tasks/{task_id}", json={
            "completed": True,
        }, headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["completed"] is True

    def test_update_task_not_found(self, client, auth_headers):
        response = client.put("/tasks/9999", json={"title": "Nope"}, headers=auth_headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestDeleteTask:
    def test_delete_task_success(self, client, auth_headers, sample_tasks):
        task_id = sample_tasks[0].id
        response = client.delete(f"/tasks/{task_id}", headers=auth_headers)
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_delete_task_not_found(self, client, auth_headers):
        response = client.delete("/tasks/9999", headers=auth_headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestDashboard:
    def test_dashboard_stats(self, client, auth_headers, sample_tasks):
        response = client.get("/tasks/dashboard", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["total_tasks"] == 3
        assert data["completed_tasks"] == 1
        assert data["pending_tasks"] == 2
        assert data["progress_percentage"] == pytest.approx(33.33, rel=0.01)

    def test_dashboard_empty(self, client, auth_headers):
        response = client.get("/tasks/dashboard", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["total_tasks"] == 0
        assert data["progress_percentage"] == 0.0
