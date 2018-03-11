var net = require('net');

// Handle opened order
function orderOpened(state, request, c) {
    switch (request) {
        case 'add':
            c.write('item added\n');
            break;
        case 'process':
            c.write('order processed\n');
            c.end();
            break;
        default:
            c.write('unknown request\n');
    }
}

var server = net.createServer(function (c) {
    console.log('socket opened');
    c.setEncoding('utf8');

    c.on('end', function () {
        console.log('connection/socket closed');
    });

    c.on('data', function (request) {
        var state = 'unopened';
        request = request.trim();

        if (~request.indexOf(":")) {
            state = request.split(':')[0];
            request = request.split(':')[1];
        }

        if (state === 'unopened' && request === 'open') {
            c.write('order opened\n');
        }
        else if (state === 'opened' || state === 'added') {
            orderOpened(state, request, c);
        }
        else c.write('unknown request\n');
    });
});

server.listen(8124, function () {
    console.log('server started');
});