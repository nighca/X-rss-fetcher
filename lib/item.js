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
    var link = obj.permalink || obj.link;

    var content = obj.content || obj['content:encoded'] ||  obj['atom:content'];
    content = content && content.hasOwnProperty('#') ? content['#'] : content;
    content = content || obj.summary || obj.description;

    var description = util.getText(obj.description || content)
        .replace(/\r?\n/g, '');

    var descriptionMaxLength = 200;
    if(description.length > descriptionMaxLength){
        description = description.slice(0, descriptionMaxLength) + '…';
    }

    var pubDate = util.parseDate(obj.pubDate || obj.pubdate);

    return {
        title: obj.title,
        guid: obj.guid || link,
        link: link,
        key: obj.channel.key + '/' + slugify(obj.title),
        description: description,
        author: obj.author,
        content: content,
        pubDate: pubDate,
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
        guid: obj.guid
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
