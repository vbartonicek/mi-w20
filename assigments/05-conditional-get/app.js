const http = require('http');
const crypto = require('crypto');
const port = 8081;
const etagType = 'weak';  // Weak ETag
// const etagType = 'strong';  // Strong ETag

// DB Simulation
var storage = {
    customers: [
        {id: "1", name: "customer_1", orders: [2356]},
        {id: "2", name: "customer_2", orders: [5, 342]}
    ],

    weakEtag: null,
    strongEtag: null,
    lastModified: null,

    getCustomer: function (id) {
        for (var i = 0; i < this.customers.length; i++) {
            if (this.customers[i].id == id) {
                return this.customers[i];
            }
        }
        return null;
    },

    deleteCustomer: function (id) {
        for (var i = 0; i < this.customers.length; i++)
            if (this.customers[i].id === id) {
                this.customers.splice(i, 1);
                return true;
            }
        return false;
    },

    getWeakEtag: function () {
        var content = "";
        for (var i = 0; i < this.customers.length; i++)
            content += this.customers[i].id + this.customers[i].name;

        this.weakEtag = "W/\"" + crypto.createHash('md5').update(content).digest('hex') + "\"";
        return this.weakEtag;
    },

    getStrongEtag: function () {
        this.strongEtag = "\"" + crypto.createHash('md5').update(JSON.stringify(this.customers)).digest('hex') + "\"";
        return this.strongEtag;
    },

    getLastModified: function () {
        if (!this.lastModified) {
            this.lastModified = new Date();
        }
        return this.lastModified.toString();
    }
};

function response(res, code, message) {
    res.writeHead(code, {'Content-Type': 'text/plain'});
    res.end(code + ": " + message);
};

http.createServer(function (req, res) {
    if ((id = req.url.match("^/customers/([a-z0-9]+)$"))) {
        // Delete single customer
        if (req.method === "DELETE") {
            if (storage.deleteCustomer(id[1])) {
                response(res, 204, 'Customer was deleted.')
            }
            else {
                response(res, 404, 'Customer does not exist.')
            }
        }
        else response(res, 400, 'Bad request');
    }
    else if ((id = req.url.match("^/customers/"))) {
        // Return all customers
        if (req.method === "GET") {
            res.writeHead(200, {'Content-Type': 'application/json'});

            if (etagType === 'weak') var etag = storage.getWeakEtag(); // Weak ETag
            else var etag = storage.getStrongEtag(); // Strong ETag

            if (etag === req.headers['if-none-match']) {
                res.writeHead(304, {
                    'Cache-Control': 'private, no-store, max-age=120',
                    'ETag': etag,
                    'Last-Modified': storage.getLastModified()
                });
                res.end()
            } else {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'private, no-store, max-age=120',
                    'ETag': etag,
                    'Last-Modified': storage.getLastModified()
                });
                res.end(
                    JSON.stringify(
                        storage.customers.map(function (customer) {
                            return customer
                        })
                    )
                );
            }
        }
        else response(res, 400, 'Bad request');
    }
    else response(res, 400, 'Bad request');

}).listen(port);