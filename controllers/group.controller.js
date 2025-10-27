const groupService = require('../services/group/group.service');

const getAllUserByGroup = async (req, res) => {
    try{
        const newGroup = await groupService.getAllUsersByGroup(req.params.id);
        return res.status(200).send(newGroup);
    }catch (error){
        res.status(500).send({error: error});
    }
}

const getAllGroup = async (req, res) => {
    try{
        const newGroup = await groupService.getAllGroup(req.params.id);
        return res.status(200).send(newGroup);
    }catch (error){
        res.status(500).send({error: error});
    }
}


const createGroup = async (req, res) => {
    try{
        const newGroup = await groupService.createGroup(req.body.name, req.user.id);
        return res.status(201).send(newGroup);
    }catch (error){
        res.status(500).send({error: error});
    }
}

const joinGroup = async (req, res) => {
    try{
        const newGroup = await groupService.joinGroup(req.user.id,req.params.code);
        return res.status(201).send(newGroup);
    }catch (error){
        res.status(500).send({error: error});
    }
}

const leaveGroup = async (req, res) => {
    try{
        const result = await groupService.leaveGroup(req.user.id, req.params.id);
        return res.status(200).send(result);
    }catch (error){
        res.status(500).send({error: error});
    }
}

const banUser = async (req, res) => {
    try{
        const result = await groupService.banUser(req.params.id,req.user.id, req.body.userToBan);
        return res.status(200).send(result);
    }catch (error){
        res.status(500).send({error: error});
    }
}

module.exports = {
    createGroup,
    getAllUserByGroup,
    joinGroup,
    leaveGroup,
    banUser,
    getAllGroup
}