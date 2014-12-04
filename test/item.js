var fetch = require('../lib/fetch');
var Item = require('../lib/item');
var Channel = require('../lib/channel');

var url = process.argv[2] || 'http://www.zhihu.com/rss';

fetch(url, function(err, feed){

    var channel = Channel.transform(feed);
    channel._id = 'channel-id';

    (feed.items || []).forEach(function(item){
        item.channel = channel;
        item = Item.transform(item);
        console.log(item.title);
    });
});