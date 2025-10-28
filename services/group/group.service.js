const Group = require('../../models/Group');
const JoinGroup = require('../../models/JoinGroup');
const userService = require('../user/user.service');

async function getAllUsersByGroup(group_id){
    const groupIdString = group_id.toString();
    const users = await JoinGroup.find({group_id: groupIdString});
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
    
    // Ajouter automatiquement le créateur comme membre du groupe
    const newJoin = new JoinGroup({user_id, group_id: newGroup._id.toString()});
    await newJoin.save();
    
    return newGroup;
}

async function joinGroup(user_id, code){
    const group = await Group.findOne({
        code: code
    });
    const group_id = group._id.toString();
    const newJoin = new JoinGroup({user_id, group_id})
    await newJoin.save();
    return newJoin;
}

async function leaveGroup(user_id, group_id){
    const groupIdString = group_id.toString();
    const result = await JoinGroup.deleteOne({user_id, group_id: groupIdString});

    const group = await Group.findById(group_id);

    if(user_id === group.owner_id){
        await deleteGroup(group_id);
    }
    return result;
}

async function banUser(group_id,user_id,user_id_to_ban){
    const group = await Group.findOne({_id:group_id});

    if(group.owner_id !== user_id){
        return "Only the group owner can ban users.";
    }

    console.log(user_id_to_ban);
    const groupIdString = group_id.toString();
    const result = await JoinGroup.deleteOne({user_id: user_id_to_ban, group_id: groupIdString});

    return result;
}

async function updateGroup(groupe_id, group){
    const updatedGroup = await Group.findByIdAndUpdate(groupe_id, group, { new: true });
    return updatedGroup;
}

async function deleteGroup(groupe_id){
    await JoinGroup.deleteMany({ group_id: groupe_id.toString() });
    const group = await Group.findByIdAndDelete(groupe_id);
    return group;
}

async function getGroupById(groupe_id){
    const group = await Group.findById(groupe_id);
    return group;
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
    getAllUserRankByGroup,
    updateGroup,
    deleteGroup,
    getGroupById
}