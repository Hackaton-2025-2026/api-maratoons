const User = require('../../models/User');
const User_bet = require('../../models/User_bet');
const Bets = require('../../models/Bets');
const JoinGroup = require('../../models/JoinGroup');
const Group = require('../../models/Group');
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

/**
 * Récupérer tous les paris futurs des amis d'un utilisateur
 * (les users qui sont dans les mêmes groupes que l'utilisateur)
 */
async function getFriendsFutureBets(userId) {
    // 1. Trouver tous les groupes où l'utilisateur fait partie
    const userGroups = await JoinGroup.find({ user_id: userId });
    const groupIds = userGroups.map(ug => ug.group_id.toString());
    
    if (groupIds.length === 0) {
        return [];
    }
    
    // 2. Trouver tous les autres utilisateurs qui sont dans ces groupes
    const friendsJoins = await JoinGroup.find({ 
        group_id: { $in: groupIds },
        user_id: { $ne: userId } // Exclure l'utilisateur lui-même
    });
    
    const friendIds = [...new Set(friendsJoins.map(fj => fj.user_id.toString()))];
    
    if (friendIds.length === 0) {
        return [];
    }
    
    // 3. Récupérer tous les paris de ces amis
    const friendBets = await User_bet.find({ 
        user_id: { $in: friendIds }
    }).populate({ path: 'bet_id', model: 'Bets' }).populate({ path: 'user_id', model: 'User', select: 'nom email' });
    
    // 4. Filtrer pour ne garder que les paris sur des courses futures
    const { validateRaceExists } = require('../race/race.service');
    const futureBets = [];
    
    const today = new Date();
    
    // Récupérer les groupes de tous les amis
    const friendsGroupJoins = await JoinGroup.find({
        user_id: { $in: friendIds }
    }).populate({ path: 'group_id', model: 'Group' });
    
    // Organiser les groupes par user_id
    const groupsByUserId = {};
    for (const join of friendsGroupJoins) {
        const userId = join.user_id.toString();
        if (!groupsByUserId[userId]) {
            groupsByUserId[userId] = [];
        }
        groupsByUserId[userId].push(join.group_id);
    }

    for (const bet of friendBets) {
        if (bet.bet_id && bet.bet_id.race_id) {
            const raceValidation = await validateRaceExists(bet.bet_id.race_id);
            
            if (raceValidation.exists) {
                const race = raceValidation.data;
                const raceDate = new Date(race.startDate);
                
                // Vérifier que la course est dans le futur
                if (raceDate > today) {
                    const userId = bet.user_id._id.toString();
                    const userGroups = groupsByUserId[userId] || [];
                    
                    futureBets.push({
                        ...bet.toObject(),
                        race_info: {
                            id: race.id,
                            name: race.name,
                            startDate: race.startDate,
                            kilometer: race.kilometer
                        },
                        user_groups: userGroups.map(group => ({
                            _id: group._id,
                            name: group.name,
                            code: group.code
                        }))
                    });
                }
            }
        }
    }
    
    return futureBets;
}

module.exports = {
    createUser,
    findUserByEmail,
    checkPassword,
    findUserById,
    getFriendsFutureBets
}