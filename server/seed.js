const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Video = require('./models/Video');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/driverfollow', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('🌱 MongoDB Connected for Seeding');

        // Clear existing
        await User.deleteMany({});
        await Video.deleteMany({});

        // Create Test User (The current user)
        const me = await User.create({
            googleId: '123_test_me',
            email: 'motorista@teste.com',
            name: 'Carlos Motorista',
            credits: 10,
            _id: '65b2f8c9e4b0a1b2c3d4e5f6' // Hardcoded ID matching the frontend mock
        });

        // Create Mission Users
        const user1 = await User.create({ name: 'João Uber', email: 'joao@test.com', googleId: 'u1' });
        const user2 = await User.create({ name: 'Maria 99', email: 'maria@test.com', googleId: 'u2' });

        // Create Videos
        await Video.create([
            {
                user: user1._id,
                youtubeVideoId: 'frhX7qX6i2k', // Lofi Girl (Safe sample)
                title: 'Dia de Chuva em SP - Faturando Alto',
                thumbnailUrl: 'https://img.youtube.com/vi/frhX7qX6i2k/maxresdefault.jpg',
                duration: '300', // 5 mins
                targetViews: 100,
                status: 'active'
            },
            {
                user: user2._id,
                youtubeVideoId: 'jfKfPfyJRdk', // Lofi standard
                title: 'Dicas para iniciantes na Uber 2026',
                thumbnailUrl: 'https://img.youtube.com/vi/jfKfPfyJRdk/maxresdefault.jpg',
                duration: '180', // 3 mins
                targetViews: 50,
                status: 'active'
            }
        ]);

        console.log('✅ Database Seeded!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
