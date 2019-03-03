var mongoose = require("./Setup");

var Issue = new mongoose.Schema({
    createdBy:mongoose.Schema.Types.ObjectId,
    closed:mongoose.Schema.Types.ObjectId,
    created_date:Date,
    closed_date:Date,
    solvedBy:mongoose.Schema.Types.ObjectId,
    type_id:mongoose.Schema.Types.ObjectId,
});
var Issue = module.exports = mongoose.model('Issue', Issue);
