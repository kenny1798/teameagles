const express = require('express');
const app = express();
const router = express.Router();
const { sign } = require('jsonwebtoken');
const fs = require('fs');
const {Users, Managers } = require('../models');
const { validateAdmin } = require('../middlewares/AuthMiddleware');
require('dotenv').config();

router.post("/login", async (req, res) => {

    const {username, password} = req.body;
    const login = process.env.ADMIN_LOGIN
    const pass = process.env.ADMIN_PASS
    if(!username){
        res.json({error: "Please enter a username"});
    }
    else if (!password){
        res.json({error: "Password cannot be blank"});
    }
    else if (username != login){
        res.json({ error : "Admin doesnt exist" });
    }else if (password != pass){
        res.json({ error : "Wrong password" });
    }else{
        const adminToken = sign({ login:login, pass:pass}, process.env.JWT_SECRET);
        res.json({adminToken: adminToken})
    }
});

router.post('/manager', validateAdmin, async (req,res) => {
    
    const {username} = req.body;

    try{

        const getUser = await Users.findOne({where: {username : username}});
        const uid = await getUser.id;

        const getManager = await Managers.findOne({where: {UserId: uid}});

        if(!getManager){

            await Managers.create({
                pos: 'Manager',
                UserId: uid
            }).then(() => {
                res.json({success: 'Successfully added manager'})
            })

        }else{

            res.json({error: 'Manager already exist'})

        }



    }catch(error){
        res.json({error: 'Unable to register manager'})
    }



    
    
})

router.get("/auth", validateAdmin, (req, res) => {
    res.json(req.admin)
});

router.get('/getuser', validateAdmin, async (req,res) => {
    const user = await Users.findAll();
    res.json(user);
});

router.get('/getmanager', validateAdmin, async (req,res) => {
let users = [];
let managers = [];

try{

const user = await Users.findAll();
users = user; 


const manager = await Managers.findAll();
for (let i = 0; i < manager.length; i++) {
    managers.push(parseInt(manager[i].UserId, 10));
}


const updatedUsers = users.filter(item => managers.includes(item.id));


res.json({data: updatedUsers});

}catch(error){
    res.json({error: 'Unable to receive managers'})
}

});

router.get('/exclude/manager', validateAdmin, async (req,res) => {

let users = [];
let managers = [];

// Ambil semua pengguna
const user = await Users.findAll();
users = user; // Simpan pengguna terus ke dalam users

// Ambil semua pengurus
const manager = await Managers.findAll();
for (let i = 0; i < manager.length; i++) {
    // Ambil UserId dari setiap pengurus
    managers.push(parseInt(manager[i].UserId, 10));
}

// Filter pengguna yang tidak ada dalam senarai pengurus
const updatedUsers = users.filter(item => !managers.includes(item.id));

// Hantar response dengan pengguna yang telah dikemaskini
res.json(updatedUsers);

});

router.get('/getuser/:user', validateAdmin, async (req,res) => {
    const getuser = req.params.user;

    try{
        const user = await Users.findOne({where: {username:getuser}});
        res.json(user);
    }catch(error){
        res.json({error:error})
    }
    
});

router.get('/get/unvalidate/users', validateAdmin, async (req,res) => {
    try{
        const allUser = await Users.findAll({where: {isValidate: 0}});
        res.json({users: allUser});
    }catch(error){
        res.json({error: "Connection to the server failed"});
    }

})

router.get('/approve/:userid', validateAdmin, async (req,res) => {
    try{
        const userid = req.params.userid;
        await Users.update({isValidate: 1}, {where: {id: userid}}).then(() => {
            res.json({success: 'user approved'});
        })
    }catch(error){
        res.json({error: error});
    }
});

router.get('/delete/approval/:userid', validateAdmin, async (req,res) => {
    try{
        const userid = req.params.userid;
        await Users.destroy({where:{id: userid}}).then(() => {
            res.json({success: 'user deleted'});
        })
    }catch(error){
        res.json({error: error});
    }
});


router.put('/user/update/', validateAdmin, async (req,res) => {
    const {username, phoneNumber, email} = req.body;
    try{
        Users.update({
            phoneNumber:phoneNumber,
            email: email,
        }, {where: {username:username}}).then(() => {
            res.json({status: "User updated successfully"})
        })
    }catch(error){
        res.json({error:error})
    }
})

router.delete('/manager/:uid', validateAdmin, async (req,res) => {
    const uid = req.params.uid;
    console.log(uid)
    try{

        await Managers.destroy({where: {UserId: uid}}).then(() => {
            res.json({success: "Manager deleted successfully"})
        })

    }catch(error){
        console.log(error)
        res.json({error: "Unable to delete manager"})
    }
})


module.exports = router;