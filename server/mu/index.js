const express = require('express');
const app = express();
const cors = require('cors');
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
const { validateToken, validateAdmin } = require('./middlewares/AuthMiddleware');


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('media/course_logo'));
app.use(express.static('media/course_video'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });



const server = http.createServer(app);

const serverOrigins = ["https://teameagles.io", "https://api.teameagles.io"]

const io = new Server(server, {
    cors:{
        origin: serverOrigins,
        methods: ["GET", "POST", "PUT"],
    }
});



const muRouter = require('./routes/mu');
app.use("/api/mu", muRouter);

const adminRouter = require('./routes/admin');
app.use("/api/admin/mu", adminRouter);

app.get('/', (req,res) => {
    res.send('hola')
})

 
// Start server
db.sequelize.sync().then(() => {
    server.listen(port,() =>{
                console.log("Server running on port " + port);
		console.log(__dirname);
    })

})





