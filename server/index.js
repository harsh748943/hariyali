const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Plant = require('./models/Plant');
const User = require('./models/User');
const Tip = require('./models/Tip');
const { PLANT_DATA, GARDENING_TIPS } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');
    // Seed database on initial connection if empty
    await seedDatabase();
  })
  .catch(err => console.error('MongoDB connection error:', err));


// --- Data Seeding ---
const seedDatabase = async () => {
    try {
        const plantCount = await Plant.countDocuments();
        if (plantCount === 0) {
            console.log('No plants found, seeding database...');
            // Remap IDs to MongoDB's _id format
            const plantsToSeed = PLANT_DATA.map(({ id, ...rest }) => rest);
            await Plant.insertMany(plantsToSeed);
            console.log('Plant data seeded.');
        }

        const tipCount = await Tip.countDocuments();
        if (tipCount === 0) {
            console.log('No tips found, seeding database...');
            const tipsToSeed = GARDENING_TIPS.map(({ id, ...rest }) => rest);
            await Tip.insertMany(tipsToSeed);
            console.log('Gardening tips seeded.');
        }

    } catch (error) {
        console.error('Error seeding database:', error);
    }
};


// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};


// --- API Routes ---

// --- Auth Routes ---
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }
        
        // Admins are hardcoded for this demo app
        const role = email.endsWith('@verdantvogue.admin') ? 'admin' : 'user';

        const user = new User({ name, email, password, role });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error during signup.', error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });

    } catch (error) {
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});


// --- Public Routes ---
app.get('/api/plants', async (req, res) => {
    try {
        const plants = await Plant.find({});
        res.json(plants);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch plants' });
    }
});

app.get('/api/plants/:id', async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id);
        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }
        res.json(plant);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch plant' });
    }
});

app.get('/api/tips', async (req, res) => {
    try {
        const tips = await Tip.find({});
        res.json(tips);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tips' });
    }
});


// --- Protected Cart Routes ---
app.get('/api/cart', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.plant');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Filter out items where the plant might have been deleted
        const validCartItems = user.cart.filter(item => item.plant);
        
        // We need to transform the data to match the frontend's CartItem interface
        const cartItems = validCartItems.map(item => ({
            ...item.plant.toObject(),
            quantity: item.quantity
        }));
        
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get cart', error: error.message });
    }
});

const getUserCart = async (userId) => {
    const user = await User.findById(userId).populate('cart.plant');
    const validCartItems = user.cart.filter(item => item.plant);
    return validCartItems.map(item => ({
        ...item.plant.toObject(),
        quantity: item.quantity
    }));
};

app.post('/api/cart', authenticateToken, async (req, res) => {
    try {
        const { plantId, quantity } = req.body;
        const user = await User.findById(req.user.id);
        const plant = await Plant.findById(plantId);
        if (!plant) return res.status(404).json({ message: 'Plant not found' });

        const cartItemIndex = user.cart.findIndex(item => item.plant.toString() === plantId);

        if (cartItemIndex > -1) {
            user.cart[cartItemIndex].quantity += quantity;
        } else {
            user.cart.push({ plant: plantId, quantity });
        }
        await user.save();
        const populatedCart = await getUserCart(req.user.id);
        res.json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add to cart', error: error.message });
    }
});

app.put('/api/cart/:plantId', authenticateToken, async (req, res) => {
    try {
        const { plantId } = req.params;
        const { quantity } = req.body;
        const user = await User.findById(req.user.id);

        const cartItemIndex = user.cart.findIndex(item => item.plant.toString() === plantId);
        if (cartItemIndex > -1) {
            if (quantity <= 0) {
                user.cart.splice(cartItemIndex, 1);
            } else {
                user.cart[cartItemIndex].quantity = quantity;
            }
            await user.save();
            const populatedCart = await getUserCart(req.user.id);
            res.json(populatedCart);
        } else {
            res.status(404).json({ message: 'Item not in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update quantity', error: error.message });
    }
});

app.delete('/api/cart/:plantId', authenticateToken, async (req, res) => {
    try {
        const { plantId } = req.params;
        await User.updateOne({ _id: req.user.id }, { $pull: { cart: { plant: plantId } } });
        const populatedCart = await getUserCart(req.user.id);
        res.json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove from cart', error: error.message });
    }
});


// --- Protected Admin Routes ---
app.put('/api/admin/plants/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { stock } = req.body;
        const updatedPlant = await Plant.findByIdAndUpdate(
            req.params.id, 
            { stock }, 
            { new: true }
        );
        if (!updatedPlant) return res.status(404).json({ message: 'Plant not found' });
        res.json(updatedPlant);
    } catch(error) {
        res.status(500).json({ message: 'Failed to update stock', error: error.message });
    }
});

app.post('/api/admin/tips', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newTip = new Tip({ title, content });
        await newTip.save();
        res.status(201).json(newTip);
    } catch(error) {
        res.status(500).json({ message: 'Failed to create tip', error: error.message });
    }
});


// // --- Start Server ---
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
module.exports = app;