/*
 *  channel - model

    {
        title : 'string',
        link : 'string',
        xmlUrl : 'string',
        description : 'text',
        language : 'string',
        copyright : 'string',
        pubDate : 'time',
        category : 'string',
        generator : 'string'
    }
 */

var slugify = require('transliteration').slugify;

var util = require('./util');

var Channel = require('./model').channel;

Channel.transform = function(obj){
    var pubDate = util.parseDate(obj.pubDate || obj.pubdate);

    return {
        _id: obj._id,
        title: obj.title,
        link: obj.link,
        key: slugify(obj.title),
        xmlUrl: obj.xmlUrl || obj.xmlurl || obj._xmlUrl,
        description: obj.description,
        language: obj.language,
        copyright: obj.copyright,
        pubDate: pubDate,
        category: obj.category,
        generator: obj.generator
    };
};

Channel.save = function(obj, callback){
    obj = Channel.transform(obj);

    var updateAndGet = function(filter, obj, callback){
        Channel.update(filter, obj, function(err){
            if(err){
                callback(err);
                return;
            }

            Channel.get(filter, callback);
        });
    };

    // in db
    if(obj._id){
        updateAndGet({ _id: obj._id }, obj, callback);

        return;
    }

    // not in db, find similar
    Channel.get({
        xmlUrl: obj.xmlUrl
    }, function(err, similar){
        if(err){
            callback(err);
            return;
        }

        if(similar){
            updateAndGet({ _id: similar._id }, obj, callback);
        }else{
            Channel.create(obj, callback);
        }
    });

};

module.exports = Channel;
