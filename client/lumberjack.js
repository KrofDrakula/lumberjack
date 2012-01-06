(function(global) {
    
    // send next logging request after 1s timeout
    var loggingTimeout = 1000;
    
    var fifo = [];
    var loggingTimer;
    
    function check() {
        var url = fifo.shift();
        if (loggingTimer) {            
            clearTimeout(loggingTimer);
            loggingTimer = null;
        }
        url && send(url);
    }
    
    function send(url) {
        var img = new Image;
        img.src = url;
        img.onload = img.onerror = check;
        loggingTimer = setTimeout(function() {
            loggingTimer = null;
            check();
        }, loggingTimeout);
    }
    
    function log(type, message) {
        if (Lumberjack.url) {
            var url = Lumberjack.url + '/log?' + type + '=' + encodeURIComponent(message) + '&rnd=' + Math.random();
            if (loggingTimer) {
                fifo.push(url);
            } else {
                send(url);
            }
        }
    }
    
    var types = ['log', 'debug', 'warn', 'error'];
    for(var i in types) {
        (function() {
            var type = types[i],
                old = console[type];
            console[type] = function(msg) {
                old && old.call(console, msg);
                log(type, msg);
            };
        })();
    }
    
    global.Lumberjack = {
        url: ''
    };
})(this);