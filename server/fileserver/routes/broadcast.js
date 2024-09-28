const express = require('express');
const router = express.Router();
const path = require('path');
const {mbot_flowblock} = require('../models')
const multer = require('multer');
const { validateToken } = require('../middlewares/AuthMiddleware');
require('dotenv').config();


const limitFileSize = 7 * 1024 * 1024

const storage1 = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './flowmedia')
    },
    filename: (req, file, cb) =>{
        cb(null,"mbot_" + Date.now() + path.extname(file.originalname))
    }

});

var upload1 = multer({storage: storage1,
    limits: {fileSize:limitFileSize}, 
    fileFilter:(req, file, cb) => {
        if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'video/mp4'){
            cb(null,true)
        }else{
            cb(null, false)
            return cb(new Error('Only .jpg, .jpeg, .png and .mp4 files are allowed'))
        }
    }});

router.post('/create/flow/block', validateToken, upload1.single('content'), async (req,res) => {
    try{
        const username = req.user.username;
        const flowName = req.body.flowName;
        const allFlow = await mbot_flowblock.findAll({where: {username:username, flowName: flowName}});
        const contentType = req.body.contentType;
        const isDelay = req.body.isDelay;
        const parsedIsDelay = parseInt(isDelay, 10);
        const delayPeriod = req.body.delayPeriod;
        const parsedDelayPeriod = parseInt(delayPeriod, 10);
        const delayTotal = allFlow.reduce(function(t, value){
            return t + value.delayPeriod + parsedDelayPeriod
        }, 0)
    
        if(delayTotal > 3600){
            res.status(400).json({code:"Total block delay cannot exceed 3600 seconds @ 1 hour", error:"Total block delay cannot exceed 3600 seconds @ 1 hour"})
        }else{
            if(contentType === 'Text'){
                const content = req.body.content;
                await mbot_flowblock.create({
                    username:username,
                    flowName: flowName,
                    contentType: contentType,
                    content: content,
                    isDelay: parsedIsDelay,
                    delayPeriod: parsedDelayPeriod
                }).then(() => {
                        res.status(201).json({
                            message: 'Block created successfully',
                            flow: flowName
                        })
                    })
            }else if(contentType === 'Image' | contentType === 'Video'){
                const content = req.file.filename;
                await mbot_flowblock.create({
                    username:username,
                    flowName: flowName,
                    contentType: contentType,
                    content: content,
                    isDelay: parsedIsDelay,
                    delayPeriod: parsedDelayPeriod
                }).then(() => {
                        res.status(201).json({
                            message: 'Block created successfully',
                            flow: flowName
                        })
                    })
            }else{
                res.status(404).json({error: 'Unknown file type'})
            }
        }
        
        // }
        
        }catch(error){
            res.status(404).json({error: error})
        }
    });

router.use(function (err,req,res,next) {
        if (err instanceof multer.MulterError){
            res.statusCode = 400;
            res.send({code : err.code});
        }else if (err){
            if(err.message === "FILE_MISSING"){
                res.statusCode = 400;
                res.send({code : "FILE_MISSING"});
            }else{
                res.statusCode = 500;
                res.send({code : "GENERIC_ERROR"});
            }
        }
    });

module.exports = router;
