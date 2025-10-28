const { Server } = require("socket.io");
const groupService = require("../group/group.service");
const listUserConnected = []

function connectSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {

        const user = socket.id;

        listUserConnected.push(user);

        console.log(user);

        socket.on('disconnect', () => {
            console.log('user disconnected');

            const index = listUserConnected.indexOf(user);
            if (index > -1) {
                listUserConnected.splice(index, 1);
            }
        });

        socket.on('getGroupRank', async (groupId) => {
            console.log("group id receive : " + groupId);
            const listUser = await groupService.getAllUserRankByGroup(groupId)

            console.log(listUser);
            socket.emit('getGroupRank', listUser);
        })
    });
}

module.exports = {
    connectSocket
}