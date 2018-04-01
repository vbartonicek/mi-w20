const http = require('http');
const port = 8081;

// DB Simulation
var storage = {
    customers: [
        {id: "1", customer: "customer_1"},
        {id: "2", customer: "customer_2"}
    ],

    confirmation: [],


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

    addConfirmation: function (id) {
        return this.confirmation.push(id);
    },

    deleteConfirmation: function (id) {
        for (var i = 0; i < this.confirmation.length; i++)
            if (this.confirmation[i] === id) {
                this.confirmation.splice(i, 1);
                return true;
            }
        return false;
    }
};

function response(res, code, message) {
    res.writeHead(code, {'Content-Type': 'text/plain'});
    res.end(code + ": " + message);
}

http.createServer(function (req, res) {
    if ((id = req.url.match("^/customers/([a-z0-9]+)$"))) {
        // Return single customer
        if (req.method === "GET") {
            res.writeHead(200, {'Content-Type': 'application/json'});

            if (storage.getCustomer(id[1])) {
                res.end(JSON.stringify({customer: storage.getCustomer(id[1])}));
            }
            else response(res, 404, 'Customer not found');

        }
        // Delete single customer
        else if (req.method === "DELETE") {
            if (storage.getCustomer(id[1])) {
                response(res, 202, 'Customer will be deleted.')

                // Delete customer after 10 seconds
                setTimeout(function () {
                    storage.deleteCustomer(id[1]);
                    storage.addConfirmation(id[1]);
                }, 10000);
            }
            else if (storage.deleteConfirmation(id[1])) {
                response(res, 200, 'Customer successfully deleted.')
            }
            else {
                response(res, 404, 'Customer does not exist.')
            }
        }
        else errorResponse(res, 400);
    }
    else if ((id = req.url.match("^/customers/"))) {
        // Return all customers
        if (req.method === "GET") {
            res.writeHead(200, {'Content-Type': 'application/json'});

            res.end(
                JSON.stringify(
                    storage.customers.map(function (customer) {
                        return customer
                    })
                )
            );

        }
        else response(res, 400, 'Bad request');
    }
    else response(res, 400, 'Bad request');

}).listen(port);