const {Schema,model}=require('mongoose')
const mongoose=require('mongoose')

const userSchema=new Schema({
name:{
    type:String,
    required:true,

},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},
role:{
    type:String,
    default:'student',
    enum:['student','admin','superAdmin']
},
profilePicLink:String,
CreatedAt:Date,
totalQuizAttempted:[{

quizId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'quizModel'},

    solved:{
    type:Boolean,
        default: false
    },
    score:{
    type:Number,
        default:0
    }
}],
    totalPoints:{
    type:Number,
        default:0
    },
    courseEnrolled:[String]
})
const quizSchema=new Schema({
    name:{
        type:String,
        required:true
    },
     description:{
        type:String,
         required:true
     },
    difficulty:{
        type:String,
        enum:['Hard','Easy',"Medium",'basic']
    },
    quizes:[{
        question:String,
        option:[String],
        correctAnswer:{
            type:String,
            required:true
        }


    }],
    category:{
        type:String,
        required:true,
    }


})
const userModel=model("User",userSchema);
const quizModel=model("Quiz",quizSchema);
module.exports={userModel,quizModel};

