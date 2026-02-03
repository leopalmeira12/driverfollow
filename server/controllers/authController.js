const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_ultra_secreto_da_nasa_2026';

// Fallback Memory Store (Persist during server runtime)
if (!global.memoryUsers) global.memoryUsers = [];

exports.register = async (req, res) => {
    try {
        const { name, email, password, referralCode } = req.body;
        console.log('📝 Registering:', email);

        // Generate unique referral code for new user
        const newReferralCode = 'TD' + Math.random().toString(36).substr(2, 6).toUpperCase();

        let user;
        let referrer = null;

        // Check if referral code is valid
        if (referralCode) {
            if (global.HAS_DB) {
                referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
            } else {
                referrer = global.memoryUsers.find(u => u.referralCode === referralCode.toUpperCase());
            }
        }

        if (global.HAS_DB) {
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ error: 'Email já cadastrado.' });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = await User.create({
                name, email, password: hashedPassword, credits: 10, plan: 'free', role: 'driver',
                referralCode: newReferralCode,
                referredBy: referrer?._id || null
            });

            // Credit referrer if exists
            if (referrer) {
                await User.findByIdAndUpdate(referrer._id, { $inc: { credits: 50 } });
                console.log('🎁 Referral bonus: +50 CR to', referrer.email);
            }
        } else {
            // Memory Path
            if (global.memoryUsers.find(u => u.email === email)) return res.status(400).json({ error: 'Email já cadastrado.' });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = {
                _id: 'mem_u_' + Date.now(),
                name, email, password: hashedPassword, credits: 10, plan: 'free', role: 'driver',
                referralCode: newReferralCode,
                referredBy: referrer?._id || null,
                viewedVideos: []
            };
            global.memoryUsers.push(user);

            // Credit referrer if exists (memory mode)
            if (referrer) {
                referrer.credits = (referrer.credits || 0) + 50;
                console.log('🎁 Referral bonus: +50 CR to', referrer.email);
            }

            console.log('⚠️ Saved to Global Memory (No DB):', user.email);
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                credits: user.credits,
                referralCode: user.referralCode
            }
        });

    } catch (err) {
        console.error('Register Error:', err.message);
        res.status(500).json({ error: 'Erro interno no servidor.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('🔑 Logging in:', email);

        let user;

        if (global.HAS_DB) {
            user = await User.findOne({ email });
        } else {
            user = global.memoryUsers.find(u => u.email === email);
        }

        if (!user) return res.status(400).json({ error: 'Conta não encontrada.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Senha incorreta.' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, credits: user.credits || 10 }
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Try Memory First
        let userFound = global.memoryUsers?.find(u => u._id === userId);

        if (userFound) {
            const { password, ...userWithoutPass } = userFound;
            return res.json(userWithoutPass);
        }

        // 2. Try DB if available and ID is valid
        if (global.HAS_DB && mongoose.Types.ObjectId.isValid(userId)) {
            const user = await User.findById(userId).select('-password');
            if (user) return res.json(user);
        }

        // 3. Fallback: If token is valid but user is gone (server reset) OR DB is down
        // Return a stable ghost user to keep the app working
        return res.json({
            _id: userId,
            name: 'Motorista TubeDrivers',
            email: 'parceiro@tubedrivers.com',
            credits: 10,
            plan: 'free',
            role: 'driver',
            referralCode: 'TD' + userId.substr(-6).toUpperCase()
        });

    } catch (err) {
        console.error('GetMe Error:', err.message);
        // Ensure even on error we return something or a clear 401
        res.status(401).json({ error: 'Sessão expirada.' });
    }
};
