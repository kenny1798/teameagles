const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require ('body-parser');
require('dotenv').config()
const port = parseInt(process.env.SERVER_PORT, 10);
const db = require('./models');
const fs = require('fs');
const http = require('http');
const {Server} = require('socket.io');
const path = require('path');
const { users, wsauth } = require('./models');
const { validateToken } = require('./middlewares/AuthMiddleware');
const { Client, LocalAuth } = require('whatsapp-web.js');
var qrcode = require('qrcode-terminal')

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({
    extended:true
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
})
app.use('/media', express.static('media'));

const server = http.createServer(app);
const sockets = new Map();

const serverOrigins = ["http://192.168.1.25:3000", "http://localhost:3000"];

const io = new Server(server, {
    cors:{
        origin: serverOrigins,
        methods: ["GET", "POST", "PUT"],
    }
});

app.use((req, res, next) => {
    req.sockets = sockets;
    next();
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

io.on('connection', (socket) => {

    // Bila socket connect
    socket.on('connect', () => {
        console.log('Connected with socket ID: ', socket.id);
        socket.emit('register', username);
    });

    // Bila pengguna "public" connect
    socket.on('publicConnect', () => {
        console.log('Connected as public with socket ID: ', socket.id);
        socket.emit('registerPublic', socket.id);
    });

    // Pendaftaran pengguna berdaftar
    socket.on('register', async (username) => {
        try {
            const user = await users.findOne({ where: { username: username } });

            if (user) {
                user.socketId = socket.id;
                await user.save();
                sockets.set(socket.id, socket);
                console.log(`User ${username} registered with socket ID ${socket.id}`);
            } else {
                console.log(`Invalid username ${username}`);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    });

    // Pendaftaran pengguna "public"
    socket.on('registerPublic', async (socketId) => {
        try {
            console.log(`Public user connected with socket ID ${socketId}`);

            const publicUser = {
                socketId: socketId,
                type: 'public',
                connectedAt: new Date(),
            };

            console.log(publicUser)

            sockets.set(socket.id, socket);
            console.log(`Public user registered with socket ID ${socket.id}`);

        } catch (error) {
            console.log('Error:', error);
        }
    });

    socket.on('register', async (username) => {
        try {
            const user = await users.findOne({ where: { username: username } });

            if (user) {
                user.socketId = socket.id;
                await user.save();
                sockets.set(socket.id, socket);
                console.log(`User ${username} registered with socket ID ${socket.id}`);
            } else {
                console.log(`Invalid username ${username}`);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('a user disconnected: ' + socket.id);
        sockets.delete(socket.id);
    })
})

  // Routers
  const usersRouter = require('./routes/user')
  app.use("/api/user", usersRouter);
  
  const mchatRouter = require('./routes/mchat')
  app.use("/api/mchat", mchatRouter(io));

// Start server
db.sequelize.sync().then(() => {
    server.listen(port, () =>{
                console.log("Server running on port " + port);
    })

})