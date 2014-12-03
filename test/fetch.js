var fetch = require('../lib/fetch');

fetch('http://coolshell.cn/feed', function(err, feed){
    console.log(err, feed);
});