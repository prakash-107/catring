import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';
import logo from '../assets/logo.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const res = await login(username, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-dark)' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '3rem' }}>
                <div className="logo-container" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <img src={logo} alt="Sree Gajananan Logo" style={{ width: '150px', height: '150px', objectFit: 'contain', marginBottom: '1rem' }} />
                    <h1 className="text-gold" style={{ fontSize: '1.8rem' }}>Sree Gajananan</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Admin Portal</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--primary)' }} />
                        <input 
                            type="text" 
                            placeholder="Username" 
                            style={{ paddingLeft: '2.5rem' }}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--primary)' }} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            style={{ paddingLeft: '2.5rem' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p style={{ color: '#ff4d4d', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        Login Securely
                    </button>
                </form>

                <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
                    Authorized Personnel Only. System access is monitored.
                </p>
            </div>
        </div>
    );
};

export default Login;
