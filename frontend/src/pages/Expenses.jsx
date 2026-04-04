import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Plus, Trash2, Edit, Calendar as CalendarIcon, CreditCard, Tag, X } from 'lucide-react';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [source, setSource] = useState('Mess');
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        date: '', expenseName: '', amount: '', source: 'Mess'
    });

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const fetchExpenses = async () => {
        try {
            const res = await api.get(`/api/expenses?month=${month}&year=${year}&source=${source}`);
            setExpenses(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchExpenses(); }, [month, year, source]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/api/expenses/${editId}`, { ...formData, source });
            } else {
                await api.post('/api/expenses', { ...formData, source });
            }
            
            setShowModal(false);
            setEditId(null);
            setFormData({ date: '', expenseName: '', amount: '', source });
            fetchExpenses();
        } catch (err) { console.error(err); }
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setFormData({
            date: new Date(item.date).toISOString().split('T')[0],
            expenseName: item.expenseName,
            amount: item.amount,
            source: item.source
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this expense?')) {
            await api.delete(`/api/expenses/${id}`);
            fetchExpenses();
        }
    };

    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="expenses-page">
            <header className="flex-between mb-2">
                <div>
                    <h1 className="text-gold">Expenses (Selavu)</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Track Mess and Mahal expenses</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={20} /> Add Expense
                </button>
            </header>

            <div className="tabs mb-2" style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                    className={`btn ${source === 'Mess' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setSource('Mess')}
                >Mess</button>
                <button 
                    className={`btn ${source === 'Mahal' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setSource('Mahal')}
                >Mahal</button>
            </div>

            <div className="flex-between mb-2">
                <div className="glass-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: 0 }}>
                    <CalendarIcon size={20} className="text-gold" />
                    <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: '150px', marginBottom: 0 }}>
                        {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select>
                    <input type="number" value={year} onChange={(e) => setYear(e.target.value)} style={{ width: '100px', marginBottom: 0 }} />
                </div>
                <div className="glass-card" style={{ margin: 0, padding: '0.8rem 2rem' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Total Monthly Expense</p>
                    <h2 style={{ color: '#F44336' }}>₹{totalExpense}</h2>
                </div>
            </div>

            <div className="table-container glass-card">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Expense Name</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No expenses recorded for this month.</td></tr>}
                        {expenses.map((item) => (
                            <tr key={item._id}>
                                <td>{new Date(item.date).toLocaleDateString()}</td>
                                <td style={{ color: 'var(--primary)', fontWeight: '500' }}>{item.expenseName}</td>
                                <td style={{ color: '#F44336', fontWeight: 'bold' }}>₹{item.amount}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleEdit(item)} style={{ background: 'transparent', border: 'none', color: 'var(--text-gold)', cursor: 'pointer' }}>
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(item._id)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '500px' }}>
                        <div className="flex-between mb-2">
                           <h2 className="mb-2">{editId ? `Edit ${source} Expense` : `Add ${source} Expense`}</h2>
                           <button onClick={() => { setShowModal(false); setEditId(null); setFormData({ date: '', expenseName: '', amount: '', source }); }} className="btn-outline" style={{ border: 'none' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Date</label>
                            <input name="date" type="date" value={formData.date} onChange={handleChange} required />
                            
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Expense Name</label>
                            <input name="expenseName" placeholder="e.g. Vegetables, Gas, Travel" value={formData.expenseName} onChange={handleChange} required />
                            
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Amount</label>
                            <input name="amount" type="number" placeholder="Enter Amount" value={formData.amount} onChange={handleChange} required />
                            
                            <div className="flex-between mt-2" style={{ marginTop: '1.5rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Expense</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
