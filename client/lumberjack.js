(function(global) {
    var fifo = [];
    var logging = false;
    
    function check() {
        var url = fifo.shift();
        logging = false;
        url && send(url);
    }
    
    function send(url) {
        var img = new Image;
        img.src = url;
        img.onload = img.onerror = check;
        logging = true;
    }
    
    function log(type, message) {
        if (Lumberjack.url) {
            var url = Lumberjack.url + '/log?' + type + '=' + encodeURIComponent(message) + '&rnd=' + Math.random();
            if (logging) {
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