var mongoose = require("./Setup");

var userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        default: "User"
    },
    password:{
        type:String,
        required:true
    },
    points:{
        type:Number,
        default:0
    },
    university_id:{
        required: true,
        type:String,
    },
    image:{
        type:String
    },
    name:{
        required: true,
        type:String
    },
    second_name:{
        type:String
    },
    university_started_date:{
        type: Date
    },
    school:{
        type: String
    },

    color1:{
        type: String,
        default: "LIGHTPINK"
    },

    color2:{
        type: String,
        default: "PAPAYAWHIP"
    },
    status:{
        type: Boolean,
        default: true
    },
    adminType:{
        type: String,
        default: "defaultUser"
    }
});
var User = module.exports = mongoose.model('User', userSchema);

module.exports.register = function(newUser, callback){
    newUser.save(callback);
}

module.exports.getAllAdmins = function(callback){
    User.find({adminType: "defaultUser"}, callback)
}

module.exports.changeStatus = function(id, callback){
    User.findById(id, ((err,user)=> {
        if (user.status) {
            user.status = false
        }
        else {
            user.status = true
        }
        user.save(callback);
    }))
}

module.exports.get_by_email= function(email, callback){
    var query = {email: email};
    User.findOne(query, callback);
}

module.exports.get_info = function(id, callback){
    User.findById(id, callback);
}

module.exports.get_color1 = function(id, callback){
    User.findById(id, callback);
}

module.exports.get_color2 = function(id, callback){
    User.findById(id, callback);
}

module.exports.save_color1 = function(id, color, callback){
    User.findById(id,((err,user)=>
        {
            if(err)throw err;
            else{
                user.color1 = color;
                user.save(callback);
            }
        }
    ))
}

module.exports.save_color2 = function(id, color, callback){
    User.findById(id,((err,user)=>
        {
            if(err)throw err;
            else{
                user.color2 = color;
                user.save(callback);
            }
        }
    ))
}

module.exports.add_points = function(id,points,callback){
    console.log("GONNA ADD ",points, "to ",id)
    User.findOne({_id:id},((err,user)=>
        {
            if(err)throw err;
            else
            {
                user.points = user.points+points * 1;
                user.save(callback);
            }
        }
        ))
}
module.exports.add_avatar=(avatar,id,callback)=>{
    User.update({_id:id}, { $set: {image:avatar}},function(err){if (err) throw err; else callback();});
}
module.exports.login = function (user, callback) {
    User.findOne(user,callback);
}
module.exports.get_image=(id,callback)=>{
    User.findById(id,((err,user)=>{
        if(user) callback(err,user.image) ;
        else console.log("Could not find user")
    }))
}
module.exports.updateUser = (newUser,oldPassword,id,callback)=>{
    console.log("=>",id,"=>",oldPassword)
    User.findOne({_id:id, password:oldPassword}).then((err,user)=>{
        if(err) throw err;
        else{
            user= newUser;
            user.save(callback);
        }
    })
}
//does not check which game is it, TODO
module.exports.get_users_sorted_by_points=(callback)=>{
    User.find({username: "User"}).sort({points:-1}).limit(10).exec(function(err, docs) {
        callback(err,docs)
    });
}
module.exports.get_points = (id,callback)=>{
    User.findOne({_id:id},((err,user)=> {
        if (err) throw err;
        else {
            console.log(user.points)
            callback(err, user.points);
        }
    }
    ))
}