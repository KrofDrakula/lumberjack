# Lumberjack

A simple HTTP remote logging utility for the mobile web.

## Usage

Run `./server.js` to run the logging server. It defaults to port 8080,
but to use on some mobile phones, the port should match whichever port
you're using for the main web server.

To change ports, use: `./server.js --port <port number>`.

On the client side, include the `lumberjack.js` file and configure the
Lumberjack server url:

```js
Lumberjack.url = 'http://localhost:8080'
```

From this point on, the server will be pinged according to the console
method called, eg:

```js
console.warn('Something went wrong');
```

... will generate a call to the following URL:

```
http://localhost:8080/log?warn=Something%20went%20wrong&rnd=<random number>
```

The server's console will output the warning with a yellow message.