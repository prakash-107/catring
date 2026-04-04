const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Models
const User = require('./models/User');
const Event = require('./models/Event');
const Income = require('./models/Income');
const Expense = require('./models/Expense');
const StaffSalary = require('./models/StaffSalary');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'sree_gajananan_secret_key_123';

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/catering_db')
    .then(() => {
        console.log('Connected to MongoDB');
        seedAdmin();
    })
    .catch(err => console.error('Could not connect to MongoDB', err));

// Initial Admin Seeding
async function seedAdmin() {
    try {
        const adminUsername = process.env.ADMIN_USER || 'sree_admin_secure';
        const adminPassword = process.env.ADMIN_PASS || 'SreeGajananan@2026!StrongAdmin';
        
        const adminExists = await User.findOne({ username: adminUsername });
        if (!adminExists) {
            const admin = new User({
                username: adminUsername,
                password: adminPassword,
                name: 'Sree Gajananan Admin'
            });
            await admin.save();
            console.log('Strong admin user seeded successfully');
        }
    } catch (err) {
        console.error('Error seeding admin:', err);
    }
}

// Middleware for JWT Authentication
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};

// --- AUTH ROUTES ---
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { name: user.name, username: user.username } });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- EVENT ROUTES ---
app.get('/api/events', authenticate, async (req, res) => {
    const { month, year } = req.query;
    let query = {};
    if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        query.date = { $gte: startDate, $lte: endDate };
    }
    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
});

app.post('/api/events', authenticate, async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.json(newEvent);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.put('/api/events/:id', authenticate, async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEvent);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.delete('/api/events/:id', authenticate, async (req, res) => {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
});

// --- INCOME ROUTES ---
app.get('/api/income', authenticate, async (req, res) => {
    const { month, year, source } = req.query;
    let query = {};
    if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        query.date = { $gte: startDate, $lte: endDate };
    }
    if (source) query.source = source;
    const income = await Income.find(query).sort({ date: 1 });
    res.json(income);
});

app.post('/api/income', authenticate, async (req, res) => {
    const newIncome = new Income(req.body);
    await newIncome.save();
    res.json(newIncome);
});

app.put('/api/income/:id', authenticate, async (req, res) => {
    try {
        const updatedIncome = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedIncome);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.delete('/api/income/:id', authenticate, async (req, res) => {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: 'Income entry deleted' });
});

// --- EXPENSE ROUTES ---
app.get('/api/expenses', authenticate, async (req, res) => {
    const { month, year, source } = req.query;
    let query = {};
    if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        query.date = { $gte: startDate, $lte: endDate };
    }
    if (source) query.source = source;
    const expenses = await Expense.find(query).sort({ date: 1 });
    res.json(expenses);
});

app.post('/api/expenses', authenticate, async (req, res) => {
    const newExpense = new Expense(req.body);
    await newExpense.save();
    res.json(newExpense);
});

app.put('/api/expenses/:id', authenticate, async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedExpense);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.delete('/api/expenses/:id', authenticate, async (req, res) => {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense entry deleted' });
});

// --- STAFF SALARY ROUTES ---
app.get('/api/staff', authenticate, async (req, res) => {
    const { month, year, search } = req.query;
    let query = {};
    if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        query.date = { $gte: startDate, $lte: endDate };
    }
    if (search) {
        query.staffName = { $regex: search, $options: 'i' };
    }
    const salaries = await StaffSalary.find(query).sort({ date: 1 });
    res.json(salaries);
});

app.post('/api/staff', authenticate, async (req, res) => {
    const newSalary = new StaffSalary(req.body);
    await newSalary.save();
    res.json(newSalary);
});

app.put('/api/staff/:id', authenticate, async (req, res) => {
    try {
        const updatedSalary = await StaffSalary.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSalary);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.delete('/api/staff/:id', authenticate, async (req, res) => {
    await StaffSalary.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff salary entry deleted' });
});

// --- REPORT ROUTES ---
app.get('/api/reports', authenticate, async (req, res) => {
    const { type, date, startDate, endDate } = req.query;
    let query = {};
    
    if (type === 'daily') {
        const d = new Date(date);
        const start = new Date(d.setHours(0,0,0,0));
        const end = new Date(d.setHours(23,59,59,999));
        query.date = { $gte: start, $lte: end };
    } else if (type === 'weekly') {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (type === 'monthly') {
        const [year, month] = date.split('-');
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);
        query.date = { $gte: start, $lte: end };
    }

    try {
        const events = await Event.find(query);
        const income = await Income.find(query);
        const expenses = await Expense.find(query);
        const salaries = await StaffSalary.find(query);

        res.json({ events, income, expenses, salaries });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
