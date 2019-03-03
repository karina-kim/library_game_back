const Router = require('express').Router();
const Responces = require('../Responces');
const Question = require('../../DB/Question');
const questionNumber = 10;
//Controllers
const Controllers  = {
	startGame:(req,res)=>
	{
		if(!req.session.questioningGame)
		{
			Question.getAll((err,questions)=>
			{
				if(err){Responces.send([err],res);}
				else{
					questions.forEach(element=> element.answered = false);
					req.session.questioningGame ={
						answered:[],
						correctly_answered : [],
						questions : questions
					}
					req.session.save(Responces.send_responce(req.session.questioningGame,res));
				}	
			})
		}
		else
		{
			Responces.send_responce(req.session.questioningGame,res);
		}	
	},
	answerQuestion:(req,res)=>
	{
		if(!req.session.questioningGame){
			Responces.send_errors(["Please, start the game"],res);
		}
		var question_index = "NOT FOUND" ;
		req.session.questioningGame.questions.forEach((quest,index)=>
		{
			if(quest._id===req.body.question_id && req.session.questioningGame.correctly_answered.indexOf(index) === -1) question_index=index;
		});
		if(question_index === "NOT FOUND")
		{
			Responces.send_errors(["You already answered this question"],res);
		}
		else
		{
			req.session.questioningGame.answered.push(question_index);
			Question.isCorrect(req.body.question_id,req.body.answer,(correct)=>
			{
				if(correct)
				{
					req.session.questioningGame.correctly_answered.push(question_index);
				}
				req.session.save((err)=>
				{
					Responces.send_responce(req.session.questioningGame,res);
				})
			})
		}
		
	},
	finishGame:(req,res)=>
	{
		req.session.questioningGame = null;
		req.session.save(
			(err)=>{
				if(err){Responces.send_errors([err],res)}
			}
			);
		Responces.send_responce("have a good day",res)
		
	},

    newQuestion: function(req,res)
    {
        const type=req.body.type;
        let newQuestion;
        if(type==="multiple-choice")
        {
            const q = req.body.question;
            const a = req.body.answers.split("&&&");
            const c = req.body.correct;
            const author = req.body.author;
            newQuestion=new Question({
                question:q,
                answers:a,
                correct:c,
                type:type,
				author: author
            });
        }else if(type ==="text-answer"){
            const q = req.body.question;
            const c = req.body.correct;
            newQuestion = new Question({
                question:q,
                correct:c,
                type:type
            })
        }
        Question.create(newQuestion,function(err,acc){
            if (err){
                res.status(500);
                res.send("Could not create question")
            }else{
                res.status(200);
                res.send("created");
            }
        })

    },
    getAllQuestions:function(req,res)
    {
        Question.getAll((err,data)=>{if (err) console.log(err); else res.send(data)});
    },
    incorrect_answer:function(req, res){
        Question.incorrect(req.body.id, (err, number)=>{
            if(err)Responces.send_errors(err,res);
            else Responce.send_responce(number, res);
        })
    }
}

//Routes
Router.route('/start').post(Controllers.startGame);
Router.route('/answer').post(Controllers.answerQuestion);
Router.route('/question').post(Controllers.newQuestion);
Router.route('/get_all').get(Controllers.getAllQuestions);
Router.route('/incorrect').post(Controllers.incorrect_answer);
//exporting router
module.exports = Router