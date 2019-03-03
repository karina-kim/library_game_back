const Router = require('express').Router();
const Responces = require('../Responces');
const Card = require('../../DB/Card');
const cardNumber = 10;
const multer  = require('multer');
const shuffle =require ('shuffle-array')
var fs = require('fs');
var upload = multer({ dest: 'uploads/' });
const Info = require('../../DB/GameInfo');
//Controllers
const Controllers  = {
	loadGame:(req,res)=>
	{
		console.log("START GAME", req.session.matchingGame);
		if(req.session.matchingGame==="null" || !req.session.matchingGame || req.session.matchingGame.status==="timeout"){
			// console.log("ME HERE ")
			Card.getPairs(cardNumber,(err,table)=>{
				if(err)res.send("err"+err);
				var battlefield = [];
				// console.log(req.time)
				table.forEach(element=>{
					var temp1={
						image:element.image,
						idd:element._id,
						question:element.question,
						answers:element.answers,
						correctAnswer:element.correctAnswer,
						openned:false,
						explanation:element.explanation
					}
					var temp2={
						image:element.image,
						idd:element._id,
						question:element.question,
						answers:element.answers,
						correctAnswer:element.correct,
						openned:false,
						explanation:element.explanation
					 }
					battlefield.push(temp1);
					battlefield.push(temp2);
				})
       			let total2 = shuffle(battlefield);
       			if(total2.length !== 0){
       				req.session.matchingGame = {
       					battlefield: total2,
       					openned:[],
       					found:[],
						answered: [],
       					status:"loaded"
       				};
							// console.log("test"+req.session.matchingGame.started_at);
                    console.log("success")
       				Responces.send_responce(req.session.matchingGame,res);
       			}
			});
		}
		else
		{
			console.log("failed")
			Responces.send_responce(req.session.matchingGame,res);
		}
	},

	startGame:(req, res)=>{
		let time=new Date().getTime()
		Responces.send_responce(time, res)
	},

	openCard:(req,res)=>
	{
		if(!req.session.matchingGame){
			Responces.send_errors(["please start the game"],res);
		}
		else{
			req.session.matchingGame.battlefield[req.body.index*1].openned = true;
			req.session.matchingGame.openned.push(req.body.index*1);
			if(req.session.matchingGame.openned.length === 2)
			{
				if(req.session.matchingGame.battlefield[req.session.matchingGame.openned[0]].idd === req.session.matchingGame.battlefield[req.session.matchingGame.openned[1]].idd)
				{
					req.session.matchingGame.found.push(req.session.matchingGame.openned[0]);
					req.session.matchingGame.found.push(req.session.matchingGame.openned[1]);
					if(req.session.matchingGame.found.length ===req.session.matchingGame.battlefield.length)
					{
						req.session.matchingGame.status = "completed";
					}
				}
			}
			else if(req.session.matchingGame.openned.length===3){
				req.session.matchingGame.battlefield[req.session.matchingGame.openned[0]].openned = false;
				req.session.matchingGame.battlefield[req.session.matchingGame.openned[1]].openned = false;
				req.session.matchingGame.openned.shift();
				req.session.matchingGame.openned.shift();
			}
			Responces.send_responce(req.session.matchingGame,res);
		}

	},
	answer_card_question:(req,res)=>{
		// console.log(req.body);
		Card.findById(req.body.idd,(err,data)=>{
			if(req.body.correctAnswer === data.correctAnswer) Responces.send_responce("CORRECT",res);
			else {
                Card.incorrect(req.body.idd, (err, number)=>{
                    if(err)Responces.send_errors(err,res);
                    else Responces.send_responce(number, res);
                })
            }
		})
	},
	finishGame:(req,res)=>
	{
		req.session.matchingGame = "null";
		Responces.send_responce(req.session.matchingGame,res)

	},
	createCard: function (req,res) {
		// console.log("CARD CREATE")
        // console.log(req.body)
        var tmp_path = req.file.path;
        var target_path = 'uploads/cards/' + req.file.originalname;
        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on('error', function(err) { res.send('error'); });
        var newCard = new Card({
            image:target_path,
            question:req.body.question,
            value:req.body.value,
            answers:req.body.answers.split("&&&"),
            correctAnswer:req.body.correct,
            explanation:req.body.explanation,
			author: req.body.author
        });
        Card.create(newCard);
        res.send(newCard);
    },
    getCardImage:function (req,res) {
    	// console.log(req.query.url);
        var img = fs.readFileSync(req.query.url);
        res.writeHead(200, {'Content-Type': 'image/gif' });
        res.end(img, 'binary');
    },
    getGameStatus:function(req,res){
		console.log(req.session);
		if(!req.session.matchingGame) Responces.send_responce("empty",res);
    	else if (req.session.matchingGame==="null") Responces.send_responce("empty",res);
    	else if(req.session.matchingGame.status==="completed")Responces.send_responce("contains",res);
    	else if(req.session.matchingGame.status === "started")Responces.send_responce("contains",res);
    	else if(req.session.matchingGame.status === "timeout")Responces.send_responce("timeout",res);
    },
    timeout:function(req,res){
    	req.session.matchingGame.status ="timeout";
    	Responces.send_responce("OK",res);
    },

	getCardInfo:function(req, res){
		Card.getAll((err,questions)=>{
            if(err)Responces.send_errors(err,res);
            else Responces.send_responce(questions, res)
		})
	}
}

//Routes
Router.route('/start').get(Controllers.startGame);
Router.route('/load').get(Controllers.loadGame)
Router.route('/open_card').post(Controllers.openCard);
Router.route('/finish_game').get(Controllers.finishGame);
Router.route('/create_card').post(upload.single("card"),Controllers.createCard);
Router.route("/get-card-image").get(Controllers.getCardImage);
Router.route('/get_game_status').get(Controllers.getGameStatus);
Router.route('/answer_card_question').post(Controllers.answer_card_question);
Router.route('/timeout').get(Controllers.timeout);
Router.route('/get_card').get(Controllers.getCardInfo);
//exporting router
module.exports = Router
