const Router = require('express').Router();
const Responces  =require('./Responces');

var fs = require('fs');
//Controllers
//change_avatar
const Controllers  = {
 	getGameImage:function (req,res) {
        var img = fs.readFileSync(req.query.url);
        res.writeHead(200, {'Content-Type': 'image/gif' });
        res.end(img, 'binary');
    },
}

//Routes
Router.route('/').get(Controllers.getGameImage)
//exporting router
module.exports = Router
