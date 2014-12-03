var logger = require('log4js').getLogger();

var task = require('./lib/task');

task.on('fetch-channel', function(channel){
	logger.log('channel fetched', channel.title);
});

task.on('new-channel', function(channel){
	logger.log('new channel', channel.title);
});

task.on('save-channel', function(channel){
	logger.log('channel saved', channel.title);
});

task.on('save-item', function(item){
	logger.log('item saved', item.title);
});

task.on('error', function(err){
	logger.error('error', err);
});

task.run();