const router=require('express').Router();
const {userModel,quizModel}=require('../models/models')
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose=require('mongoose')
const{authUser, adminAuthentication}=require('../middleware/authmiddleware')
//To signup
router.post('/signup',async(req,res)=>{
    const {name,email,password} = req.body;
    console.log(req.body)
    if(!name || !password || !email){
       return  res.status(400).send({error:"Please fill valid information"})
    }
    try {
        let user = await userModel.findOne({email:email})
        if(user){
           return  res.status(400).send('user already exists')
        }
    }
    catch(err){
      return  res.status(500).send({error:"Error while verifying user"})
    }
    try {
        let user = await userModel.create({
            name,
            email,
            password: bcrypt.hashSync(password, 10)

        })
        let accessToken = jwt.sign({
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                profilePicLink: user.profilePicLink,
                totalQuizAttempted: user.totalQuizAttempted,
                totalPoints: user.totalPoints,
                courseEnrolled:user.courseEnrolled

            },
            process.env.ACCESS_JWT_SECRET, {expiresIn: '8h'})



        res.status(200).json({accessToken:accessToken})
    }
    catch(err){
        res.status(500).send({error:"Error while creating user"})
    }
})

//To login user
router.post('/login',async(req,res)=>{
    const{email,password}=req.body;
    try {
        let user = await userModel.findOne({email: email})
        if (!user) {
            res.status(400).send({error: "User not found"})
        }
        if (!bcrypt.compareSync(password, user.password)) {
            res.status(400).send({error: "password incorrect"})
        }

        let accessToken = jwt.sign({
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                profilePicLink: user.profilePicLink,
                totalQuizAttempted: user.totalQuizAttempted,
                totalPoints: user.totalPoints,
                courseEnrolled:user.courseEnrolled

            },
            process.env.ACCESS_JWT_SECRET, {expiresIn: '8h'})

        res.status(200).json({accessToken: accessToken})
    }
    catch(err){
        res.status(500).send({error:'Server error'})
    }
})
//to get the initial feed for user
router.get('/feed',authUser,async(req,res)=>{
let course=await quizModel.aggregate([
    {
        $group:{
            _id:'$category'
        }
    }
])
    res.status(200).send(course)
})
//to get user registeredCourses
router.get("/getUserCourses",authUser,async(req,res)=>{
let userCourses=req.user.courseEnrolled
let page=parseInt(req.query.page)||0
    let limit=parseInt(req.query.limit)||5
    try {
        let quizes = await quizModel.aggregate([
            {
                $match: {
                    category: {
                        $in: userCourses
                    }
                }
            },
            {
                $skip: limit * page
            }, {
                $limit: limit
            },
            {
                $project: {
                    "_id": 1,
                    "name": 1,
                    "description": 1,
                    "difficulty": 1,
                    "category": 1,
                }
            }
        ])
        res.send(quizes)
    }
    catch(err){
    res.send({error:"Error while getting user courses"})
    }

})
//to get particular quizz
router.get('/getUserCourses/:id',authUser,async(req,res)=>{
    if(!req.params.id){
        res.status(400).send({error:"Enter a valid id"})
    }

    try{
        let id=new mongoose.Types.ObjectId(req.params.id)
        await quizModel.findById(id)
            .then((doc)=>{
                res.send(doc)
            })

    }
    catch(err){
        res.status(500).send({error:"Error while getting user courses"})
    }

})

//to enroll in a course
router.patch('/enrollCourse',authUser,async(req,res)=>{
    const courseName=req.body.courseEnrolled;

    if(!courseName){
        return res.status(400).send({error:"Enter a valid course name"})
    }
    try{
        let user=await userModel.findOne({email:req.user.email})
        // console.log(user)
        user.courseEnrolled.push(courseName)
        // console.log(user)
        await user.save()
res.status(200).send({"message":"Enrolled successfully"})
    }
    catch(err){
        res.status(500).send({error:"Error while updating user Course",err})
    }
})
//to get leaderboard
router.get('/leaderboard',authUser,async(req,res)=>{
    try {
        let users = userModel.aggregate([
            {
                $sort: {
                    totalPoints: 1
                }
            }, {
                limit: 10
            }
        ])
        res.send(users)
    }
    catch(err){
        res.status(500).send({error:"Error while getting leaderboard",err})
    }

})
//to increasePoints
router.patch('/toincreasepoints',authUser,async(req,res)=>{
   let pointsObtained=req.body.pointsObtained;

    try {
       let user = await userModel.findOne({email:req.user.email})
       if (!user) {
           return res.status(400).send({error: "user Not found"})
       }
       user.totalPoints+=pointsObtained
        await user.save()
        res.status.send(pointsObtained)
   }
catch(err){
       res.status(500).send({error:"Error while increasing Points",err})
}
})
//to add user TotalAttemptes quizes
router.patch("/totalAttemptedQuizes",authUser,async(req,res)=>{
    try {
        let user = await userModel.findOne({email: req.user.emai})
        const{quizId,score}=req.body
        user.totalQuizAttempted.push({
            quizId:new mongoose.Types.ObjectId(quizId),
            score:score,
        })
        user.totalPoints+=score
        await user.save()
    }
    catch(err){
        res.status(500).send({error:"Error while TotalAttempts",err})
    }

})
//admin CRUD operations

//to create quiz
router.post('/create-quiz',adminAuthentication,async(req,res)=>{

    let {name,description,difficulty,quizes,category}=req.body;
    if(!name||!description||!difficulty||!category||!quizes){
        return res.status(400).send({error:"Enter a valid info "})
    }
    try {
        let quiz = await quizModel.create({
            name,
           description,
            difficulty,
            quizes,
            category,
        })
        res.status(200).send(quiz)
    }
    catch(err){
        res.status(500).send({error:"Error while creating quiz",err})
    }
})

//to remove a user
router.delete('/toRemoveUser/:id',adminAuthentication,async(req,res)=>{
  let userid;
    try{
        userid=new mongoose.Types.ObjectId(req.params.id);
    }
    catch(err){
        return res.status.send({error:err})
    }
    try{
        let user=await userModel.findByIdAndDelete(userid)
        res.status(200).send("deleted")
    }
    catch(err){
        res.status(500).send({error:"Error while deleting user",err})
    }

})
//to delete the quiz
router.delete('/toRemoveQuiz/:id',adminAuthentication,async(req,res)=>{
    let quizId;
    try{
        quizId=new mongoose.Types.ObjectId(req.params.id);
    }
    catch(err){
        return res.status.send({error:err})
    }
    try{
        let user=await quizModel.findByIdAndDelete(quizId)
        res.status(200).send("deleted")
    }
    catch(err){
        res.status(500).send({error:"Error while deleting user",err})
    }

})



module.exports=router