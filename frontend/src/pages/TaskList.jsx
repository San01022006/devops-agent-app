import { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import TaskForm from './TaskForm';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ completed: '', priority: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');

  const fetchTasks = () => {
    const params = {};
    if (filter.completed !== '') params.completed = filter.completed;
    if (filter.priority) params.priority = filter.priority;

    taskAPI
      .getAll(params)
      .then((res) => setTasks(res.data))
      .catch(() => setError('Failed to load tasks'));
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskAPI.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError('Failed to delete task');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updated = await taskAPI.update(task.id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated.data : t)));
    } catch {
      setError('Failed to update task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'high': return '#e94560';
      case 'medium': return '#ffc107';
      case 'low': return '#4ecca3';
      default: return '#aaa';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Tasks</h1>
        <button style={styles.addBtn} onClick={() => { setEditingTask(null); setShowForm(!showForm); }}>
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {showForm && (
        <TaskForm task={editingTask} onSuccess={handleFormSuccess} />
      )}

      <div style={styles.filters}>
        <select
          style={styles.select}
          value={filter.completed}
          onChange={(e) => setFilter({ ...filter, completed: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="false">Pending</option>
          <option value="true">Completed</option>
        </select>
        <select
          style={styles.select}
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {tasks.length === 0 && !error && (
        <p style={styles.empty}>No tasks found. Create one to get started!</p>
      )}

      <div style={styles.list}>
        {tasks.map((task) => (
          <div key={task.id} style={styles.taskCard}>
            <div style={styles.taskHeader}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task)}
                style={styles.checkbox}
              />
              <div style={styles.taskInfo}>
                <h3 style={{
                  ...styles.taskTitle,
                  textDecoration: task.completed ? 'line-through' : 'none',
                  opacity: task.completed ? 0.6 : 1,
                }}>
                  {task.title}
                </h3>
                {task.description && (
                  <p style={styles.taskDesc}>{task.description}</p>
                )}
                <div style={styles.taskMeta}>
                  <span style={{
                    ...styles.priorityBadge,
                    background: getPriorityColor(task.priority),
                  }}>
                    {task.priority}
                  </span>
                  {task.due_date && (
                    <span style={styles.dueDate}>
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div style={styles.taskActions}>
              <button style={styles.editBtn} onClick={() => handleEdit(task)}>Edit</button>
              <button style={styles.deleteBtn} onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '0 1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  heading: { color: '#fff', fontSize: '2rem' },
  addBtn: {
    background: '#e94560',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  error: {
    background: '#ff4444',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '1rem',
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  select: {
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #333',
    background: '#1a1a2e',
    color: '#fff',
    flex: 1,
  },
  empty: { color: '#aaa', textAlign: 'center', marginTop: '2rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  taskCard: {
    background: '#1a1a2e',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  taskHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    flex: 1,
  },
  checkbox: {
    marginTop: '0.3rem',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  taskInfo: { flex: 1 },
  taskTitle: { color: '#fff', margin: 0, fontSize: '1.1rem' },
  taskDesc: { color: '#aaa', margin: '0.3rem 0', fontSize: '0.9rem' },
  taskMeta: { display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.3rem' },
  priorityBadge: {
    padding: '0.15rem 0.5rem',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  dueDate: { color: '#aaa', fontSize: '0.8rem' },
  taskActions: { display: 'flex', gap: '0.5rem', marginLeft: '1rem' },
  editBtn: {
    background: 'transparent',
    color: '#4ecca3',
    border: '1px solid #4ecca3',
    padding: '0.3rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteBtn: {
    background: 'transparent',
    color: '#e94560',
    border: '1px solid #e94560',
    padding: '0.3rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
