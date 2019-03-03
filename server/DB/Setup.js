//packages import
const mongoose = require('mongoose');
//packages setup
//mongoose.connect("mongodb://localhost:27017/library",{ useNewUrlParser: true });
mongoose.connect("mongodb://daemao:daemao1@ds125211.mlab.com:25211/matching-game",{ useNewUrlParser: true }).catch();
var somevar = false;
var PTest = function () {
    return new Promise(function (resolve, reject) {
        if (somevar === true)
            resolve();
        else
            reject();
    });
}
var myfunc = PTest();
myfunc.then(function () {
    console.log("Promise Resolved");
}).catch(function () {
    console.log("Promise Rejected");
});
//export
module.exports = mongoose;
