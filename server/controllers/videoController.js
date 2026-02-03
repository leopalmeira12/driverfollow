const Video = require('../models/Video');
const User = require('../models/User');

// Use global to persist during server runtime
if (!global.memoryVideos) global.memoryVideos = [];

const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

exports.addVideo = async (req, res) => {
    try {
        const { url, title } = req.body;
        const userId = req.user.id;

        const youtubeId = getYoutubeId(url);
        if (!youtubeId) return res.status(400).json({ error: 'URL do YouTube inválida.' });

        const videoData = {
            user: userId,
            youtubeVideoId: youtubeId,
            title: title || `Vídeo ${youtubeId}`,
            thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`,
            targetViews: 100,
            completedViews: 0,
            status: 'active',
            createdAt: new Date()
        };

        let savedVideo = null;
        if (global.HAS_DB) {
            try {
                savedVideo = await Video.create(videoData);
            } catch (e) {
                console.error('⚠️ DB create failed, falling back to Memory');
            }
        }

        if (!savedVideo) {
            savedVideo = { ...videoData, _id: 'mem_v_' + Date.now() };
            global.memoryVideos.push(savedVideo);
        }

        // Map to standard names for frontend
        const responseData = {
            ...savedVideo.toObject ? savedVideo.toObject() : savedVideo,
            youtubeId: savedVideo.youtubeVideoId,
            thumbnail: savedVideo.thumbnailUrl
        };

        res.json({ success: true, video: responseData });

    } catch (err) {
        res.status(500).json({ error: 'Erro técnico ao adicionar vídeo.' });
    }
};

exports.getMyVideos = async (req, res) => {
    try {
        const userId = req.user.id;
        let dbVideos = [];

        if (global.HAS_DB) {
            try {
                dbVideos = await Video.find({ user: userId }).sort({ createdAt: -1 });
            } catch (e) { }
        }

        const memVideos = global.memoryVideos.filter(v => v.user === userId);
        const allVideos = [...dbVideos, ...memVideos];

        // Map everything to stable fields for frontend consistency
        const mappedVideos = allVideos.map(v => {
            const obj = v.toObject ? v.toObject() : v;
            return {
                ...obj,
                youtubeId: obj.youtubeVideoId,
                thumbnail: obj.thumbnailUrl
            };
        });

        // Filter duplicates by youtubeId
        const uniqueVideos = Array.from(new Map(mappedVideos.map(v => [v.youtubeId, v])).values());
        res.json(uniqueVideos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

    } catch (err) {
        res.status(500).json({ error: 'Erro ao carregar vídeos.' });
    }
};

// Get community videos (videos from other users)
exports.getCommunityVideos = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 4;
        let dbVideos = [];

        if (global.HAS_DB) {
            try {
                dbVideos = await Video.find({ status: 'active' })
                    .populate('user', 'name')
                    .sort({ createdAt: -1 })
                    .limit(limit * 2); // Get more to filter and randomize
            } catch (e) {
                console.log('DB query failed, using memory');
            }
        }

        const memVideos = global.memoryVideos.filter(v => v.status === 'active');
        const allVideos = [...dbVideos, ...memVideos];

        // Map to stable fields
        const mappedVideos = allVideos.map(v => {
            const obj = v.toObject ? v.toObject() : v;
            return {
                _id: obj._id,
                youtubeId: obj.youtubeVideoId,
                thumbnail: obj.thumbnailUrl,
                title: obj.title,
                duration: obj.duration || '40:00',
                durationSeconds: obj.durationSeconds || 2400,
                owner: obj.user?.name || 'Motorista',
                completedViews: obj.completedViews || 0,
                targetViews: obj.targetViews || 100
            };
        });

        // Shuffle and limit
        const shuffled = mappedVideos.sort(() => 0.5 - Math.random());
        const limited = shuffled.slice(0, limit);

        res.json({ videos: limited });

    } catch (err) {
        console.error('Error fetching community videos:', err);
        res.status(500).json({ error: 'Erro ao carregar vídeos da comunidade.' });
    }
};
