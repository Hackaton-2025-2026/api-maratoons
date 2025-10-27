const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

async function createToken(user){
    const token = jwt.sign(
        { id: user._id, email: user.email },
        secret
    );

    return token;
}

module.exports = {
    createToken,
}