import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Point this exactly to your Django login endpoint
      const response = await axios.post('http://localhost:8000/api/admin-dashboard/login/', formData);
      
      if (response.data.access) {
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('isAdmin', 'true');
        console.log('Admin login successful');
        navigate('/admin/products');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>TECH ZONE</h1>
          <p style={styles.subtitle}>ADMINISTRATOR LOGIN</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              style={styles.input}
              placeholder="Enter admin username"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={loading ? {...styles.button, opacity: 0.7} : styles.button}
          >
            {loading ? 'VERIFYING...' : 'LOGIN TO DASHBOARD'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', fontFamily: 'sans-serif' },
  card: { width: '400px', padding: '40px', backgroundColor: '#111', borderRadius: '15px', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  header: { marginBottom: '30px', borderLeft: '4px solid #00ff88', paddingLeft: '15px' },
  title: { color: '#fff', fontSize: '1.8rem', margin: 0, letterSpacing: '2px' },
  subtitle: { color: '#666', fontSize: '0.8rem', marginTop: '5px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', color: '#888', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px' },
  input: { width: '100%', padding: '12px', backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: '#fff', outline: 'none', boxSizing: 'border-box' },
  button: { width: '100%', padding: '14px', backgroundColor: '#00ff88', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', transition: '0.3s' },
  error: { backgroundColor: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center', border: '1px solid #ff4444' }
};