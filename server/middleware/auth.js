const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_ultra_secreto_da_nasa_2026';

module.exports = function (req, res, next) {
    // 1. Get token from header
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

    // 2. Mock Support (Dev Mode only) - Remove in Prod if strict
    const mockId = req.header('x-mock-user-id');
    if (!token && mockId) {
        // console.warn('⚠️ Usando Mock User ID (Inseguro)');
        req.user = { id: mockId };
        return next();
    }

    // 3. Check if no token
    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Faça login.' });
    }

    // 4. Verify token
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, role, iat, exp }
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
};
