const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = parseInt(process.env.SERVER_PORT, 10);
const db = require('./models');
const fs = require('fs');
const fsx = require('fs-extra')
const https = require('https')
const http = require('http');
const {Server} = require("socket.io");
const multer = require('multer');
const path = require('path');
const { users} = require('./models');
const { validateToken } = require('./middlewares/AuthMiddleware');
const { Client, LocalAuth, Contact } = require('whatsapp-web.js');

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({
    extended: true
}));

const server = http.createServer(app);

const serverOrigins = ["https://teameagles.io", "http://localhost:3001"];

const io = new Server(server, {
    cors:{
        origin: serverOrigins,
        methods: ["GET", "POST", "PUT"],
    }
});

app.use((req, res, next) => {
    req.io = io;
    return next();
  });


// Routers
const validateRouter = require('./routes/validate');
app.use("/api/validate", validateRouter);

const msmartRouter = require('./routes/msmart');
app.use("/api/msmart", msmartRouter);
 

// Start server
db.sequelize.sync().then(() => {
    server.listen(port, () =>{
                console.log("Server running on port " + port);
    })

})





