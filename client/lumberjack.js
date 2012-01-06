(function(global) {
    function log(type, message) {
        if (Lumberjack.url) {
            var img = new Image;
            img.src = Lumberjack.url + '/log?' + type + '=' + encodeURIComponent(message) + '&rnd=' + Math.random();
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
    
    global.Lumberjack = {
        url: ''
    };
})(this);