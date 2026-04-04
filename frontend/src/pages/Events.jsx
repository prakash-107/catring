import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Plus, Trash2, Edit, Calendar as CalendarIcon, MapPin, User, Phone, Clock, List, X } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        date: '', deliveryTime: '', menuDetails: '', clientName: '', clientPhone: '', location: ''
    });

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const fetchEvents = async () => {
        try {
            const res = await api.get(`/api/events?month=${month}&year=${year}`);
            setEvents(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchEvents(); }, [month, year]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/api/events/${editId}`, formData);
            } else {
                await api.post('/api/events', formData);
            }
            
            setShowModal(false);
            setEditId(null);
            setFormData({ date: '', deliveryTime: '', menuDetails: '', clientName: '', clientPhone: '', location: '' });
            fetchEvents();
        } catch (err) { console.error(err); }
    };

    const handleEdit = (event) => {
        setEditId(event._id);
        setFormData({
            date: new Date(event.date).toISOString().split('T')[0],
            deliveryTime: event.deliveryTime,
            menuDetails: event.menuDetails,
            clientName: event.clientName,
            clientPhone: event.clientPhone,
            location: event.location
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this event?')) {
            await api.delete(`/api/events/${id}`);
            fetchEvents();
        }
    };

    return (
        <div className="events-page">
            <header className="flex-between mb-2">
                <div>
                    <h1 className="text-gold">Events Management</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Month-wise catering event schedule</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={20} /> Add Event
                </button>
            </header>

            <div className="glass-card mb-2" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <CalendarIcon size={20} className="text-gold" />
                <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: '150px', marginBottom: 0 }}>
                    {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} style={{ width: '100px', marginBottom: 0 }} />
            </div>

            <div className="events-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {events.length === 0 && <p className="text-secondary">No events found for this month.</p>}
                {events.map((event) => (
                    <div key={event._id} className="glass-card">
                        <div className="flex-between" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                           <h3 className="text-gold">{new Date(event.date).toLocaleDateString()}</h3>
                           <div style={{ display: 'flex', gap: '0.5rem' }}>
                               <button onClick={() => handleEdit(event)} style={{ background: 'transparent', border: 'none', color: 'var(--text-gold)', cursor: 'pointer' }}>
                                   <Edit size={18} />
                               </button>
                               <button onClick={() => handleDelete(event._id)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>
                                   <Trash2 size={18} />
                               </button>
                           </div>
                        </div>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <User size={16} className="text-gold" /> {event.clientName}
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Phone size={16} className="text-gold" /> {event.clientPhone}
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Clock size={16} className="text-gold" /> {event.deliveryTime}
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <MapPin size={16} className="text-gold" /> {event.location}
                        </p>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '8px', marginTop: '1rem' }}>
                            <h4 style={{ fontSize: '0.8rem', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>Menu Details</h4>
                            <p style={{ fontSize: '0.9rem' }}>{event.menuDetails}</p>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="flex-between mb-2">
                           <h2>{editId ? 'Edit Catering Event' : 'Add New Catering Event'}</h2>
                           <button onClick={() => { setShowModal(false); setEditId(null); setFormData({ date: '', deliveryTime: '', menuDetails: '', clientName: '', clientPhone: '', location: '' }); }} className="btn-outline" style={{ border: 'none' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <input name="date" type="date" value={formData.date} onChange={handleChange} required />
                            <input name="deliveryTime" placeholder="Delivery Time (e.g. 10:00 AM)" value={formData.deliveryTime} onChange={handleChange} required />
                            <input name="clientName" placeholder="Client Name" value={formData.clientName} onChange={handleChange} required />
                            <input name="clientPhone" placeholder="Client Phone" value={formData.clientPhone} onChange={handleChange} required />
                            <input name="location" placeholder="Function Location" value={formData.location} onChange={handleChange} required />
                            <textarea name="menuDetails" placeholder="Menu Details" rows="4" value={formData.menuDetails} onChange={handleChange} required style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', width: '100%', padding: '0.8rem' }}></textarea>
                            <div className="flex-between mt-2" style={{ marginTop: '1.5rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
