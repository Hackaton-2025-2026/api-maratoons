// Models du group

const mongoose = require('mongoose');

const joinGroupSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        trim: true
    },
    group_id: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now

    }
});

const JoinGroup = mongoose.model('Group', joinGroupSchema);

module.exports = JoinGroup;

