# Assigment 05 - RESTfull - Conditional GET
Design and implement simple service - get list of customers

Example:

GET /customers

    [
        {
            "id": 1,
            "name": "aaa",
            "orders": []
        },
        {
            "id": 2,
            "name": "bbb",
            "orders": []
        }
    ]

Implement HTTP caching using Last-Modified and ETag. Implement two version of ETag: strong and weak ETag. For weak ETag use only the id and the name from each costumer. Do not forget to show examples of communication including all HTTP Headers