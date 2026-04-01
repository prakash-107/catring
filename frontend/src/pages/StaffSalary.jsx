import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Calendar as CalendarIcon, User, Search, IndianRupee, X } from 'lucide-react';

const StaffSalary = () => {
    const [salaries, setSalaries] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        staffName: '', date: '', amount: ''
    });

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const fetchSalaries = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/staff?month=${month}&year=${year}&search=${search}`);
            setSalaries(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchSalaries(); }, [month, year, search]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/staff', formData);
            setShowModal(false);
            setFormData({ staffName: '', date: '', amount: '' });
            fetchSalaries();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this salary record?')) {
            await axios.delete(`http://localhost:5000/api/staff/${id}`);
            fetchSalaries();
        }
    };

    const totalSalaryPaid = salaries.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="staff-salary-page">
            <header className="flex-between mb-2">
                <div>
                    <h1 className="text-gold">Staff Salary Management</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Track and manage employee payments</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={20} /> Record Salary
                </button>
            </header>

            <div className="flex-between mb-2" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                <div className="glass-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: 0, flex: 1 }}>
                    <Search size={20} className="text-gold" />
                    <input 
                        placeholder="Search Staff Name..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        style={{ marginBottom: 0, background: 'transparent', border: 'none' }}
                    />
                </div>
                <div className="glass-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: 0 }}>
                    <CalendarIcon size={20} className="text-gold" />
                    <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: '150px', marginBottom: 0 }}>
                        {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select>
                    <input type="number" value={year} onChange={(e) => setYear(e.target.value)} style={{ width: '100px', marginBottom: 0 }} />
                </div>
                <div className="glass-card" style={{ margin: 0, padding: '0.8rem 2rem' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Total Monthly Payroll</p>
                    <h2 className="text-gold">₹{totalSalaryPaid}</h2>
                </div>
            </div>

            <div className="table-container glass-card">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Staff Name</th>
                            <th>Amount Paid</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salaries.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No salary records found for this period.</td></tr>}
                        {salaries.map((item) => (
                            <tr key={item._id}>
                                <td>{new Date(item.date).toLocaleDateString()}</td>
                                <td style={{ color: 'var(--primary)', fontWeight: '500' }}>{item.staffName}</td>
                                <td style={{ color: '#4CAF50', fontWeight: 'bold' }}>₹{item.amount}</td>
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
                           <h2 className="mb-2">Record Staff Salary</h2>
                           <button onClick={() => setShowModal(false)} className="btn-outline" style={{ border: 'none' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Staff Name</label>
                            <input name="staffName" placeholder="Enter Staff Name" value={formData.staffName} onChange={handleChange} required />
                            
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Date</label>
                            <input name="date" type="date" value={formData.date} onChange={handleChange} required />
                            
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Amount Paid</label>
                            <input name="amount" type="number" placeholder="Enter Amount" value={formData.amount} onChange={handleChange} required />
                            
                            <div className="flex-between mt-2" style={{ marginTop: '1.5rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Salary</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffSalary;
