const User = require('../../models/User');
const bcrypt = require('bcrypt');

async function createUser(user) {
    const userToCreate = new User(user);
    userToCreate.password = await bcrypt.hash(userToCreate.password, 8);
    await userToCreate.save();

    return userToCreate;
}

async function findUserByEmail(email) {
    const user = await User.findOne({ email: email });
    if (!user) {
        return null;
    }

    return user;
}

async function checkPassword(user, password) {
    if (!user || !user.password) {
        throw new Error("Utilisateur ou mot de passe non défini");
    }
    return await bcrypt.compare(password, user.password);
}

async function findUserById(id) {
    const user = await User.findById(id);
    if (!user) {
        return null;
    }

    return user;
}

module.exports = {
    createUser,
    findUserByEmail,
    checkPassword,
    findUserById
}