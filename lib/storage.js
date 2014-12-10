var qiniu = require('qiniu');

var config = require('../config/qiniu.json');

qiniu.conf.ACCESS_KEY = config.access;
qiniu.conf.SECRET_KEY = config.secret;

var bucket = config.bucket,
    path = config.path,
    tokenLifeSeconds = 60 * 60;

var getToken = (function(){
    var token,
        deadline = 0;

    return function(){
        if(Date.now() < deadline){
            return token;
        }else{
            // ten seconds before real deadline
            deadline = Date.now() + (tokenLifeSeconds - 10) * 1000;
            
            var putPolicy = new qiniu.rs.PutPolicy(bucket);
            return (token = putPolicy.token());
        }
    };
})();

var save = function(cnt, key, callback){
    var body = new Buffer(cnt),
        token = getToken(),
        extra = new qiniu.io.PutExtra();

    qiniu.io.put(token, key, body, extra, function(err, ret) {
        if(err){
            callback(err);
            return;
        }

        var url = path + '/' + ret.key;
        callback(null, url);
    });
};

module.exports = {
    save: save
};