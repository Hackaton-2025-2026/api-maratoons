const groupService = require('../services/group/group.service');

const createGroup = (req, res) => {
    try{
        const newGroup = groupService.createGroup(req.body);
        return res.status(201).send(newGroup);
    }catch (error){
        res.status(500).send({error: error});
    }
}

const getAllUserByGroup = (req, res) => {
    try{
        const newGroup = groupService.createGroup(req.body);
        return res.status(201).send(newGroup);
    }catch (error){
        res.status(500).send({error: error});
    }
}

const joinGroup = (req, res) => {
    try{
        const newGroup = groupService.joinGroup(req.body.group_id, req.body.user_id);
        return res.status(201).send(newGroup);
    }catch (error){
        res.status(500).send({error: error});
    }
}

module.exports = {
    createGroup,
    getAllUserByGroup,
    joinGroup
}