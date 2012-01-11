(function(global) {
    
    var Lumberjack = {
        url: '',
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
    
    function log(type, message) {
        if (Lumberjack.url) {
            send(Lumberjack.url + '/log?' + type + '=' + encodeURIComponent(message) + '&rnd=' + Math.random());
        }
    }
    
    var types = ['log', 'debug', 'warn', 'error'];
    for(var i in types) {
        (function(type, orgFn) {
            orgFn = console[type];
            console[type] = function(msg) {
                orgFn && orgFn.call(console, msg);
                log(type, msg);
            };
        })(types[i]);
    }
    
    console.wtf = function(msg) {
        log('wtf', msg);
    };
    
    global.Lumberjack = Lumberjack;
})(this);