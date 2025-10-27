const Group = require('../../models/Group');
const JoinGroup = require('../../models/JoinGroup');

async function createGroup(group){
    const newGroup = new Group(group)
    await newGroup.save();
    return newGroup;
}


async function joinGroup(user_id, group_id){
    const newJoin = new JoinGroup({user_id, group_id})
    await newJoin.save();
    return newJoin;
}

module.exports = {
    createGroup,
}