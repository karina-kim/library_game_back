//HAVE TO FINISH IT WITHIN 2 WEEKS AFTER SEMESTER ENDS
//packages
const express = require('express');
const bodyParser = require('body-parser');
const DB = require('./server/DB/Setup');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// declarations
const server = express();
const port = 8000;
const session_secret = "temp";
const session_opts ={
    store: new MongoStore({
        mongooseConnection: DB.connection
    }),
    secret: session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000000}
}

//functions
function ensure_authed(req,res,next){
	console.log(req.session)
	 if (req.session.user)
      return next();
	else{
		res.send("cmon");
	}
}


const path = require('path');
// Serve the static files from the React app
server.use(express.static(path.join(__dirname, 'build')));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(session(session_opts));

server.use('/user',require('./server/Routes and controllers/User'));
server.use('/get',require('./server/Routes and controllers/Filegetters'));
server.use('/game/5b4e2de2fb6fc069480ddf54',require('./server/Routes and controllers/Games/Matching'));
server.use('/game/5b4e8351e7179a508a8d525e',require('./server/Routes and controllers/Games/Questioning'));
server.use('/games',require('./server/Routes and controllers/Games/Default'));
server.use('/support',require('./server/Routes and controllers/Support'));

server.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/build/index.html'));
});
server.listen(port,function (){
	console.log("Server runs on port "+port);
});
