const jwtService = require('../services/jwt/jwt.service');

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

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
