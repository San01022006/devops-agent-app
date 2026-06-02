from fastapi import status


def test_register_user(client):
    response = client.post("/register", json={
        "username": "newuser",
        "email": "new@example.com",
        "password": "securepass123",
    })
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "new@example.com"
    assert "id" in data


def test_register_duplicate_username(client, test_user):
    response = client.post("/register", json={
        "username": "testuser",
        "email": "other@example.com",
        "password": "securepass123",
    })
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_register_duplicate_email(client, test_user):
    response = client.post("/register", json={
        "username": "otheruser",
        "email": "test@example.com",
        "password": "securepass123",
    })
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_register_validation_short_username(client):
    response = client.post("/register", json={
        "username": "ab",
        "email": "test@example.com",
        "password": "securepass123",
    })
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_register_validation_short_password(client):
    response = client.post("/register", json={
        "username": "validuser",
        "email": "test@example.com",
        "password": "12345",
    })
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_login_success(client, test_user):
    response = client.post("/login", json={
        "username": "testuser",
        "password": "testpass123",
    })
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_password(client, test_user):
    response = client.post("/login", json={
        "username": "testuser",
        "password": "wrongpassword",
    })
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_login_nonexistent_user(client):
    response = client.post("/login", json={
        "username": "nouser",
        "password": "testpass123",
    })
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_me_authenticated(client, auth_headers):
    response = client.get("/me", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["username"] == "testuser"


def test_get_me_unauthenticated(client):
    response = client.get("/me")
    assert response.status_code == status.HTTP_403_FORBIDDEN
