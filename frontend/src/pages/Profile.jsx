import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Profile</h1>
      <div style={styles.card}>
        <div style={styles.avatar}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div style={styles.info}>
          <div style={styles.field}>
            <span style={styles.label}>Username</span>
            <span style={styles.value}>{user.username}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Email</span>
            <span style={styles.value}>{user.email}</span>
          </div>
          <div style={styles.field}>
            <span style={styles.label}>Member Since</span>
            <span style={styles.value}>
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '0 1rem',
  },
  heading: { color: '#fff', fontSize: '2rem', marginBottom: '1.5rem' },
  card: {
    background: '#1a1a2e',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: '#e94560',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  info: { flex: 1 },
  field: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #333',
  },
  label: { color: '#aaa', fontWeight: 500 },
  value: { color: '#fff' },
};
