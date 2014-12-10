var EventEmitter = require('events').EventEmitter;

var fetch = require('./fetch'),
    util = require('./util');

var Channel = require('./channel'),
    Item = require('./item');

var config = require('../config/task.json');

var task = new EventEmitter();

var fetchChannel = function(channel, callback){
    callback = callback || util.emptyFn;

    var xmlUrl = channel.xmlUrl;
    if(!xmlUrl){
        task.emit('error', new Error('Missing xmlUrl to fetch a channel!'));
        return;
    }

    fetch(xmlUrl, function(err, feed){
        if(err){
            callback(err);
            return;
        }

        channel = util.extend(channel, feed);

        channel._xmlUrl = xmlUrl;

        task.emit('fetch-channel', channel);

        var items = feed.items || [];

        Channel.save(channel, function(err, channel){
            if(err){
                callback(err);
                return;
            }

            task.emit('save-channel', channel);

            util.finish(items.map(function(item){
                item.channel = channel;
                return function(cb){
                    Item.save(item, function(err, item){
                        if(!err) task.emit('save-item', item);
                        cb(err, item);
                    });
                };
            }), callback);
        });
    });
};

var fetchChannels = function(channels){
    channels.forEach(function(channel, i){
        fetchChannel(channel, function(err, channel){
            if(err){
                task.emit('error', err);
            }
        });
    });
};

var once = function(){
    Channel.list(function(err, channels){
        if(err){
            task.emit('error', err);
            return;
        }

        fetchChannels(channels);
    });
};

task.run = function(){
    // do periodical fetch
    once();
    setInterval(once, config.interval);

    // listen to channel create & do fetch
    Channel.on('create', fetchChannel);
};

module.exports = task;