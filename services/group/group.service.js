const Group = require('../../models/Group');
const JoinGroup = require('../../models/JoinGroup');
const userService = require('../user/user.service');

async function getAllUsersByGroup(group_id){
    const users = await JoinGroup.find({group_id});
    return users;
}

async function getAllGroup(){
    const group = await Group.find({});
    return group;
}

async function createGroup(name, user_id){
    const code = Math.random().toString(10).substring(2, 8);
    const group = {owner_id: user_id, name, code: code}
    console.log(group)
    const newGroup = new Group(group);
    await newGroup.save();
    return newGroup;
}

async function joinGroup(user_id, code){
    const group = await Group.findOne({
        code: code
    });

    if(user_id === group.owner_id){
        return "The owner is already in the group.";
    }

    const alreadyInGroup = await JoinGroup.findOne({
        user_id,
        group_id: group._id
    });

    if(alreadyInGroup){
        return "User is already in the group.";
    }

    const group_id = group._id;
    const newJoin = new JoinGroup({user_id, group_id})
    await newJoin.save();
    return newJoin;
}

async function leaveGroup(user_id, group_id){
    const result = await JoinGroup.deleteOne({user_id, group_id});
    return result;
}

async function banUser(group_id,user_id,user_id_to_ban){
    const group = await Group.findOne({_id:group_id});

    if(group.owner_id !== user_id){
        return "Only the group owner can ban users.";
    }

    console.log(user_id_to_ban);
    const result = await JoinGroup.deleteOne({user_id: user_id_to_ban, group_id});

    return result;
}

async function getAllUserRankByGroup(group_id){

    const joinGroups = await JoinGroup.find({group_id});

    let listUsers = [];
    for(const joinGroup of joinGroups){
        const user = await userService.findUserById(joinGroup.user_id);
        listUsers.push(user);
    }

    listUsers = listUsers.sort((a, b) => a.solde > b.solde);

    return listUsers;
}

module.exports = {
    createGroup,
    joinGroup,
    getAllUsersByGroup,
    leaveGroup,
    banUser,
    getAllGroup,
    getAllUserRankByGroup
}