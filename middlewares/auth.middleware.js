const jwtService = require('../services/jwt/jwt.service');

function verifyToken(req, res, next) {
    // Try to get token from cookie first, then fall back to Authorization header
    let token = req.cookies?.auth_token;

    // If no cookie, check Authorization header (for backward compatibility)
    if (!token) {
        const authHeader = req.headers["authorization"];
        token = authHeader && authHeader.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Token manquant ou invalide" });
    }

    try {
        req.user = jwtService.getUserByToken(token);
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token invalide ou expiré" });
    }
}

module.exports = {
    verifyToken
}
