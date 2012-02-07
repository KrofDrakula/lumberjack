(function(global) {
    
    var Lumberjack = {
        url: '',
        tag: '',
        // send next logging request after 1s timeout
        loggingTimeout: 1000
    };
    var fifo = [];
    var loggingTimer;
    
    function check() {
        var url = fifo.shift();
        if (loggingTimer) {            
            clearTimeout(loggingTimer);
        }
        loggingTimer = null;
        url && send(url);
    }
    
    function send(url) {
        if (loggingTimer) {
            fifo.push(url);
        } else {
            var img = new Image;
            img.src = url;
            img.onload = img.onerror = check;
            loggingTimer = setTimeout(function() {
                check();
            }, Lumberjack.loggingTimeout);
        }
    }
    
    function log(type, args) {
        if (Lumberjack.url) {
            var msg = Lumberjack.tag;
            if (msg) msg += ' ';
            msg += Array.prototype.join.call(args, ' ');
            send(Lumberjack.url + '/log?' + type + '=' + encodeURIComponent(msg) + '&rnd=' + Math.random());
        }
    }
    
    var types = ['log', 'debug', 'warn', 'error'];
    for(var i in types) {
        (function(type, orgFn) {
            orgFn = console[type];
            console[type] = function() {
                orgFn && orgFn.apply(console, arguments);
                log(type, arguments);
            };
        })(types[i]);
    }
    
    console.wtf = function(msg) {
        log('wtf', msg);
    };
    
    global.Lumberjack = Lumberjack;
})(this);