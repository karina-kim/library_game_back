var mongoose = require("./Setup");

var gameSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    name:String,
    image:String
});
var Game = module.exports = mongoose.model('Game', gameSchema);

module.exports.get_game_by_id = function(id,callback){
    Game.findById(id,callback);
}
module.exports.getAll = function(callback){
	Game.find({},callback);
}
