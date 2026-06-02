import { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';

export default function TaskForm({ task, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        due_date: task.due_date ? task.due_date.slice(0, 16) : '',
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
      };

      if (task) {
        await taskAPI.update(task.id, payload);
      } else {
        await taskAPI.create(payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.heading}>{task ? 'Edit Task' : 'New Task'}</h3>
      {error && <div style={styles.error}>{error}</div>}
      <div style={styles.field}>
        <label style={styles.label}>Title *</label>
        <input
          style={styles.input}
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>
      <div style={styles.field}>
        <label style={styles.label}>Description</label>
        <textarea
          style={styles.textarea}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />
      </div>
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Priority</label>
          <select
            style={styles.input}
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Due Date</label>
          <input
            style={styles.input}
            type="datetime-local"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          />
        </div>
      </div>
      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
}

const styles = {
  form: {
    background: '#1a1a2e',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  heading: { color: '#fff', marginBottom: '1rem' },
  error: {
    background: '#ff4444',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '1rem',
  },
  field: { marginBottom: '1rem', flex: 1 },
  label: { color: '#ccc', display: 'block', marginBottom: '0.3rem' },
  input: {
    width: '100%',
    padding: '0.6rem',
    borderRadius: '6px',
    border: '1px solid #333',
    background: '#16213e',
    color: '#fff',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.6rem',
    borderRadius: '6px',
    border: '1px solid #333',
    background: '#16213e',
    color: '#fff',
    fontSize: '1rem',
    resize: 'vertical',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  row: {
    display: 'flex',
    gap: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.7rem',
    background: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
