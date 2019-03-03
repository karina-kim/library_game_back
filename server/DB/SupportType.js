var mongoose = require("./Setup");

var gameSchema = new mongoose.Schema({
    type:{
      type:String,
      required:true
    },
    description:{
        type:String,
        required:true
    },
    available:{
      days:{
        type:[String]
      },
      time:{
        type:Map,
        of:String
      }
    }
});
var Support = module.exports = mongoose.model('Support', gameSchema);

module.exports.getSupportById = function(id,callback){
  Support.findById(id,callback);
}
module.exports.getAll = function(callback){
	Support.find({},callback);
}
