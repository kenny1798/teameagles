const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const {mchat_block, mchat_button, mchat_chat, mchat_chatUser, mchat_flow, mchat_linkButton, mchat_userInput, mchat_getStarted,mchat_getStartedAnswers, users} = require('../models');
const {validateToken} = require('../middlewares/AuthMiddleware');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

module.exports = (io) => {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'media/');
        },
        filename: function (req, file, cb) {
          cb(null, Date.now() + path.extname(file.originalname));
        }
      });

      const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
        }
      };

      const upload = multer({
        storage: storage,
        limits: {
          fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
      });

router.post('/chat', validateToken, async (req,res) => {
        try{
            const uuid = crypto.randomUUID();
            const username = req.user.username;
            const {link, bot_name} = req.body;

            const checkChat = await mchat_chat.findOne({where: {username: username, link: link}})

            if(!checkChat){

                const salutationList = 'Mr,Mrs,Ms'
                const nameField = "Hi! Nice to meet you, what's your name?";

                const newData = await mchat_chat.create({
                    uuid: uuid,
                    username: username,
                    link: link,
                    bot_name: bot_name
                })

                const createdId = parseInt( await newData.id, 10);

                await mchat_getStarted.create({
                    salutationList: salutationList,
                    nameField: nameField,
                    trigger_flow_id: null,
                    mchatChatId: createdId
                })
                
            await io.emit('newData', newData);
            return res.status(201).json({succ:'Chat created successfully'});

                
                    


            }else{

                return res.json({err: 'Chat already exist'})

            }
    

        
        }catch(err){
            res.status(500).json({err: 'Failed to create chat. Please try again'})
            console.log(err)
        }
    
    })

router.post('/flow/:chatId', validateToken, async (req,res) => {
    const username = req.user.username;
    const {flowName} = req.body;
    const chatId = req.params.chatId;

    try{

        const newFlow = await mchat_flow.create({
            flowName: flowName,
            username: username,
            mchatChatId: chatId
        })

        await io.emit('newFlow', newFlow);
        return res.status(201).json({succ:'Flow created successfully'});

    }catch(error){
        console.log(error)
    }
})

router.post('/getStart/:chatId', async (req,res) => {
    
    const {name, salutation, triggerFlow} = req.body;
    const chatId = req.params.chatId
    const uuid = crypto.randomUUID();

    try{
        if(!name || !salutation){
            return res.status(400).json({err: "There are errors in the form you filled out. Please check again and ensure all required fields are completed with valid information."})
        }

        const chat = await mchat_chat.findOne({where: {id: chatId}});
        const username = await chat.username;

        const addUser = await mchat_chatUser.create({
            uuid: uuid,
            timeStamp: new Date().toISOString(),
            username: username,
            mchatChatId: chatId,
            chat: null

        })

        const addStart = await mchat_getStartedAnswers.create({
            salutation: salutation,
            name: name,
            trigger_flow_id: triggerFlow
        })

        if(addStart && addUser){
            return res.status(200).json({succ: addUser.uuid})
        }else{
            return res.status(400).json({err: "There are errors in the form you filled out. Please check again and ensure all required fields are completed with valid information."})
        }

    }catch(err){
        console.log(err)
        return res.status(500).json({err: "Sorry, there was an internal server error. Please try again later."})
    }
})

router.put('/action/add/:chatId/:flowId', validateToken, async (req,res) => {

    let actionId = 0;
    let newAction = [];
    const username = req.user.username;
    const {actionType} = req.body;
    const flowId = req.params.flowId;
    const chatId = req.params.chatId;

    try{

        if(actionType === 'button'){
            const {content, triggerFlow} = req.body;

            if(!content){

                return res.status(400).json({err: 'All fields required'})

            }else{

                const parsedTrigger = parseInt(triggerFlow, 10)
        
                let flowLink;
            
                if(parsedTrigger === 0){
                const {newFlowName} = req.body;
    
                 const newFlow = await mchat_flow.create({
                        flowName: newFlowName,
                        username: username,
                        mchatChatId: chatId
                    })
    
                flowLink = await newFlow.id
    
    
    
                    await io.emit('newFlow', newFlow);
    
                
                }else if(parsedTrigger > 0){
                    flowLink = parsedTrigger
                }else{
                    flowLink = ""
                }
            
                const getFlow = await mchat_flow.findOne({ where: { id: flowId } });
    
                if(getFlow.actions === null){
                    actionId = 1;
                    newAction.push({"id": actionId, "type": actionType, "buttonContent": content, "triggerFlow": flowLink});
                }else {
                    actionId = getFlow.actions.length > 0 ? getFlow.actions[getFlow.actions.length - 1].id + 1 : 1;
                    newAction = [...getFlow.actions];
                    newAction.push({"id": actionId,"type": actionType, "buttonContent": content, "triggerFlow": flowLink});
                }
    
                const addAction = await mchat_flow.update({
                    actions: newAction
                }, {where: {id: flowId}});
    
                if (addAction) {
                    const data = await mchat_flow.findAll({ where: { username: username, mchatChatId: chatId } });
            
                    await io.emit('userFlow', data);
                    return res.status(201).json({ succ: 'Action added successfully' });
                }

            }
        

        }else if(actionType === 'contact'){
            const {content, link} = req.body;

            if(!content || !link){

                return res.status(400).json({err: 'All fields required'})

            }else{

                const getFlow = await mchat_flow.findOne({ where: { id: flowId } });
    
                if(getFlow.actions === null){
                    actionId = 1;
                    newAction.push({"id": actionId, "type": actionType, "buttonContent": content, "link": link});
                }else {
                    actionId = getFlow.actions.length > 0 ? getFlow.actions[getFlow.actions.length - 1].id + 1 : 1;
                    newAction = [...getFlow.actions];
                    newAction.push({"id": actionId, "type": actionType, "buttonContent": content, "link": link});
                }

                const addAction = await mchat_flow.update({
                    actions: newAction
                }, {where: {id: flowId}});

                if (addAction) {
                    const data = await mchat_flow.findAll({ where: { username: username, mchatChatId: chatId } });
            
                    await io.emit('userFlow', data);
                    return res.status(201).json({ succ: 'Action added successfully' });
                }

            }


        }else if(actionType === 'userinput'){

            const {inputType, inputName, triggerFlow} = req.body;

            if(!inputType || !inputName){
                
                return res.status(400).json({err: 'All fields required'})

            }else{

                const parsedTrigger = parseInt(triggerFlow, 10)
        
                let flowLink;
            
                if(parsedTrigger === 0){
                const {newFlowName} = req.body;
    
                 const newFlow = await mchat_flow.create({
                        flowName: newFlowName,
                        username: username,
                        mchatChatId: chatId
                    })
    
                flowLink = await newFlow.id
    
                    await io.emit('newFlow', newFlow);
                
                }else if(parsedTrigger > 0){
                    flowLink = parsedTrigger
                }else{
                    flowLink = ""
                }
            
                newAction.push({"id": 1,"type": actionType, "inputType": inputType, "inputName": inputName, "triggerFlow": flowLink});

                const addAction = await mchat_flow.update({
                    actions: newAction
                }, {where: {id: flowId}});


                if (addAction) {
                    const data = await mchat_flow.findAll({ where: { username: username, mchatChatId: chatId } });
            
                    await io.emit('userFlow', data);
                    return res.status(201).json({ succ: 'Action added successfully' });
                }



            }

        }else{
            return res.status(400).json({err: 'Action Type not recognized'})
        }

    }catch(err){
        console.log(err)
        return res.status(400).json({err: 'Unable to create Action'})
    }

})

router.put('/block/add/text/:flowId/:chatId', validateToken, async (req,res) => {

    let blockId = 0;
    let newBlock = [];
    const username = req.user.username;
    const {blockType, blockContent} = req.body;
    const flowId = req.params.flowId;
    const chatId = req.params.chatId;
    
    try {
        const getFlow = await mchat_flow.findOne({ where: { id: flowId } });
    
        if (getFlow.blocks === null) {
            blockId = 1;
            newBlock.push({ "id": blockId, "category": blockType, "content": blockContent });
        } else {
            
            blockId = getFlow.blocks.length > 0 ? getFlow.blocks[getFlow.blocks.length - 1].id + 1 : 1;
            newBlock = [...getFlow.blocks];
            newBlock.push({ "id": blockId, "category": blockType, "content": blockContent });
        }
    
        const addBlock = await mchat_flow.update({
            blocks: newBlock
        }, { where: { id: flowId } });
    
        if (addBlock) {
            const data = await mchat_flow.findAll({ where: { username: username, mchatChatId: chatId } });
    
            await io.emit('userFlow', data);
            return res.status(201).json({ succ: 'Block added successfully' });
        }
    
    } catch (error) {
        console.log(error);
    }
    
})

router.put('/block/add/image/:flowId/:chatId', validateToken, upload.single('image'), async (req, res) => {
    let blockId = 0;
    let newBlock = [];
    const username = req.user.username;
    const { blockType } = req.body;
    const flowId = req.params.flowId;
    const chatId = req.params.chatId;

    try {
        if (req.file) {
            const mimeType = req.file.mimetype.toLowerCase();
            if (mimeType !== 'image/jpeg' && mimeType !== 'image/jpg' && mimeType !== 'image/png') {
                return res.json({ error: "Only image format of .jpg, .jpeg or .png is accepted" });
            }

            if (req.file.size > 4194304) {
                return res.json({ error: "Image size exceed 4MB limit" });
            }

            const imagePath = req.file.filename; // Store the path
            const getFlow = await mchat_flow.findOne({ where: { id: flowId } });

            
            if (!getFlow.blocks) {
                blockId = 1;
            } else {
                blockId = getFlow.blocks.length > 0 ? getFlow.blocks[getFlow.blocks.length - 1].id + 1 : 1;
            newBlock = [...getFlow.blocks]; 
            console.log(newBlock);
            }

            
            if (imagePath) {
                newBlock.push({ "id": blockId, "category": blockType, "content": imagePath });

                
                const addBlock = await mchat_flow.update({ blocks: newBlock }, { where: { id: flowId } });

                if (addBlock) {
                    const data = await mchat_flow.findAll({ where: { username: username, mchatChatId: chatId } });

                    await io.emit('userFlow', data);
                    return res.status(201).json({ succ: 'Block added successfully' });
                }
            } else {
                return res.status(400).json({ error: "Image upload failed" });
            }
        } else {
            return res.status(400).json({ error: "No image file uploaded" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred while adding block" });
    }
});

router.put('/block/update/position/:flowId/:chatId', validateToken, async (req, res) => {
    const { flowId, chatId } = req.params;
    const { blocks } = req.body;  

    try {
        const updateFlow = await mchat_flow.update({
            blocks: blocks
        }, { where: { id: flowId } });

        if (updateFlow) {
            const data = await mchat_flow.findAll({ where: { username: req.user.username, mchatChatId: chatId } });
            await io.emit('userFlow', data);
            return res.status(200).json({ succ: 'Block positions updated successfully' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Unable to update block positions. Please try again.' });
    }
});

router.put('/block/update/text/:flowId/:chatId/:blockId', validateToken, async (req,res) => {

    const { flowId, chatId, blockId } = req.params;
    const { blockType, blockContent } = req.body;
    const username = req.user.username;

    try{

        const flow = await mchat_flow.findOne({ where: { id: flowId } });
        const blocks = flow.blocks;

        console.log(blocks)

        const updatedBlocks = blocks.map(block => {
            if (block.id === parseInt(blockId, 10)) {
                block.category = blockType;
                block.content = blockContent;
            }
            return block;
        });

        const updateBlock = await mchat_flow.update({
            blocks: updatedBlocks
        }, { where: { id: flowId } });
        
        

        if(updateBlock){
            const data = await mchat_flow.findAll({where: {username: username, mchatChatId: chatId}});
        

        await io.emit('userFlow', data);
        return res.status(201).json({succ:'Block edited successfully'});
        }
        

    }catch(error){
        console.log(error);
        return res.status(500).json({ error: 'Unable to edit block. Please try again.' });
    }
})

router.put('/block/update/image/:flowId/:chatId/:blockId', validateToken, upload.single('image'), async (req,res) => {

    const { flowId, chatId, blockId } = req.params;
    const { blockType } = req.body;
    const username = req.user.username;

    try{

        console.log(req.file)

        if(req.file){

            
            const mimeType = req.file.mimetype.toLowerCase();
            if (mimeType !== 'image/jpeg' && mimeType !== 'image/jpg' && mimeType !== 'image/png') {
                return res.json({ error: "Only image format of .jpg, .jpeg or .png is accepted" });
            }

           
            if (req.file.size > 4194304) { 
                return res.json({ error: "Image size exceed 4MB limit" });
            }

            const newImagePath = req.file.filename;
            const flow = await mchat_flow.findOne({ where: { id: flowId } });
            const blocks = flow.blocks;
    
            const deleteBlock = blocks.map(block => {
                if (block.id === parseInt(blockId, 10)){
                    console.log(block.id)
                    if(block.category === "Image"){
                        const imagePath = path.join(__dirname,'..', 'media', block.content);
                        console.log(imagePath)
                        return fs.unlinkSync(imagePath, (err) => {
                            if (err){
                                return res.status(400).json({ error: "Unable to update image" });
                            }
                        })
                    }
                }
            })

            if(newImagePath && deleteBlock){
                const updatedBlocks = blocks.map(block => {
                    if (block.id === parseInt(blockId, 10)) {
                        block.category = blockType;
                        block.content = newImagePath;
                    }
                    return block;
                });
        
                const updateBlock = await mchat_flow.update({
                    blocks: updatedBlocks
                }, { where: { id: flowId } });
                
                
        
                if(updateBlock){
                    const data = await mchat_flow.findAll({where: {username: username, mchatChatId: chatId}});
                
        
                await io.emit('userFlow', data);
                return res.status(201).json({succ:'Block edited successfully'});
                }
            }else{
                console.log('no imagepath & deleteblock')
                return res.status(400).json({ error: "Unable to update image" });

            }

        }else{
            console.log('no image')
            return res.status(400).json({ error: "No image file uploaded" });
            
        }





        

    }catch(error){
        console.log(error);
        return res.status(500).json({ error: 'Unable to edit block. Please try again.' });
    }
})

router.put('/getStart/:chatId', validateToken, async (req,res) => {
    const chatId = req.params.chatId;
    const {salutationList, nameField, triggerFlow} = req.body;
    
    try{

        await mchat_getStarted.update({
            salutationList: salutationList,
            nameField: nameField,
            trigger_flow_id: triggerFlow
        }, {where: {mchatChatId: chatId}}).then(() => {

            return res.status(201).json({succ:'Welcome Message updated successfully'});
        })

    }catch(error){
        res.status(500).json({err: 'Failed to update Welcome Message. Please try again'})
            console.log(err)
    }
})

router.put('/public/chat/history/:chatId/:cookie', async (req,res) => {
    
    const chatId = req.params.chatId;
    const uuid = req.params.cookie;
    const {chat} = req.body;

    try{

        const updateChat = await mchat_chatUser.update({
            chat: chat
        }, {where: {mchatChatId: chat, uuid: uuid}})

        res.status(200).json({succ: updateChat})

    }catch(err){
        console.log(err);
        res.status(500).json({err: ""})
    }

})

router.get('/public/chat/history/:chatId/:cookie', async (req,res) => {
    
    const chatId = req.params.chatId;
    const uuid = req.params.cookie;

    try{

        const getChat = await mchat_chatUser.findOne({where: {mchatChatId: chatId, uuid: uuid}})

        if(!getChat){

                return res.status(200).json({new: "New Chat"});

        }else{

                return res.status(200).json({succ: getChat.chat});    

        }

        return res.status(200).json({succ: getChat.chat})

    }catch(err){
        console.log(err);
        return res.status(500).json({err: ""})
    }

})

router.get('/public/chat/:chatId', async (req,res) => {
    const chatId = req.params.chatId;

    try{
        const data = await mchat_flow.findAll({where: {mchatChatId: chatId}});

        res.status(200).json({data: data});


    }catch(err){
            res.status(500).json({err: 'Error'});
            console.log(err)
    }


})

router.get('/public/getStart/:chatId', async (req,res) => {
    
    const chatId = req.params.chatId;


    try{
            const data = await mchat_getStarted.findOne({where: {mchatChatId: chatId}});

            res.status(200).json({data: data});


    }catch(err){
            res.status(500).json({err: 'Error'});
            console.log(err)
    }

})

router.get('/flow/:socketId/:chatId', validateToken, async (req,res) => {
   const socketId = req.params.socketId;
   const username = req.user.username;
   const sockets = req.sockets;
   const chatId = req.params.chatId;

   try{
    const user = await users.findOne({ where: { username } });

    if(!user){
        return res.status(401).send('Unauthorized: Invalid username');
    }else{
        const data = await mchat_flow.findAll({where: {username: username, mchatChatId: chatId}});
        const socket = sockets.get(socketId);
        if(socket){
            socket.emit('userFlow', data)

            res.status(200).send('Data fetched and update sent')
        }else{
            res.status(404).send('Socket not found');
        }
    }

   }catch(error){
    res.status(500).send('Server error');
    console.log(error)
   }
})
    
router.get('/chat/:socketId', validateToken, async (req,res) => {
    
        
        const socketId = req.params.socketId;
        const username = req.user.username;
        const sockets = req.sockets;
    
        console.log('Received fetch request with:', { username, socketId });
        try{
            const user = await users.findOne({ where: { username: username } });
    
            if (!user) {
                return res.status(401).send('Unauthorized: Invalid username');
            }else{
                const data = await mchat_chat.findAll({where: {username: username}});
                const socket = sockets.get(socketId);
                if (socket) {
                    socket.emit('userChat', data)
                    
                    res.status(200).send('Data fetched and update sent');
                } else {
                    res.status(404).send('Socket not found');
                }
            }
        }catch(err){
            res.status(500).send('Server error');
            console.log(err)
        }
    })

router.get('/getStart/:chatId', validateToken, async(req,res) => {

    const username = req.user.username;
    const chatId = req.params.chatId;

    try{
        const getStarted = await mchat_getStarted.findOne({where: {mchatChatId: chatId}});
        const allFlow = await mchat_flow.findAll({where: {mchatChatId: chatId}})

        if(!getStarted){
            return res.json({error: "Failed to retrieve data. Please try again"});
        }else{
            return res.json({data: getStarted});
        }
    }catch(error){
        res.status(500).json({err: 'Failed to retrieve data. Please try again'});
        console.log(error)
    }

    
    
    

})

router.get('/action/:chatId/:flowId/:socketId', validateToken , async (req,res) => {
    
    const username = req.user.username;
    const chatId = req.params.chatId;
    const flowId = req.params.flowId;
    const socketId = req.params.socketId;
    const sockets = req.sockets;
    let data = [];

    console.log('Received action fetch request with:', { username, socketId });

    try{
        const user = await users.findOne({ where: { username: username } });

        if(!user){
            return res.status(401).send('Unauthorized: Invalid username');
        }else{
        }

    }catch(err){
        res.status(500).send('Server error');
            console.log(err)
    }

    
})


router.delete('/chat/:id', validateToken, async (req,res) => {
        try{
            const id = req.params.id;
            await mchat_chat.destroy({where: {id: id}}).then(() => {
                return res.json({succ: 'Chat deleted successfully'})
            })

        }catch(err){
            res.status(500).json({err: 'Failed to delete chat. Please try again'})
        }

    })

    return router
} 