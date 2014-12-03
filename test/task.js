var task = require('../lib/task');

task.on('fetch-channel', function(channel){
    console.log('channel fetched', channel.title);
});

task.on('save-channel', function(channel){
    console.log('channel saved', channel.title);
});

task.on('save-item', function(item){
    console.log('item saved', item.title);
});

task.on('error', function(err){
    console.error('error', err);
});

task.run();