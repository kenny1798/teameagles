const express = require('express');
const app = express();
const router = express.Router();
const { msmart_team, msmart_activity, msmartleads, users, msmart_teamManager, msmart_merit, msmart_connectActivity, msmart_resultActivity, msmart_broadcast, msmart_prospectingActivity} = require('../models');
const nodemailer = require('nodemailer');
const { validateToken } = require('../middlewares/AuthMiddleware');
const { Op, where } = require('sequelize');


//TEAM

router.get('/leads/all/:teamName', validateToken, async (req,res) => {
  try{
  const username = req.user.username;
  const teamName = req.params.teamName;
  const listOfLeads = await msmartleads.findAll({where: {username:username, teamId: teamName}, order:[['createdAt', 'DESC']]});

    res.status(201).json(listOfLeads);

  }catch(error){
    res.status(404).json({error:"Unable to access to database"})
    console.log(error)
  }
  

})

router.get('/lead/:id', validateToken, async (req,res) => {
  try{
  const lid = req.params.id;
  const username = req.user.username;
  const singleLead = await msmartleads.findOne({where: {username:username, id:lid}});
    res.status(201).json({db: singleLead});
  }catch(error){
    res.status(404).json({error:"Unable to access to database"})
    console.log(error)
  }
  

})

router.get('/get/team/data/:teamName', validateToken, async (req,res) => {
const username = req.user.username;
const teamName = req.params.teamName;
let uploadDB = [];
let uploadDBarr = [];
let presentation = 0;
let followup = 0;
let prospecting = 0;
let presentationarr = [];
let followuparr = [];
let prospectingarr = [];

let addfb = 0;
let followtt = 0;
let savenum = 0;
let connect = 0;
let addfbarr = [];
let followttarr = [];
let savenumarr = [];
let connectarr = [];

let engfb = 0;
let engtt= 0;
let engws= 0;
let eng =0;
let engfbarr = [];
let engttarr= [];
let engwsarr= [];
let engarr = [];

let close = 0;
let book = 0;
let reject = 0;
let result = 0;
let closearr = [];
let bookarr = [];
let rejectarr = [];
let resultarr = [];

let members = [];

const getGroup = await msmart_teamManager.findOne({where:{username:username}});
const managerName = await getGroup.managerName;
const getMembers = await msmart_teamManager.findAll({where: {teamName: teamName, managerName: managerName, position:"Member"}, attributes:['username']});

getMembers.forEach(async(item) => {
  const users = item.dataValues.username;
  if(members.push(users)){
  }
})

for(var i = 0; i<members.length; i++){
  const member = members[i];

  let dbcount = 0;
  const getDB = await msmartleads.findAll({where: {username:member}});
  if(getDB){
    dbcount = await getDB.length
  }
  if(uploadDBarr.push(dbcount)){
  }

  let followupcount = 0;
  let presentcount = 0;
  const getfupres = await msmart_prospectingActivity.findOne({where:{username: member, teamName:teamName, day: process.env.DAY, week: process.env.WEEK, month: process.env.MONTH, year: process.env.YEAR}});
  if(getfupres){
    followupcount = await getfupres.followup;
    presentcount = await getfupres.presentation;
  }
  if(followuparr.push(followupcount)){}
  if(presentationarr.push(presentcount)){}

  let prospectingcount = 0;
}

for(var i=0; i<uploadDBarr.length; i++){
  uploadDB += uploadDBarr[i];
}

for(var i=0; i<followuparr.length; i++){
  followup += followuparr[i];
}

for(var i=0; i<presentationarr.length; i++){
  presentation += presentationarr[i];
}

res.json({uploadDB: uploadDB, followup: followup, presentation: presentation})
})

router.get('/get/team/all', validateToken, async (req,res) => {
  try{
  const username = req.user.username;
  const getTeam = await msmart_team.findAll({where: {username: username}});
  const getManager = await msmart_teamManager.findAll({where:{username:username, position: "Manager", isVerified:1}});
  const getMember = await msmart_teamManager.findAll({where: {username: username, position: "Member", isVerified: 1}});
  res.json({owner: getTeam, manager: getManager, member: getMember})
  }catch(error){
  res.json({error:"Failed to retrieve teams."})
  }
  
});

router.get('/get/team/list', validateToken, async (req,res) => {
  try{
  const getTeam = await msmart_team.findAll();
  res.json(getTeam)
  }catch(error){
  res.json({error:"Failed to retrieve teams."})
  }
  
})

router.get('/get/manager/list/:teamName', validateToken, async (req,res) => {
  try{const team = req.params.teamName;
  const managers = await msmart_teamManager.findAll({where: {teamId: team, position: 'Manager', isVerified: 1}})
  res.json(managers)
}
  catch(error){
    res.json({error: "Failed to retrieve managers."})
  }
})

router.get('/manager/get/team/member/:teamId', validateToken, async (req,res) => {
  const teamId = req.params.teamId;

  try{

    const members = await msmart_teamManager.findAll({where: {teamId: teamId, position: 'Member'}});

    res.json({team: members});

  }catch(err){
    res.json({err: 'Unable to receive members'})
    console.log(err)
  }
})

router.post('/manager/get/activity/:teamId', validateToken, async (req,res) => {
  const username = req.user.username;
  const teamId = req.params.teamId;
  const {date} = req.body;
  let activity = [];
  let leadData = [];

  const startOfToday = date + ' 00:00:00'
  const endOfToday = date + ' 23:59:59.999999'

  try{

    const members = await msmart_teamManager.findAll({where: {managerUsername: username, teamId: teamId, position: 'Member'}});

    for(var i=0; i< members.length; i++){
      const member = members[i];

      const activities = await msmart_activity.findAll({where: {username: member.username, teamId: teamId, createdAt: {
        [Op.between]: [startOfToday, endOfToday]
      }}});

      for(var j=0; j < activities.length; j++){
        const singleActivity = activities[j];
        const lead = await msmartleads.findOne({where: {id: await singleActivity.msmartleadId}});
        activity.push(singleActivity)
        if(leadData && leadData.length > 0){
          const dupe = leadData.find(val => val.id === lead.id)
          if(!dupe){
            leadData.push(lead)
          }
        }else{
          leadData.push(lead)
        }
        
      }
    }
    res.json({team: members, activity: activity, lead: leadData});

  }catch(err){
    res.json({err: 'Unable to receive members'})
    console.log(err)
  }
})

router.get('/supermanager/get/team/member/:teamId', validateToken, async (req,res) => {
  const teamId = req.params.teamId;

  try{

    const members = await msmart_teamManager.findAll({where: {teamId: teamId, position: 'Member'}});

    res.json({team: members});

  }catch(err){
    res.json({err: 'Unable to receive members'})
    console.log(err)
  }
})

router.get('/supermanager/get/team/manager/:teamId', validateToken, async (req,res) => {
  const teamId = req.params.teamId;

  try{

    const members = await msmart_teamManager.findAll({where: {teamId: teamId, position: 'Manager'}});

    res.json({team: members});

  }catch(err){
    res.json({err: 'Unable to receive members'})
    console.log(err)
  }
})

router.post('/supermanager/get/activity/:teamId', validateToken, async (req,res) => {
  const teamId = req.params.teamId;
  const {date} = req.body;
  let activity = [];
  let leadData = [];

  console.log (date)

  try{

    const members = await msmart_teamManager.findAll({where: {teamId: teamId, position: 'Member'}});


     const startOfToday = date + ' 00:00:00'
     const endOfToday = date + ' 23:59:59.999999'

     console.log(startOfToday, endOfToday)

      const activities = await msmart_activity.findAll({where: {teamId: teamId, createdAt: {
        [Op.between]: [startOfToday, endOfToday]
      }}});

      for(var j=0; j < activities.length; j++){
        const singleActivity = activities[j];
        const lead = await msmartleads.findOne({where: {id: await singleActivity.msmartleadId}});
        activity.push(singleActivity)
        if(leadData && leadData.length > 0){
          const dupe = leadData.find(val => val.id === lead.id)
          if(!dupe){
            leadData.push(lead)
          }
        }else{
          leadData.push(lead)
        }
        
      }
    
    res.json({team: members, activity: activity, lead: leadData});

  }catch(err){
    res.json({err: 'Unable to receive members'})
    console.log(err)
  }
})

router.get('/manager/get/member/:teamId', validateToken, async (req,res) => {

})

router.get('/manager/get/all/leads/:teamName', validateToken, async (req,res) => {
try{
  const username = req.user.username;
  const teamName = req.params.teamName;

  let teamleads = [];
  const getTeam = await msmart_teamManager.findAll({where: {managerUsername: username, position: 'member'}});
  for(var i = 0; i< getTeam.length; i++){
    const singleUser = await getTeam[i];
    const singleUsername = singleUser.username;
    const getLeads = await msmartleads.findAll({where: {username: singleUsername, teamName: teamName}});
    for(var j = 0; j < getLeads.length; j ++){
      const singleLead = await getLeads[j];
      teamleads.push(singleLead);
    }
  }
  res.json(teamleads)


}catch(err){
  console.log(err)
}
})

router.post('/lead', validateToken, async (req,res) => {
  const username = req.user.username;
  const {name, team, country, phone, status, remarks, followUp} = req.body;
  const getTeam = await msmart_teamManager.findOne({where: {username: username, teamId: parseInt(team, 10)}});
  const nameInTeam = await getTeam.nameInTeam;
  let fuDate;
  if(followUp === ''){
    fuDate = new Date(Date.now())
  }else{
    fuDate = new Date(followUp)
  }
  try{

    if(!name || !country || !phone || !status){
      res.status(400).json({error: "Lead's details are required"})
    }else{

      await msmartleads.create({
        username: username,
        teamId:parseInt(team, 10),
        name: name,
        country: country,
        phone: phone,
        status: status,
        remark: remarks,
        followUpDate: fuDate
  
  
      }).then( async (response) => {
        await msmart_activity.create({
          username: username,
          teamId: parseInt(team, 10),
          activity: `${nameInTeam} added new database`,
          msmartleadId: response.dataValues.id
        })
      }).then(() => {
        res.status(201).json({status:'Contact saved successfully'})
      })

    }


  }catch(err){
    res.status(404).json({error:"Unable to save contact"})
    console.log(err)
  }
})

router.post('/join/team',validateToken, async (req,res) => {
  try{
    const username = req.user.username;
    const {managerName, yourName, teamName} = req.body;
    const checkTeam = await msmart_team.findOne({where: {id:teamName}});
    const checkManager = await msmart_teamManager.findOne({where: {teamId:teamName, managerName:managerName}});
    const checkData = await msmart_teamManager.findOne({where: {username:username, teamId:teamName, managerName:managerName}});
    const getManagerUname = await msmart_teamManager.findOne({where: {teamId:teamName, managerName:managerName, position:'Manager'}});
    const ManagerUname = await getManagerUname.username;
    if(!checkTeam){
      return res.json({error: "Selected team does not exist"})
    }
    else if(!checkManager){
      return res.json({error: "Selected manager does not exist"})
    }
    else if(checkTeam && !teamName){
     return res.json({error: "Please select a team"});
    }
    else if(teamName === 'Select Team..' || !teamName){
      return res.json({error: "Please select a team"});
    }
    else if(!managerName || managerName === 'Select Manager..'){
      return res.json({error: "Please select a manager"});
    }
    else if(!yourName){
      return res.json({error: "Your name cannot be blank"});
    }
    else if(checkData){
      return res.json({error: "You already submitted application to this team and manager."});
    }
    else{
      await msmart_teamManager.create({
        username: username,
        nameInTeam: yourName,
        teamId: teamName,
        managerName: managerName,
        managerUsername: ManagerUname,
        position: 'Member',
        isVerified: 0
      }).then(() => {
        return res.json({succMsg: `Your application to join ${checkTeam.teamName} under ${managerName} recorded successfully`});
      }).catch((error) => {
        return res.json({error: 'Unable to join team. Please try again.'});
      });
    }
    

  }catch(error){
    console.log(error)
    return res.json({error: 'Unable to join team as Manager. Please try again.'});
  }

})

router.post('/join/manager', validateToken, async (req,res) => {
  try{
    const username = req.user.username;
    const {managerName, yourName, teamId} = req.body;
    const checkTeam = await msmart_team.findOne({where: {id:teamId}});
    const checkName = await msmart_teamManager.findOne({where: {teamId:teamId, managerName:managerName}});
    const checkData = await msmart_teamManager.findOne({where: {username:username, teamId:teamId}});
    if(checkTeam && !teamId){
     return res.json({error: "Please select a team"});
    }else if(!managerName){
      return res.json({error: "Group name cannot be blank"});
    }else if(!yourName){
      return res.json({error: "Your name cannot be blank"});
    }else if(checkName){
      return res.json({error: "Group already exist in this team"});
    }else if(checkData){
      return res.json({error: "You already submitted manager application to this team"});
    }
    else{
      await msmart_teamManager.create({
        username: username,
        nameInTeam: yourName,
        teamId: teamId,
        managerName: managerName,
        managerUsername: username,
        position: 'Manager',
        isVerified: 0
      }).then(() => {
        return res.json({succMsg: 'Successfully join team as Manager'});
      }).catch((error) => {
        return res.json({error: 'Unable to join team as Manager. Please try again.'});
      });
    }
    

  }catch(error){
    console.log(error)
    return res.json({error: 'Unable to join team as Manager. Please try again.'});
  }


})

router.post('/create/team', validateToken, async (req,res) => {
  try{
    const username = req.user.username;
    const {teamName, yourName} = req.body;
    const checkTeam = await msmart_team.findOne({where: {teamName:teamName}});
    if(checkTeam){
      return res.json({error: "Team with this name already existed"})
    }else{
      await msmart_team.create({
        username: username,
        teamName: teamName
      }).then( async (response) => {
        console.log()
        await msmart_teamManager.create({
          username: username,
          nameInTeam: yourName,
          teamId: response.dataValues.id,
          managerName: username,
          managerUsername: username,
          position: 'Owner',
          isVerified: 1
        }).then(()=> {
          res.json({succMsg: 'Team created successfully!'});
        }).catch((error) => {
          console.log(error)
          res.json({error:'Unable to create team. Please try again'});
        })
      }).catch((error) => {
        console.log(error);
        res.json({error:'Unable to create team. Please try again'});
      })
    }
  }catch(error){
    res.json({error: 'Unable to create team. Please try again'});
    console.log(error);
  }
})

router.put('/lead/:teamName/:id', validateToken, async (req,res) => {
  try{
    const username = req.user.username;
    const id = req.params.id;
    const teamName = req.params.teamName;
    const {name, country, phone, status, remark, followUp} = req.body;
    let activity = '';


    const getTeam = await msmart_teamManager.findOne({where: {username: username, teamId: teamName}});
    const nameInTeam = await getTeam.nameInTeam;
    const lead = await msmartleads.findOne({where: {id : id}});
    const currFUDate = await lead.followUpDate;
    let updateActivity = `${nameInTeam} updated `

    console.log(lead.followUpDate, new Date(followUp))

    if(followUp === ''){
      fuDate = currFUDate
    }else{
      fuDate = new Date(followUp)
    }

    if(!name || !country || !phone || !status){

      return res.status(400).json({error: "Lead details are required"})

    }else{
      await msmartleads.update({
        name: name,
        phone: phone,
        status: status,
        remark: remark,
        followUpDate: fuDate
      }, {where: {id: id}}).then( async () => {


  
        if(lead.status != status ){
          const update = updateActivity.concat(`status from ${lead.status} to ${status}. `)
          activity = activity.concat(update)
        }
        if(lead.remark != remark){
          const update = updateActivity.concat("lead's remark. ")
          activity = activity.concat(update)
        }
        if(String(lead.followUpDate) != String(new Date(followUp))){
          const update = updateActivity.concat(`follow up date on ${new Date(followUp).toString().substr(4,11)}. `)
          activity = activity.concat(update)
        }

        if(lead.status != status || lead.remark != remark || String(lead.followUpDate) != String(new Date(followUp))){
          await msmart_activity.create({
            username: username,
            teamId: parseInt(teamName, 10),
            activity: activity,
            msmartleadId: id
          })
        }

  
      }).then(() => {
        res.json({success: 'Leads updated successfully'})
      })
    }



  }catch(error){
    res.json({error:"Cant update database. Please try again"})
    console.log(error)
  }
})

router.put('/manager/approve/member', validateToken, async (req,res) => {
  
  const {id} = req.body;

  try{

    await msmart_teamManager.update({isVerified: 1}, {where: {id: id}}).then(() => {
      res.json({succ:"Approved member request succesfully"})
    })

  }catch(err){
    res.json({err: "Unable to approve member request"})
  }
})

router.delete('/lead/:leadid', validateToken, async(req,res) => {
  const username = req.user.username;
  const id = req.params.leadid;

  try{
    await msmartleads.destroy({where: {id: id}}).then(() => {
      res.json({succ: 'Database deleted'})
    })

  }catch(err){
    res.json({err: "Unable to delete database"})
    console.log(err)
  }
})

router.delete('/manager/member/:id', validateToken, async (req,res) => {

  const id = req.params.id;

  try{

    await msmart_teamManager.destroy({where: {id: id}}).then(() => {
      res.json({succ:"Deleted member request succesfully"})
    })

  }catch(err){
    res.json({err: "Unable to delete member request"})
    console.log(err)
  }

})





module.exports = router;