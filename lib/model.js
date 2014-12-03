var X = require('x-client');

var config = require('./config/X.json'),
    address = config.domain + (config.port ? (':' + config.port) : ''),
    token = config.token;

X.connect(address).config({ token: token });

module.exports = {
    channel: X.model('channel'),
    item: X.model('item')
};