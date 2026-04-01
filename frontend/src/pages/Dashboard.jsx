import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, IndianRupee, CreditCard, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalEvents: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        activeStaff: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();
            
            try {
                const [events, income, expenses, staff] = await Promise.all([
                    axios.get(`http://localhost:5000/api/events?month=${month}&year=${year}`),
                    axios.get(`http://localhost:5000/api/income?month=${month}&year=${year}`),
                    axios.get(`http://localhost:5000/api/expenses?month=${month}&year=${year}`),
                    axios.get(`http://localhost:5000/api/staff?month=${month}&year=${year}`)
                ]);

                setStats({
                    totalEvents: events.data.length,
                    monthlyIncome: income.data.reduce((acc, curr) => acc + curr.totalAmount, 0),
                    monthlyExpenses: expenses.data.reduce((acc, curr) => acc + curr.amount, 0),
                    activeStaff: new Set(staff.data.map(s => s.staffName)).size
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'This Month Events', value: stats.totalEvents, icon: <Calendar />, color: '#D4AF37' },
        { title: 'Monthly Income', value: `₹${stats.monthlyIncome}`, icon: <IndianRupee />, color: '#4CAF50' },
        { title: 'Monthly Expenses', value: `₹${stats.monthlyExpenses}`, icon: <CreditCard />, color: '#F44336' },
        { title: 'Staff Active', value: stats.activeStaff, icon: <Users />, color: '#2196F3' }
    ];

    return (
        <div className="dashboard">
            <header className="mb-2">
                <h1 className="text-gold">Dashboard Overview</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back to Sree Gajananan Admin Panel</p>
            </header>

            <div className="stats-grid">
                {cards.map((card, idx) => (
                    <div key={idx} className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ background: `${card.color}22`, color: card.color, padding: '0.5rem', borderRadius: '8px' }}>
                                {card.icon}
                            </div>
                        </div>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{card.title}</h3>
                        <h2 style={{ fontSize: '1.8rem' }}>{card.value}</h2>
                    </div>
                ))}
            </div>

            <div className="sections-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-card">
                    <h3 className="mb-2">Quick Actions</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button className="btn btn-primary" onClick={() => navigate('/events')}>Add New Event</button>
                        <button className="btn btn-outline" onClick={() => navigate('/income')}>Record Income</button>
                        <button className="btn btn-outline" onClick={() => navigate('/expenses')}>Track Expense</button>
                    </div>
                </div>
                <div className="glass-card">
                    <h3 className="mb-2">Summary</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <div style={{ flex: 1 }}>
                            <p style={{ color: 'var(--text-secondary)' }}>Profit/Loss Balance</p>
                            <h2 style={{ color: stats.monthlyIncome - stats.monthlyExpenses >= 0 ? '#4CAF50' : '#F44336' }}>
                                ₹{stats.monthlyIncome - stats.monthlyExpenses}
                            </h2>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
