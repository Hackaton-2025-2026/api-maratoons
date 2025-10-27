// Models du group

const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    owner_id: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
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

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;

