const http = require('http');
const port = 8081;

// DB Simulation
var storage = {
  orders : [
    {id: 1, items: [1,2,3], price: 256},
    {id: 2, items: [4,5], price: 42},
    {id: 3, items: [6], price: 35},
    {id: 4, items: [7,8], price: 153},
    {id: 5, items: [9], price: 99},
    {id: 6, items: [11,12,13], price: 1256},
    {id: 7, items: [14,15], price: 142},
    {id: 8, items: [16], price: 135},
    {id: 9, items: [27,8], price: 553},
    {id: 10, items: [19], price: 492},
    {id: 11, items: [10,2,32], price: 25600},
    {id: 12, items: [4,5,1], price: 423},
    {id: 13, items: [6], price: 35},
    {id: 14, items: [7,8], price: 153},
    {id: 15, items: [9], price: 99},
  ],

  getOrder: function (id) {
    for (var i = 0; i < this.orders.length; i++) {
      if (this.orders[i].id == id) {
        return this.orders[i];
      }
    }
    return null;
  },

  getOrders : function(page, size) {
    data = [];
    var index = page * size - size;

    for (var i = 0; i < size; i++) {
      if ((index + i) < this.orders.length) {
        data.push(this.orders[index + i])
      }
      else break;
    }

    return data;
  },

  getAllOrders: function () {
    return this.orders;
  },
}

function response(res, code, message) {
  res.writeHead(code, {'Content-Type': 'text/plain'});
  res.end(code + ": " + message);
};

http.createServer(function (req, res) {
  if ((id = req.url.match("^\/orders\/*(?:\\?page=([0-9]+)&limit=([0-9]+))*$"))){
    // Return specific page of orders
    var page = parseInt(id[1]);
    var limit = parseInt(id[2]);

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(
      JSON.stringify(storage.getOrders(page,limit))
    );
  }
  else if ((id = req.url.match("^/orders"))) {
    // Return all orders
    if (req.method === "GET") {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(
        JSON.stringify(
          storage.orders.map(function (order) {
            return order
          })
        )
      );
    }
    else response(res, 400, 'Bad request');
  }
  else response(res, 400, 'Bad request');

}).listen(port);
