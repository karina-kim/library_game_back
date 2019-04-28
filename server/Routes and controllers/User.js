const Router = require('express').Router();
const User = require('../DB/User');
const Responces  =require('./Responces');
const multer  = require('multer');
const Info = require('../DB/GameInfo');

var fs = require('fs');
var upload = multer({ dest: 'uploads/avatars/' });
//Controllers
//change_avatar
const Controllers  = {
	login:(req,res)=>
	{
		console.log(req.body);
		var errs = [];
		if(!req.body.email)errs.push("Empty email field");
		if(!req.body.password)errs.push("Empty password field");
		if(errs.length !== 0){
			console.log("sad");
			Responces.send_errors(errs,res);
		}else
		{
			let user = new User();
			user = {
				email: req.body.email, password:req.body.password, username: req.body.user
			}
			User.login(user,function(err,user){
				if (err) {
                    Responces.send_errors(err,res);
				}
				else if(!user) {
                    Responces.send_errors(["Could not find such user"],res);
				}
				else
				{
					if(req.body.user==="User") {
                        console.log("Login for User")
                        Info.add_online_user();
                        req.session.user = user._id;
                        let message = {
                        	id: user._id,
							status: user.status
						}
						Responces.send_responce(message, res);
                    }
                    else if(req.body.user==="Admin"){
						console.log("Login for Admin")
						req.session.user = user._id;
                        let message = {
                            id: user._id,
                            status: user.status
                        }
						Responces.send_responce(message,res);
					}
				}
			});
		}	
	},
	logout:(req,res)=>
	{
		req.session.destroy(
			function(err2) 
			{
				if (err2) Responces.send_errors(err2,res);
				else Responces.send_responce("You successfully logged out",res);
			})
	},
	register:(req,res)=>
	{
		console.log(req.body)
		var errors=[];
		if(!req.body.email) errors.push("Empty email field");
        if(!req.body.name) errors.push("Empty First name field");
        if(!req.body.second_name) errors.push("Empty Second Name field");
		if(!req.body.password) errors.push("Empty password field");
		if(req.body.password!==req.body.password2) errors.push("Passwords do not match")
		if(errors.length===0)
		{
			var user=null;
			if(req.body.university_id) {
                user = new User({
                    email: req.body.email,
                    name: req.body.name,
                    second_name: req.body.second_name,
                    username: req.body.username,
                    password: req.body.password,
                    university_id: req.body.university_id,
                    points: 0,
                });
            }
            else{
                user = new User({
                    email: req.body.email,
                    name: req.body.name,
                    second_name: req.body.second_name,
                    username: req.body.username,
                    password: req.body.password,
                    points: 0,
                });
			}
			console.log("Registration")
			User.register(user,
				function (err,user)
				{
					if (err) 
					{
						Responces.send_errors(err,res);
					}
					else 
					{
						Info.add_new_user();
						Responces.send_responce(user,res);
					}
				}
			);

		}
		else
		{
			Responces.send_errors(errors,res);
		}
	},
	add_points:(req,res)=>
	{
		console.log(req.body);
		User.add_points(req.body.userID,req.body.points,function(err,data){
			if (err) Responces.send_errors(err,res);
			else Responces.send_responce(data,res);
		})
	},
	change_avatar:(req,res)=>
	{
		if(!req.file || !req.body.user_id)return Responces.send_errors(["DID NOT SUBMIT ALL DATA"],res)
        var tmp_path = req.file.path;
        var target_path = 'uploads/avatars/' + req.file.originalname;
        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on('error', function(err) { res.send('error'); });
        User.add_avatar(target_path,req.body.user_id,(err,responce)=>{
        	if(err) Responces.send_errors(err,res)
        	else Responces.send_responce("uploaded!",res);
        });
	},
	get_user_data:(req,res)=>
	{
		console.log("mey",req.body.id);
		User.get_info(req.body.id,(err,data)=>{
			if(err)Responces.send_errors(err,res);
			else Responces.send_responce(data,res);
		});
	},
	check_logged_in:(req,res)=>{
		console.log(req.session)
		Responces.send_responce(req.session.user,res);
	},
	get_user_image:(req,res)=>{
		console.log(req.body)
		User.get_image(req.body.id,function(err,user){
			if(err) Responces.send_errors(err,res);
			else if(user) {
                console.log("->",user);
				var img = fs.readFileSync(user);
        		res.writeHead(200, {'Content-Type': 'image/gif' });
        		res.end(img, 'binary');
			}
			else res.status(404).send("Could not find image")
		})
	},
	updateUser:(req,res)=>{
		let errors=[];
		if(!req.body.user){
			errors.push("Cannot find user, please reloggin again");
		}
		if(req.body.new_password !== req.body.confirmation){
			errors.push("Passwords do not match!");
		}
		if(errors.length===0){
			var newUser = new User({email:req.body.email,university_id:req.body.university_id,name:req.body.name,second_name:req.body.second_name,school:req.body.school,university_started_date:req.body.year, password:req.body.new_password});
			User.updateUser(newUser,req.body.old_password,req.body.user,((err,data)=>{
				if(err) Responces.send_errors(err,res);
				else{ Responces.send_responce(data,res)}
			}))
		}
		else{
			Responces.send_errors(errors,res);
		}
	},
	get_users_sorted_by_points:(req,res)=>{
		User.get_users_sorted_by_points((err,data)=>{
			if(err) Responces.send_errors([err],res);
			else Responces.send_responce(data,res);
		})
	},
	get_user_points:(req,res)=>{
		User.get_points(req.body.id, (err,points)=>{
			if(!err)Responces.send_responce({points:points},res);
			else Responces.send_errors({points},res);
		})
	},

	save_color1:(req, res)=>{
		User.save_color1(req.body.user, req.body.color1, (err, data)=>{
            if(err)Responces.send_errors(err,res);
            else Responces.send_responce(data,res);
		})
	},

	save_color2:(req, res)=>{
		User.save_color2(req.body.user, req.body.color2, (err,data)=>{
            if(err)Responces.send_errors(err,res);
            else Responces.send_responce(data,res);
		})
	},

    get_color1:(req, res)=>{
        User.get_color1(req.body.id, (err, data)=>{
            if(err)Responces.send_errors(err,res);
            else Responces.send_responce(data.color1,res);
        })
    },

    get_color2:(req, res)=>{
        User.get_color2(req.body.id,(err, data)=>{
            if(err)Responces.send_errors(err,res);
            else Responces.send_responce(data.color2,res);
        })
    },

	getAllAdmins:(req, res)=>{
		User.getAllAdmins((err,admins)=> {
			console.log("LLLLLLL")
			console.log(admins)
			if(err)Responces.send_errors(err,res);
			else Responces.send_responce(admins, res)
		})
	},

	changeUserStatus:(req, res)=>{
		console.log("KNJBOU")
		console.log(req.body.id)
		User.changeStatus(req.body.id, (err, data)=>{
			if(err) Responces.send_errors(err, res);
			else Responces.send_responce((data.status, res));
		})
	}
}

//Routes
Router.route('/login').post(Controllers.login);
Router.route('/get_color1').post(Controllers.get_color1);
Router.route('/get_color2').post(Controllers.get_color2);
Router.route('/save_color1').post(Controllers.save_color1);
Router.route('/save_color2').post(Controllers.save_color2);
Router.route('/logout').post(Controllers.logout);
Router.route('/register').post(Controllers.register);
Router.route('/add_points').post(Controllers.add_points);
Router.route('/change_avatar').post(upload.single("card"),Controllers.change_avatar);
Router.route('/get_info').post(Controllers.get_user_data);
Router.route('/check_logged_in').get(Controllers.check_logged_in);
Router.route('/get_image').post(Controllers.get_user_image);
Router.route('/update_user').post(Controllers.updateUser);
Router.route('/get_user_points').post(Controllers.get_user_points);
Router.route('/get_users_sorted_by_points').get(Controllers.get_users_sorted_by_points);
Router.route('/get_all_admins').post(Controllers.getAllAdmins);
Router.route('/change_status').post(Controllers.changeUserStatus);
//exporting router
module.exports = Router 

