(function(global) {
    function log(type, message) {
        if (Lumberjack.url) {
            var img = new Image;
            img.src = Lumberjack.url + '/log?' + type + '=' + encodeURIComponent(message) + '&rnd=' + Math.random();
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
    
    console.wtf = function(msg) {
        log('wtf', msg);
    };
    
    global.Lumberjack = {
        url: ''
    };
})(this);