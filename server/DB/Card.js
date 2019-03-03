var mongoose = require("./Setup");
var random = require('mongoose-random');

var CardSchema = new mongoose.Schema({
    image:{
        type:String
    },
    question:{
        type:String
    },
    value:{
        type:String
    },
    answers:[{
        type:String
    }],
    correctAnswer:{
        type:String
    },
    explanation:{
        type:String
    },
    author:{
        type:String
    },
    incorrect_answers:{
        type: Number,
        default: 0
    }
});

CardSchema.plugin(random);
var Card = module.exports = mongoose.model('Card', CardSchema);

module.exports.getById = function(id, callback){
    Card.findById(id, callback);
};
module.exports.create = function (newCard,callback) {
    newCard.save(callback);
}
module.exports.getAll = function (callback) {
    Card.find({},function (err,data) {
        callback(err,data);
    })
}
module.exports.getPairs = function(number,callback){
    Card.findRandom({}, {}, {limit: number*1}, function(err, results) {
        callback(err,results);
    });
}
module.exports.incorrect = function(id, callback){
    Card.findById(id, ((err,question)=>{
        console.log("Number of incorrect answers")
        console.log(question.incorrect_answers)
        question.incorrect_answers=question.incorrect_answers+1
        question.save(callback);
    }));
}