import { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    taskAPI
      .dashboard()
      .then((res) => setStats(res.data))
      .catch(() => setError('Failed to load dashboard'));
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Dashboard</h1>
      <p style={styles.welcome}>Welcome, {user?.username}!</p>

      {error && <div style={styles.error}>{error}</div>}

      {!stats && !error && <p style={styles.loading}>Loading stats...</p>}

      {stats && (
        <>
          <div style={styles.grid}>
            <div style={{ ...styles.card, borderLeft: '4px solid #e94560' }}>
              <h3 style={styles.cardTitle}>Total Tasks</h3>
              <p style={styles.cardValue}>{stats.total_tasks}</p>
            </div>
            <div style={{ ...styles.card, borderLeft: '4px solid #4ecca3' }}>
              <h3 style={styles.cardTitle}>Completed</h3>
              <p style={styles.cardValue}>{stats.completed_tasks}</p>
            </div>
            <div style={{ ...styles.card, borderLeft: '4px solid #ffc107' }}>
              <h3 style={styles.cardTitle}>Pending</h3>
              <p style={styles.cardValue}>{stats.pending_tasks}</p>
            </div>
            <div style={{ ...styles.card, borderLeft: '4px solid #17a2b8' }}>
              <h3 style={styles.cardTitle}>Progress</h3>
              <p style={styles.cardValue}>{stats.progress_percentage}%</p>
            </div>
          </div>

          <div style={styles.progressSection}>
            <h3 style={styles.sectionTitle}>Overall Progress</h3>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${Math.max(stats.progress_percentage, 2)}%`,
                }}
              />
            </div>
            <p style={styles.progressText}>
              {stats.completed_tasks} of {stats.total_tasks} tasks completed
            </p>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '2rem auto',
    padding: '0 1rem',
  },
  heading: {
    color: '#fff',
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  welcome: {
    color: '#aaa',
    marginBottom: '2rem',
  },
  loading: { color: '#aaa' },
  error: {
    background: '#ff4444',
    color: '#fff',
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  card: {
    background: '#1a1a2e',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  cardTitle: {
    color: '#aaa',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
  },
  cardValue: {
    color: '#fff',
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  progressSection: {
    background: '#1a1a2e',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  sectionTitle: {
    color: '#fff',
    marginBottom: '1rem',
  },
  progressBar: {
    background: '#333',
    height: '20px',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #e94560, #4ecca3)',
    borderRadius: '10px',
    transition: 'width 0.5s ease',
  },
  progressText: {
    color: '#aaa',
    marginTop: '0.5rem',
    textAlign: 'center',
  },
};
