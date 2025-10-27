const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

async function createToken(user){
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        secret
    );

    return token;
}

function getUserByToken(token){
    return jwt.verify(token, secret);
}

module.exports = {
    createToken,
    getUserByToken
}