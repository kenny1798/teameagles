const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = parseInt(process.env.SERVER_PORT, 10);
const db = require('./models');
const https = require('https')
const http = require('http');
const {Server} = require("socket.io");


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('flowmedia'));

const server = http.createServer(app);

const serverOrigins = ["http://localhost:3000", "http://localhost:3004", "http://localhost:3010"];

const io = new Server(server, {
    cors:{
        origin: serverOrigins,
        methods: ["GET", "POST", "PUT"],
    }
});

const broadcastRouter = require('./routes/broadcast')
app.use("/api/broadcast", broadcastRouter);
 
// Start server
db.sequelize.sync().then(() => {
    server.listen(port, () =>{
                console.log("Server running on port " + port);
    })

})





