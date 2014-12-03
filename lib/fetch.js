var request = require('request'),
    FeedParser = require('feedparser');

var options = {};

var fetch = function(url, callback){

    var req = request(url),
        feedparser = new FeedParser(options),
        items = [];

    var called = false,
        cb = function(err, result){
            if(!called){
                called = true;
                callback(err, result);
            }
        };

    req.on('error', cb);

    req.on('response', function(res){
        if(res.statusCode != 200){
            this.emit('error', new Error('Bad code: ' + res.statusCode));
            return;
        }

        this.pipe(feedparser);
    });

    feedparser.on('error', cb);

    feedparser.on('readable', function(){
        while(item = this.read()){
            items.push(item);
        }
    });

    feedparser.on('end', function(){
        var feed = this.meta;
        feed.items = items;
        cb(null, feed);
    });
};

module.exports = fetch;