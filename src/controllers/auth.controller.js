const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
        name,
        email,
        password: hashedPassword,
        });

        res.status(201).json({
        message: 'User created successfully',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
    };

    exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
        { id: user._id },
        JWT_SECRET,
        { expiresIn: '1h' }
        );

        res.json({
        message: 'Login successful',
        token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
