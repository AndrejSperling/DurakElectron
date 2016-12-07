const users = require('express').Router();

var validate = require('express-jsonschema').validate,
    validScheme = require('../helper/validjsonscheme'),
    UserModel = require('../models/users'),
    config = require('../config');

var userId = null;

// Middleware
users.param('id', function (req, res, next, id) {

    userId = req.params.id;

    UserModel.findById(userId, function (err, user) {

        if (err) {
            next(err);
        } else if (user) {
            res.locals.user = user;
            next();
        } else {
            next(new Error('failed to load user'));
        }

    });

});

/**
 * @api             {get} /users Alle Benutzer anzeigen
 * @apiName         GetAllUser
 * @apiGroup        Users
 *
 * @apiPermission   AuthToken
 * @apiUse          ValidLogin
 *
 @apiSuccessExample {json} Response 200
 Content-Type: application/json
 {
     "58372443be5b5576960311cf": {
         "id": "58372443be5b5576960311cf",
         "displayName": "Sherrie Cameron",
         "email": "cheriadams@strezzo.com",
         "picture": "",
         "address": "Rutherford Place, Jacumba",
         "ratings": "/users/58372443be5b5576960311cf/ratings"
     },
         "58372443578226d8dd3191b2": {
         "id": "58372443578226d8dd3191b2",
         "displayName": "Vasquez Heath",
         "email": "sherriecameron@strezzo.com",
         "picture": "",
         "address": "Flatlands Avenue, Summerfield",
         "ratings": "/users/58372443578226d8dd3191b2/ratings"
     }
 }
 */
users.get('/', function (req, res) {
    UserModel.findAll(function (err, users) {
        res.send(users);
    });
});

/**
 * @api             {get} /users/:id Benutzer anzeigen
 * @apiName         GetUser
 * @apiGroup        Users
 *
 * @apiPermission   AuthToken
 * @apiUse          ValidLogin
 *
 * @apiParam        {ObjectId} id Users unique ID.
 *
 * @apiSuccessExample {json} Response 200
 Content-Type: application/json
 {
  "id": "58372443b4049c9af8d1dcd3",
  "displayName": "Susanna Hartman",
  "email": "bettemoreno@strezzo.com",
  "picture": "",
  "address": "Estate Road, Leroy",
  "ratings": "/users/58372443b4049c9af8d1dcd3/ratings"
}
 */

users.get('/:id', function (req, res) {
        res.send(res.locals.user)
    }
);

/**
 * @api             {delete} /users/:id Benutzer löschen
 * @apiName         DeleteUser
 * @apiGroup        Users
 *
 * @apiPermission   AuthToken
 * @apiUse          ValidLogin
 *
 * @apiParam        {ObjectId} id Users unique ID.
 *
 *
 */

users.delete('/:id', function (req, res, next) {

        if (req.user && req.user.sub == userId) {

            UserModel.deleteById(userId, function (err) {
                if (err) {
                    next(err)
                } else {
                    res.json({
                        "status": "ok"
                    })
                }
            })
        } else {
            res.status(401).json({
                "status": "fail",
                "message": "No permission to delete other users"
            });
        }
    }
);

/**
 * @api             {get} /users/:id/ratings Benutzer Bewertungen
 * @apiName         GetUserRatings
 * @apiGroup        Users
 *
 * @apiPermission   AuthToken
 * @apiUse          ValidLogin
 *
 * @apiParam        {ObjectId} id Users unique ID.
 *
 * @apiSuccessExample {json} Response 200
 Content-Type: application/json
{
    "results": 2,
    "ratings": [
    {
      "assignedTo": "/users/58372443541e2f78b1fc7e45",
      "task": "/tasks/5838435a54b5204ad2c1f41c",
      "isExecutor": true,
      "value": true,
      "comment": "Quis dolore aliquip et esse sunt dolore esse eu officia consectetur duis dolore reprehenderit reprehenderit."
    },
    {
      "assignedTo": "/users/58372443541e2f78b1fc7e45",
      "task": "/tasks/5838435a54b5204ad2c1f41c",
      "isExecutor": false,
      "value": true,
      "comment": "Voluptate dolore adipisicing reprehenderit laborum."
    }
    ]
}
 */

users.get('/:id/ratings', function (req, res, next) {

    UserModel.loadRatings(userId, function (err, ratings) {
        if (err) {
            next(err);
        } else {
            res.send(ratings);
        }
    });

});

module.exports = users;