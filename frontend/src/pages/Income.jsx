import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Calendar as CalendarIcon, User, Calculator, PieChart, X } from 'lucide-react';

const Income = () => {
    const [income, setIncome] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [source, setSource] = useState('Mess');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        date: '', clientName: '', totalAmount: '', paidAmount: '', source: 'Mess'
    });

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const fetchIncome = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/income?month=${month}&year=${year}&source=${source}`);
            setIncome(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchIncome(); }, [month, year, source]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/income', { ...formData, source });
            setShowModal(false);
            setFormData({ date: '', clientName: '', totalAmount: '', paidAmount: '', source });
            fetchIncome();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this entry?')) {
            await axios.delete(`http://localhost:5000/api/income/${id}`);
            fetchIncome();
        }
    };

    const totals = income.reduce((acc, curr) => ({
        total: acc.total + curr.totalAmount,
        paid: acc.paid + curr.paidAmount,
        balance: acc.balance + (curr.totalAmount - curr.paidAmount)
    }), { total: 0, paid: 0, balance: 0 });

    return (
        <div className="income-page">
            <header className="flex-between mb-2">
                <div>
                    <h1 className="text-gold">Income (Varavu)</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage Mess and Mahal income records</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={20} /> Add Entry
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

            <div className="glass-card mb-2" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <CalendarIcon size={20} className="text-gold" />
                <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: '150px', marginBottom: 0 }}>
                    {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} style={{ width: '100px', marginBottom: 0 }} />
            </div>

            <div className="stats-grid mb-2">
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Business</p>
                    <h2 className="text-gold">₹{totals.total}</h2>
                </div>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Paid Amount</p>
                    <h2 style={{ color: '#4CAF50' }}>₹{totals.paid}</h2>
                </div>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Balance Due</p>
                    <h2 style={{ color: '#F44336' }}>₹{totals.balance}</h2>
                </div>
            </div>

            <div className="table-container glass-card">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Client Name</th>
                            <th>Total Amount</th>
                            <th>Paid Amount</th>
                            <th>Balance</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {income.map((item) => (
                            <tr key={item._id}>
                                <td>{new Date(item.date).toLocaleDateString()}</td>
                                <td style={{ color: 'var(--primary)', fontWeight: '500' }}>{item.clientName}</td>
                                <td>₹{item.totalAmount}</td>
                                <td style={{ color: '#4CAF50' }}>₹{item.paidAmount}</td>
                                <td style={{ color: '#F44336' }}>₹{item.totalAmount - item.paidAmount}</td>
                                <td>
                                    <button onClick={() => handleDelete(item._id)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>
                                        <Trash2 size={18} />
                                    </button>
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
                           <h2 className="mb-2">Add {source} Income</h2>
                           <button onClick={() => setShowModal(false)} className="btn-outline" style={{ border: 'none' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Date</label>
                            <input name="date" type="date" value={formData.date} onChange={handleChange} required />
                            
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Client Name</label>
                            <input name="clientName" placeholder="Enter Client Name" value={formData.clientName} onChange={handleChange} required />
                            
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Amount</label>
                            <input name="totalAmount" type="number" placeholder="Enter Total Amount" value={formData.totalAmount} onChange={handleChange} required />
                            
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Paid Amount</label>
                            <input name="paidAmount" type="number" placeholder="Enter Paid Amount" value={formData.paidAmount} onChange={handleChange} required />
                            
                            <div className="flex-between mt-2" style={{ marginTop: '1.5rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Income</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Income;
