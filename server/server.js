#!/usr/bin/env node
var argv   = require('optimist')
                 .usage('Usage: $0 [-p 8080]')
                 .default({ p: 8080 })
                 .alias('p', 'port')
                 .describe('p', 'The server port that listens for logs')
                 .argv,
    http   = require('http'),
    fs     = require('fs'),
    colors = require('colors');

console.log('Running logging server on port ' + argv.p);

http.createServer(function(req, res) {
    if (/^\/log/.test(req.url)) {
        var matches = req.url.match(/[?&](log|error|warn|debug|wtf)=([^&]*)/);
        var type = matches[1];
        var msg = decodeURIComponent(matches[2]);
        
        switch(type) {
            case 'log':
                msg = msg.grey;
                break;
            case 'error':
                msg = msg.red;
                break;
            case 'warn':
                msg = msg.yellow;
                break;
            case 'wtf':
                msg = msg.rainbow;
                break;
            case 'debug':
            default:
                msg = msg.white;
        }
        console.log(msg);
    }
    res.writeHead(200, {'Content-type': 'image/png'});
    var f = fs.ReadStream('blank.png');
    f.pipe(res);
}).listen(argv.p);
