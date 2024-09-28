const express = require('express');
const router = express.Router();
const {users} = require('../models');
const bcrypt = require('bcrypt');
const {sign} = require('jsonwebtoken');
const {validateToken} = require('../middlewares/AuthMiddleware');
require('dotenv').config();

router.post("/signup", async (req,res) => {
    try{

        const {username, password, confirmPassword} = req.body;
        let checkUser;
        if(username){
            checkUser = await users.findOne({where: {username:username}});
        }
        
    
        if(!username || !password || !confirmPassword){
            res.json({error:"All field must be fill"});
        }else if (checkUser){
            res.json({error:"User already exist"});
        }else if (password != confirmPassword){
            res.json({error:"Password confirmation does not match"})
        }else{
            bcrypt.hash(password, 10).then((hash) => {
                users.create({
                    username: username,
                    password: hash
                }).then( async () => {
                    const user = await users.findOne({ where: {username: username }});
                    const accessToken = sign({ username: await user.username}, process.env.JWT_SECRET);
                    const loginUser = user.username;
                    res.json({token: accessToken, username:loginUser})
                })
            })
        }

    }catch(err){
        console.log(err)
    }
   
})

router.post("/signin", async (req,res) => {

    try{
        console.log('test')
        const {username, password} = req.body;
        const user = await users.findOne({where:{ username: username}});
        if(!username || !password){
            res.json({error:"Field cannot be blank"})
        }else if(!user){
            res.json({error: "User doesnt exist"})
        }else{
            bcrypt.compare(password, user.password).then( async (match) => {
                if(!match){
                    res.json({error: "Wrong password"});
                }else{
                    const accessToken = sign({username: await user.username, id: await user.id}, process.env.JWT_SECRET);
                    const loginUser = await user.username;
                    res.json({token:accessToken, username: loginUser});
                }
            })
        }
    }catch(err){
        console.log(err)
    }

})

module.exports = router;