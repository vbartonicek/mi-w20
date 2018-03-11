var net = require('net');

var state = 'unopened';
var order = new Array();

// Send a list of ordered items
function printOrder(c) {
    if (order.length > 0) c.write('Your order:\n');
    for (var i = 0; i < order.length; i++)
        c.write(' - ' + order[i] + '\n');
}

// Reset state to default
function resetState() {
    state = 'unopened';
    order = [];
}

// Handle opened order
function orderOpened(request, c) {
    switch (request) {
        case 'add':
            order.push('item' + (order.length + 1));
            state = 'added';
            c.write('item added\n');
            break;
        case 'process':
            state = 'processed';
            printOrder(c);
            c.write('order processed\n');
            c.end();
            resetState();
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
        request = request.trim();

        if (state === 'unopened' && request === 'open') {
            state = 'opened';
            c.write('order opened\n');
        }
        else if (state === 'opened' || state === 'added') {
            orderOpened(request, c);
        }
        else c.write('unknown request\n');
    });
});

server.listen(8124, function () {
    console.log('server started');
});