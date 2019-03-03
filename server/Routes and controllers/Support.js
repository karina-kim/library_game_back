const Router = require('express').Router();
const Issue = require('../DB/Issue');
const support =  require('../DB/SupportType');

const Controllers = {
  createRequest:      (req,res)=>{
    var issue =  new Issue({
      createdBy:req.body.userID,
      closed:false,
      created_date:new Date,
      type_id:req.body.type
    });
    //console.log(issue)
  },
  closeRequest:       (req,res)=>{
    //Close existing issue
  },
  newSupport:(req,res)=>{
  /*  var supp = new support({
      type:req.body.type,
      description:req.body.description,
      available:{
        days:req.body.days,
        time:req.body.time
      }
    });
    console.log(supp)
    res.send("DONE")*/
    console.log("new request")
    console.log(req.body);
  }
}
const MessageSupport={
  createMessage:      (req,res)=>{
    //Message support
  },
  getMessages:        (req,res)=>{
    //get all messages
  },
  getMessagesByUser:  (req,res)=>{
    //get messages by user
  },
}
const ChatSupport={
  createChat:         (req,res)=>{
    //create new support via chat
  },
  findLibrarian:          (req,res)=>{
    //add new message to chat
  },
  getChat:            (req,res)=>{
    //open chat
  }
}
Router.route('/new').post(Controllers.newSupport);
Router.route('/open').post(Controllers.createRequest);
Router.route('/close').get(Controllers.closeRequest);
Router.route('/message/new').get(MessageSupport.createMessage);
Router.route('/message/getAll').get(MessageSupport.getMessages);
Router.route('/message/get_user_messages').get(MessageSupport.getMessagesByUser);
Router.route('/chat/new').post(ChatSupport.createChat);
Router.route('/chat/librarian').post(ChatSupport.findLibrarian);
Router.route('/chat/get').post(ChatSupport.getChat);
//exporting router
module.exports = Router
