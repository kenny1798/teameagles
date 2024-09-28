const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const path = require("path");
const rangeParser = require("range-parser")
const { mu_course,mu_chapter,mu_video,mu_question,mu_answer,mu_script,mu_progress,mu_userScript,subscription, Users, mu_lessonFinish } = require('../models');
const { validateToken, validateAdmin } = require("../middlewares/AuthMiddleware");
require('dotenv').config();



router.get('/get/courses', validateToken, async (req,res) => {
    const getCourses = await mu_course.findAll();
    res.json(getCourses);
});

router.get('/register/:course', validateToken, async (req,res) => {
    try{
        const shortlink = req.params.course;
        const username = req.user.username;
        const progress = await mu_progress.findOne({where:{username:username, shortlink: shortlink}});
        if(progress){
            res.json({err: 'You already registered to the course'})
        }else{

            await mu_progress.create({
                username: username,
                shortlink: shortlink,
                currentLesson: 1
            }).then(async() => {
                await mu_lessonFinish.create({
                    username: username,
                    shortlink: shortlink,
                    lesson: 1,
                    question: 0,
                    script: 0
                }).then( async () => {
                    await subscription.create({
                        username: username,
                        subsItem: 'MU',
                        subsType: shortlink,
                        subsPeriod: 1,
                        startDate: Date.now(),
                        endDate: new Date('2060-12-31 00:00:00')
                    }).then(() => {
                        res.json({succ: 'Registered Course successfully'})
                    })
                })
            })

        }


        
    }catch(err){
        res.json({err: "Failed to register to course. Please try again"})
        console.log(err)
    }
})

router.get('/get/course/:course', validateToken, async (req,res) => {
    try{
        const shortlink = req.params.course;
        const getCourse = await mu_course.findOne({where: {shortlink: shortlink}});
        const logo = await getCourse.logoFile;
        const title = await getCourse.courseName;
        const desc = await getCourse.description;
        res.json({logo:logo, title:title, desc:desc})

    }catch(err){
        console.log(err)
    }
})

router.get('/get/chapter/:course', validateToken, async (req,res) => {
    try{
        const shortlink = req.params.course;
        const getChapter = await mu_chapter.findAll({where: {shortlink: shortlink}});
        let chapterTitle = [];
        for(var i =0; i< getChapter.length; i++){
            const singleChap = getChapter[i];
            const chapter =  singleChap.chapter;
            const getVid = await mu_video.findOne({where: {shortlink: shortlink, chapter: chapter}})
            const chapTitle = await getVid.chapterTitle;
            chapterTitle.push(chapTitle);
        }
        res.json({chapter:getChapter, chapterTitle:chapterTitle});

    }catch(err){
        console.log(err)
    }
})

router.get('/get/chapter/:course/:chapter', validateToken, async (req,res) => {
    try{
        let allVid = [];
        const shortlink = req.params.course;
        const chapter = req.params.chapter;
        const getChapter = await mu_chapter.findOne({where: {shortlink: shortlink, chapter:chapter}});
        const getLessonId = await getChapter.lessonId;
        const splitId = getLessonId.split(',')
        for(var i=0; i<splitId.length; i++){
            var singleId = splitId[i]
            var parsedId = parseInt(singleId, 10);
            const getLesson = await mu_video.findOne({where:{shortlink: shortlink, id:parsedId}});
            const vidOrder = await getLesson.vidOrder;
            allVid.push(vidOrder)
        }
        const lastLessonCount = await getChapter.lastLessonCount;
        res.json({lastLessonCount:lastLessonCount, vidOrder:allVid});

    }catch(err){
        console.log(err)
    }
})

router.get('/get/lesson/all/:course/:chapter', validateToken, async (req,res) => {
    try{
        const course = req.params.course;
        const chapter = req.params.chapter;
        const allLesson = await mu_video.findAll({where:{shortlink:course, chapter: chapter}})
        res.json(allLesson)

    }catch(err){
        console.log(err)
    }
})

router.get('/stream/:course/:chapter/:lesson', validateToken, async (req,res) => {

    console.log('Received a request for /api/video');

  const course = req.params.course;
  const chapter = req.params.chapter;
  const lesson = req.params.lesson;
  const videoPath = `media/course_video/${course}-${chapter}-${lesson}.mp4`;
  const videoSize = fs.statSync(videoPath).size;
  const rangeHeader = req.headers.range;

  if (rangeHeader) {
    const ranges = rangeParser(videoSize, rangeHeader);

    if (ranges === -1) {
      res.status(416).send('Requested Range Not Satisfiable');
      return;
    }

    const range = ranges[0];
    const start = range.start;
    const end = range.end;

    const contentLength = end - start + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    });

    const stream = fs.createReadStream(videoPath, { start, end });
    stream.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': videoSize,
      'Content-Type': 'video/mp4',
    });

    fs.createReadStream(videoPath).pipe(res);
  }
})

router.get('/get/data/:course/:chapter/:lesson', validateToken, async (req,res) => {
    try{
        const shortlink = req.params.course;
        const chapterParam = req.params.chapter;
        const lessonParam = req.params.lesson;
        const getLesson = await mu_video.findOne({where: {shortlink:shortlink, chapter: chapterParam, vidOrder: lessonParam}});
        const lessonTitle = await getLesson.lessonTitle;
        const vidFile = await getLesson.vidFile
        res.json({lessonTitle:lessonTitle, vidFile:vidFile})
    }catch(err){
        console.log(err)
    }
});

router.get('/get/script/:course/:lesson', validateToken, async (req,res) => {
    try{
        const course = req.params.course;
        const lesson = req.params.lesson;
        const username = req.user.username;
        let userScript;
        let script;
        let instruction;
        const getScript = await mu_script.findOne({where: {shortlink: course, vidOrder: lesson}});
        const getUserScript = await mu_userScript.findOne({where: {username:username, shortlink: course, vidOrder:lesson}});
        if(getUserScript){
            userScript = await getUserScript.answer;
        }else{
            userScript = '';
        }
        if(getScript){
            script = await getScript.script;
            instruction = await getScript.instruction;
        }else{
            script = '';
            instruction = '';
        }
        res.json({script: script, instruction: instruction, userScript: userScript});
    }catch(err){
        console.log(err)
    }
})

router.get('/check/script/:course', validateToken, async(req,res) => {
    try{
        const course = req.params.course;
        const username = req.user.username;
        const getCourse = await mu_course.findOne({where:{shortlink: course}});
        const checkScript = await getCourse.hasScript;
        const vidCount = await getCourse.vidCount;
        if(checkScript === true){
            const getProgress = await mu_progress.findOne({where: {shortlink:course, username:username}});
            const progress = await getProgress.currentLesson;
            if(progress > vidCount){
                res.json({progress:'Progress'})
            }else{
                res.json({none:'none'})
            }
        }else{
            res.json({none:'none'})
        }
    }catch(err){

    }
})

router.get('/get/:course/script', validateToken, async (req,res) => {
    try{
        const course = req.params.course;
        const username = req.user.username;
        let script = [];
        const userScript = await mu_userScript.findAll({where: {username: username, shortlink: course}});
        if(userScript){
            for(var i =0; i< userScript.length; i++){
                const singleUserScript = userScript[i];
                const singleScript = singleUserScript.answer;
                const singleVidOrder = singleUserScript.vidOrder;
                const video = await mu_video.findOne({where:{vidOrder:singleVidOrder}});
                const lessonTitle = await video.lessonTitle;
                script.push({lesson:lessonTitle ,script: singleScript})

            }
            res.json({script: script})
        }
        
    }catch(err){
        console.log(err)
    }

})

router.get('/get/:course/progress', validateToken, async (req,res) => {
    try{
        const shortlink = req.params.course;
        const username = req.user.username;
        const getProgress = await mu_progress.findOne({where:{shortlink:shortlink, username:username}});
        const progress = await getProgress.currentLesson;
        res.json({progress: progress})

    }catch(err){
        console.log(err)
    }
});

router.get('/get/progress', validateToken, async (req,res) => {
    try{
        const username = req.user.username;
        const progress = await mu_progress.findAll({where:{username:username}});
        res.json({progress: progress})

    }catch(err){
        console.log(err)
    }
});

router.get('/get/question/:course/:lesson', validateToken, async (req,res) => {
try{
    let listOfQuestionsAnswers = [];

    
    const shortlink = req.params.course;
    const paramLesson = req.params.lesson;
    const getQuestions = await mu_question.findAll({where: {shortlink:shortlink, vidOrder:paramLesson}});

    for(var i =0; i<getQuestions.length; i++){
        let answerOptions = [];
        const getQuestion = getQuestions[i];
        const question = getQuestion.question;
        const answersId = getQuestion.answerOptionId.split(',');
        for(var j=0; j<answersId.length; j++){
            
            const singleId = answersId[j];
            const parsedSingleId = parseInt(singleId, 10);
            const getSingleAnswer = await mu_answer.findOne({where: {id: parsedSingleId}});
            const singleAnswer = await getSingleAnswer.answer;
            answerOptions.push(singleAnswer)
        }
        listOfQuestionsAnswers.push({question : question, answers: answerOptions})
    }

    res.json(listOfQuestionsAnswers)

        

}catch(err){
    console.log(err)
}
});

router.get('/manager/get/progress/:courseName', validateToken, async (req,res) => {
    let progresses = [];
    
    const managerUsername = req.user.username;
    const course = req.params.courseName;

try{

  const manager = await Users.findOne({where: {username: managerUsername}});
  const managerid = await manager.id;
  const users = await Users.findAll({where: {managerId: parseInt(managerid, 10)}});
  const selectedCourse = await mu_course.findOne({where: {shortlink: course}});
  const vidCount = await selectedCourse.vidCount

  for (var i=0; i<users.length; i++){
    const user =await users[i];
    const userUsername = user.username;
    const progress = await mu_progress.findOne({where: {username : userUsername, shortlink: course}});
    if(progress){
        progresses.push({user: user, progress: progress})
    }
  }

  return res.status(200).json({data: progresses, vidCount: vidCount})

    }catch(err){

        return res.status(500).json({error: "Error getting lesson progresses"})
    }

})

router.post('/all/get/progress/:course', validateAdmin, async(req,res) => {
    try{
        const paramUsername = req.body.username;
        const course = req.params.course;
        const splitUser = paramUsername.split(', ')
        let data = [];
        let err = [];
        let err1 = [];
        for(var i= 0; i < splitUser.length; i++){
            const singleUsername = splitUser[i];
            const findUserData = await mu_progress.findOne({where: {shortlink: course, username: singleUsername}});
            if(!findUserData){
                err.push(singleUsername)
            }else if(data.find(({username}) => username == singleUsername)){
                err1.push(singleUsername)
            }
            else{
                data.push(findUserData);
            }
        }
        if(!err && !err1){
            res.json({data:data})
        }else if (!err && err1){
            res.json({data:data, err1:err1})
        }else if (err && !err1){
            res.json({data:data, err:err})
        }else{
            res.json({data:data, err:err, err1:err1})
        }
    }catch(err){
        console.log(err)
    }
   
})

router.post('/submitLesson/:course/:chapter/:lesson', validateToken, async (req,res) => {
    try{

        const shortlink = req.params.course;
        const chapter = req.params.chapter;
        const paramLesson = req.params.lesson;
        const parsedLesson = parseInt(paramLesson, 10)
        const username = req.user.username;
        const {questions, answers, script} = req.body;
        let wrongAnswer = [];
        const checkFinishLesson = await mu_lessonFinish.findOne({where: {username: username, shortlink: shortlink, lesson: paramLesson}})
        console.log(checkFinishLesson.question)

        console.log(questions, answers)

        if(script){
            const getUserScript = await mu_userScript.findOne({where:{username: username, shortlink:shortlink, vidOrder: paramLesson}});
            if(getUserScript){
                await mu_userScript.update({answer: script}, {where:{username: username, shortlink:shortlink, vidOrder: paramLesson}})
            }else{
                await mu_userScript.create({
                    username: username,
                    shortlink: shortlink,
                    vidOrder: paramLesson,
                    answer: script
                }).then(async () => {
                    await mu_lessonFinish.update({script: 1},{where:{username: username, shortlink:shortlink, lesson: paramLesson}})
                })
            }
        }else{
            await mu_lessonFinish.update({script: 1},{where:{username: username, shortlink:shortlink, lesson: paramLesson}})
        }


        if(questions && answers){
                for(var i=0; i<questions.length; i++){
                    const question = questions[i];
                    const getQuestion = await mu_question.findOne({where:{shortlink:shortlink, vidOrder: paramLesson, question: question}});
                    const correctAnswerId = await getQuestion.correctAnswerId;
                    const getCorrectAnswer = await mu_answer.findOne({where: {id:correctAnswerId}});
                    const correctAnswer = await getCorrectAnswer.answer;
                    const userAnswer = answers[i];
                    if(userAnswer != correctAnswer){
                        wrongAnswer.push(i+1)
                    }
                }
            }

            console.log(wrongAnswer.length)
        
        if(checkFinishLesson.question == false){
            console.log('here')
            if(wrongAnswer.length == 0){
                let isLastVideo;
                let isLastSession;
                
                const checkLastVideo = await  mu_video.findOne({where: {shortlink:shortlink, vidOrder: parsedLesson+1, chapter:chapter}})
                const checkLastSession = await mu_video.findOne({where: {shortlink:shortlink, vidOrder: parsedLesson+1}})
                console.log(parsedLesson)
                if(!checkLastVideo){
                    isLastVideo = 'Yes'
                }else{
                    isLastVideo = 'No'
                }
                if(!checkLastSession){
                    isLastSession = 'Yes'
                }else{
                    isLastSession = 'No'
                }

                await mu_lessonFinish.update({question: 1},{where:{username: username, shortlink:shortlink, lesson: parsedLesson}}).then(async () => {
                    await mu_lessonFinish.create({
                        username: username,
                        shortlink: shortlink,
                        lesson: parsedLesson+1,
                        question: 0,
                        script:0
                    })
                    await mu_progress.increment('currentLesson', {by: 1, where: {username: username, shortlink: shortlink}}).then(() => {
                        res.json({success: `Congaratulation, you have successfully finish lesson ${paramLesson}. You will be redirect to next step automatically.`, isLastVideo: isLastVideo, isLastSession: isLastSession})
                    })
                })
            }else{
                const wrongAnswerList = wrongAnswer.join(',');
                res.json({qError: `You answered wrong on question ${wrongAnswerList}. Please answer correctly to proceed next Lesson.`});
            }
        }else{

            if(wrongAnswer.length == 0){
                let isLastVideo;
                let isLastSession;
                
                const checkLastVideo = await mu_video.findOne({where: {shortlink:shortlink, vidOrder: parsedLesson+1, chapter:chapter}})
                const checkLastSession = await mu_video.findOne({where: {shortlink:shortlink, vidOrder: parsedLesson+1}})
                console.log(parsedLesson)
                if(!checkLastVideo){
                    isLastVideo = 'Yes'
                }else{
                    isLastVideo = 'No'
                }
                if(!checkLastSession){
                    isLastSession = 'Yes'
                }else{
                    isLastSession = 'No'
                }
                res.json({success: `Submitted Successfully`, isLastVideo: isLastVideo, isLastSession: isLastSession})
            }else{
                const wrongAnswerList = wrongAnswer.join(',');
                res.json({qError: `You answered wrong on question ${wrongAnswerList}.`});
            }
        }



    }catch(err){
        console.log(err)
    }
})


module.exports = router;