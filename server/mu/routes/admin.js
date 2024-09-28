const express = require('express');
const app = express();
const router = express.Router();
const { sign } = require('jsonwebtoken');
const fs = require('fs');
const { mu_course,mu_chapter,mu_video,mu_question,mu_answer,mu_script,mu_progress,mu_userScript,subscription, users, mu_lessonFinish } = require('../models');
const { validateAdmin } = require('../middlewares/AuthMiddleware');
require('dotenv').config();

router.post('/register', validateAdmin, async (req,res) => {
    const {username, course} = req.body;
    try{
        const checkUser = await users.findOne({where:{username:username}});
        const progress = await mu_progress.findOne({where:{username:username, shortlink: course}});
        if(progress){
            res.json({err: 'User already subscribed'})
        }else if(!checkUser){
            res.json({err: 'User not exist'})
        }
        else{
            await mu_progress.create({
                username: username,
                shortlink: course,
                currentLesson: 1
            }).then(async() => {
                await mu_lessonFinish.create({
                    username: username,
                    shortlink: course,
                    lesson: 1,
                    question: 0,
                    script: 0
                }).then( async () => {
                    await subscription.create({
                        username: username,
                        subsItem: 'MU',
                        subsType: course,
                        subsPeriod: 1,
                        startDate: Date.now(),
                        endDate: new Date('2060-12-31 00:00:00')
                    }).then(() => {
                        res.json({succ: 'User registered successfully'})
                    })
                })
            })
        }
    }catch(err){
        res.json({err: err})
        console.log(err)
    }
})

module.exports = router;