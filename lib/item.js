/*
 *  item - model

    {
        title : 'string',
        link : 'string',
        description : 'string',
        author : 'string',
        content : 'address',
        pubDate : 'time',
        channel : 'channel-id'
    }
 */

var util = require('./util'),
    storage = require('./storage');

var slugify = require('transliteration').slugify;

var Item = require('./model').item;

Item.transform = function(obj){
    var descriptionMaxLength = 100;

    var content = obj.content || obj['content:encoded'] || '';
    content = content && content.hasOwnProperty('#') ? content['#'] : content;

    return {
        title: obj.title,
        link: obj.link,
        key: obj.channel.key + '/' + slugify(obj.title),
        description: util.getText(obj.description).slice(0, descriptionMaxLength),
        author: obj.author,
        content: content,
        pubDate: obj.pubDate || obj.pubdate,
        channel: obj.channel._id
    };
};

// save content to remote
Item.saveContent = function(obj, callback){
    var key = 'item/' + obj.key + '.html';

    storage.save(obj.content, key, function(err, url){
        if(err){
            callback(err);
            return;
        }

        obj.content = url;
        callback(null, obj);
    });
};

Item.save = function(obj, callback){
    obj = Item.transform(obj);

    Item.get({
        link: obj.link
    }, function(err, exists){
        if(err){
            callback(err);
            return;
        }

        if(exists){
            var filter = { _id: exists._id };

            // use original content instead of resave if item exists
            obj.content = exists.content;

            Item.update(filter, obj, function(err){
                if(err){
                    callback(err);
                    return;
                }

                Item.get(filter, callback);
            });
        }else{
            Item.saveContent(obj, function(err, obj){
                if(err){
                    callback(err);
                    return;
                }

                Item.create(obj, callback);
            });
        }
    });

};

module.exports = Item;
