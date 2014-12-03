var logger = require('log4js').getLogger();

var task = require('./lib/task');

task.on('fetch-channel', function(channel){
    logger.info('channel fetched', channel.title);
});

task.on('save-channel', function(channel){
    logger.info('channel saved', channel.title);
});

task.on('save-item', function(item){
    logger.info('item saved', item.title);
});

task.on('error', function(err){
    logger.error('error', err);
});

task.run();