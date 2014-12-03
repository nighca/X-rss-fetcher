var Channel = require('../lib/channel');

/*Channel.save({
    title: 'test',
    xmlUrl: 'http://coolshell.cn/feed'
}, function(err, obj) {
    console.log(err, obj);
});*/

Channel.create({
    title: 'test',
    xmlUrl: 'http://coolshell.cn/feed'
}, function(err, obj) {
    console.log(err, obj);
});
