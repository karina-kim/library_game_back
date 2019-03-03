const Router = require('express').Router();
const Responces = require('../Responces');
const Game = require('../../DB/Game');
const Info = require('../../DB/GameInfo');
//Controllers
const Controllers  = {
	getGamesList:(req,res)=>
	{
		Game.getAll((err,data)=>{
			if(err)
			{
				Responces.send_errors([err],res);
			}
			else
			{
				Responces.send_responce(data,res)
			};
		})
	},
	
	getGameInfo:(req,res)=>
	{
		Game.get_game_by_id(req.body.game_id,(err, game)=>{
				if(err)Responces.send_errors(err,res);
				else if(game)
				{
					Responces.send_responce(game,res);
				}
			});
	},

	getStatistics:(req, res)=>
	{
		Info.get_statistics((err,stat)=>{
			if(err){
				Responces.send_errors([err],res);
			}
			else{
				Responces.send_responce(stat,res)
			};
		})
	},

}

//Routes
Router.route('/get_game_info').post(Controllers.getGameInfo);
Router.route('/get_game_list').get(Controllers.getGamesList);
Router.route('/get_statistics').get(Controllers.getStatistics);
//exporting router
module.exports = Router 