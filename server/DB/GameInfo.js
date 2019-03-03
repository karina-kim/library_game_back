var mongoose = require("./Setup");

var gameInfo = new mongoose.Schema({
    name:{
        type: String
    },
    value:{
        type: Number
    },
    array:{
        type: String
    }
    // newUsers:{
    //     type: Number,
    //     default:0
    // },
    // onlineUsers:{
    //     type: Number,
    //     default: 0
    // },
    // incorrectly_answered_cards:[{
    //     type: String
    // }],
    // incorrectly_answered_questions:[{
    //     type: String
    // }]
});

var Info = module.exports = mongoose.model('Info', gameInfo);
console.log("I am in data info scheme")

module.exports.get_statistics = function(callback){
    console.log("I am in get statistics")
    Info.find({},function (err,data) {
        callback(err, data)
    });
}

module.exports.add_new_user = function(callback){
    Info.findOne({name:"registered"}, function(err, stat){
        if(stat==null){
            stat= new Info({name: "registered", value:0})
        }
        console.log(stat);
        stat.value=stat.value+1;
        stat.save(callback);
    })
}

module.exports.add_online_user = function(callback){
    Info.findOne({name:"online"}, function(err, stat){
        if(stat==null){
            stat= new Info({name: "online", value:0})
        }
        console.log(stat);
        stat.value=stat.value+1;
        stat.save(callback);
    })
}

