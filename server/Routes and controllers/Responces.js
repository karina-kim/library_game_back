module.exports.send_errors = function(errors,res)
{
	console.log("ERR"+errors);
	if(errors.message){	
	res.status(200).send(JSON.stringify({"errors":[errors.message]}));
	}

	else res.status(200).send(JSON.stringify({"errors":errors}));
}
module.exports.send_responce = function (responce, res)
{
	res.status(200).send(responce);
}