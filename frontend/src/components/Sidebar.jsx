import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, IndianRupee, CreditCard, Users, LogOut, Menu, X, FileText } from 'lucide-react';
import logo from '../assets/logo.png';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleSidebar = () => setIsOpen(!isOpen);

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Events', path: '/events', icon: <Calendar size={20} /> },
        { name: 'Varavu (Income)', path: '/income', icon: <IndianRupee size={20} /> },
        { name: 'Selavu (Expenses)', path: '/expenses', icon: <CreditCard size={20} /> },
        { name: 'Staff Salary', path: '/staff', icon: <Users size={20} /> },
        { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    ];

    return (
        <>
            <button className="mobile-menu-btn" onClick={toggleSidebar} style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 1001, background: 'var(--primary)', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="logo-container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                   <div style={{ background: '#fff', borderRadius: '50%', width: '100px', height: '100px', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '3px solid var(--primary)' }}>
                        <img src={logo} alt="Sree Gajananan Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                   </div>
                   <h2 className="text-gold" style={{ fontSize: '1rem' }}>Sree Gajananan</h2>
                   <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Catering Services</p>
                </div>

                <nav style={{ flex: 1 }}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                        <p className="text-gold" style={{ fontWeight: '600' }}>{user?.name}</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Administrator</p>
                    </div>
                    <button onClick={handleLogout} className="nav-link" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
