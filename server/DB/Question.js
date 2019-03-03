var mongoose = require("./Setup");

var QuestionSchema = new mongoose.Schema({
    question:{
        type:String,
        required:true
    },
    answers:[{
        type:String,
    }],
    correct:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    author:{
        type:String
    },
    incorrect:{
        type:String,
        default: 0
    }
});
var Question = module.exports = mongoose.model('Question', QuestionSchema);


module.exports.getById = function(id, callback){
    Question.findById(id, callback);
};

module.exports.isCorrect = function(id, ans,callback){
    Question.findById(id,function(err,question){
        if(question.correct === ans)
        {
            callback(true);
        }
        else
        {
            callback(false);
        }
    });
};
module.exports.create = function(newQuestion, callback){
    newQuestion.save(callback);
}
module.exports.getAll=function(callback){
    Question.find({},callback);
}
module.exports.incorrect = function(id, callback){
    Question.findByID(id, ((err,question)=>{
        console.log("Number of incorrect answers")
        console.log(question.incorrect_answers)
        question.incorrect_answers=question.incorrect_answers+1
        question.save(callback);
    }));
}