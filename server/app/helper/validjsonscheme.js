module.exports = {

    /**
     * @apiDefine RequestPostTaskRatingJson
     * @apiSuccessExample {json} Request
     Content-Type: application/json
     {
        "value": true,
        "comment": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam"
     }
     */

    postRating: {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
            "assignedTo": {
                "type": "string"
            },
            "task": {
                "type": "integer"
            },
            "value": {
                "type": "boolean"
            },
            "comment": {
                "type": "string"
            }
        },
            "required": [
            "assignedTo",
            "task",
            "value"
        ]
    },


    /**
     * @apiDefine RequestPostTaskJson
     * @apiSuccessExample {json} Request
     Content-Type: application/json
     {
        "name": "Haribos",
        "description": "Gummibärchen",
        "payment": 5,
        "position": {
            "latitude": 53.1234567543,
            "longitude": 53.1234567543
        },
        "starts": "2016-12-01T15:13:21.000Z"
        "category": "Süßigkeiten"
     }
     */
    postTask: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "description": {
                "type": "string"
            },
            "payment": {
                "type": "integer"
            },
            "position": {
                "type": "object",
                "properties": {
                    "latitude": {
                        "type": "number"
                    },
                    "longitude": {
                        "type": "number"
                    }
                },
                "required": [
                    "latitude",
                    "longitude"
                ]
            },
            "starts": {
                "type": "string"
            },
            "category":{
                "type": "string"
            }
        },
        "required": [
            "name",
            "description",
            "payment",
            "position",
            "starts",
            "category"
        ]
    },


    /**
     * @apiDefine RequestPutTaskJson
     * @apiSuccessExample {json} Request
     Content-Type: application/json
     {
        "name": "Haribos",
        "description": "Gummibärchen",
        "payment": 5,
        "position": {
            "latitude": 53.1234567543,
            "longitude": 53.1234567543
        },
        "starts": "2016-12-01T15:13:21.000Z"
        "category": "Süßigkeiten"
     }
     */
    putTask: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "description": {
                "type": "string"
            },
            "payment": {
                "type": "integer"
            },
            "position": {
                "type": "object",
                "properties": {
                    "latitude": {
                        "type": "number"
                    },
                    "longitude": {
                        "type": "number"
                    }
                },
                "required": [
                    "latitude",
                    "longitude"
                ]
            },
            "starts": {
                "type": "string"
            },
            "category":{
                "type": "string"
            }
        }
    }

};