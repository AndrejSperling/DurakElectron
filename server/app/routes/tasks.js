const tasks         = require('express').Router();
var config          = require("../config.js"),
    TaskModel       = require('../models/tasks'),
    validate        = require('express-jsonschema').validate,
    validScheme     = require('../helper/validjsonscheme');

var taskId = null;

// Middleware
tasks.param('id', function (req, res, next, id) {

    taskId = req.params.id;

    TaskModel.findById(taskId, function (err, task) {
        if (err) {
            next(err);
        } else if (task) {
            res.locals.task = task;
            next();
        } else {
            next(new Error('failed to load task'));
        }
    });

});


/**
 * @api             {get} /tasks Alle Tasks anzeigen
 * @apiName         GetAllTasks
 * @apiGroup        Tasks
 *
 * @apiPermission   AuthToken
 * @apiUse          ValidLogin
 *
 * @apiSuccessExample {json} Response 200
 Content-Type: application/json
{
    "5838435a54b5204ad2c1f41c": {
        "_id": "5838435a54b5204ad2c1f41c",
        "createdBy": "/users/58372443d79cda357ee7c61e",
        "assignedTo": "/users/58372443541e2f78b1fc7e45",
        "name": "do non duis dolore non",
        "description": "Occaecat sint esse mollit nisi magna enim sunt nisi in officia laboris laborum.",
        "payment": 3,
        "applications": "/tasks/5838435a54b5204ad2c1f41c/applications",
        "starts": "2000-06-29T23:05:13.000Z",
        "position": "/tasks/5838435a54b5204ad2c1f41c/position",
        "category": "deserunt"
    },
    "5838435a2d139ff7d5eed505": {
        "_id": "5838435a2d139ff7d5eed505",
        "createdBy": "/users/5837244354c1b3e438366c70",
        "assignedTo": "/users/58372443be5b5576960311cf",
        "name": "exercitation ex ex ipsum ipsum",
        "description": "Deserunt ex et magna nisi ut aute mollit.",
        "payment": 4,
        "applications": "/tasks/5838435a2d139ff7d5eed505/applications",
        "starts": "1971-12-06T18:30:46.000Z",
        "position": "/tasks/5838435a2d139ff7d5eed505/position",
        "category": "pariatur"
    }
}
 */

tasks.get('/', function (req, res, next) {

    // Filter
    var radius = req.query.radius || config.tasks.defaultRadius;
    if (radius > config.tasks.maxRadius) {
        radius = config.tasks.maxRadius;
    }

    var startzeit = req.query.startzeit || null;

    TaskModel.filterBy({
        radius: radius,
        starttime: startzeit
    }, function (err, tasks) {
        if (err) {
            next(err);
        } else {
            res.send(tasks);
        }
    });

});

/**
 * @api             {post} /tasks Task einfügen
 * @apiName         PostTask
 * @apiGroup        Tasks
 *
 * @apiPermission   AuthToken
 * @apiUse          ValidLogin
 *
 *
 * @apiUse          RequestPostTaskJson
 * @apiUse          ResponsePostTask
 *
 */

tasks.post('/', validate({body: validScheme.postTask}), function (req, res, next) {

    var userId = req.user.sub;

    TaskModel.saveFromJson(userId, req.body, function (err, id) {

        if (err) {
            next(err)
        } else {

            /**
             * @apiDefine ResponsePostTask
             *
             * @apiSuccessExample {json} Response 200
               Content-Type: application/json
               {
                 "taskid": "5839c75f4414d010d4cdd650"
               }
             */

            res.send({taskid: id})
        }

    });

});

/**
 * @api             {get} /tasks/:id Task anzeigen
 * @apiName         GetTask
 * @apiGroup        Tasks
 *
 * @apiPermission   AuthToken
 * @apiUse          ValidLogin
 *
 * @apiParam        {ObjectId} id Tasks unique ID.
 *
 * @apiSuccessExample {json} Response 200
 Content-Type: application/json
 {
   "id": "58372443be5b5576960311cf",
   "displayName": "Sherrie Cameron",
   "email": "cheriadams@strezzo.com",
   "picture": "",
   "address": "Rutherford Place, Jacumba",
   "ratings": "/users/58372443be5b5576960311cf/ratings"
 }
  */

tasks.get('/:id', function (req, res) {
    res.send(res.locals.task);
});

/**
 * @api             {put} /tasks/:id Task bearbeiten
 * @apiName         PutTask
 * @apiGroup        Tasks
 *
 * @apiPermission   AuthToken
 * @apiUse          ValidLogin
 *
 * @apiParam        {ObjectId} id Tasks unique ID.
 *
 * @apiUse          RequestPutTaskJson
 * @apiUse          ResponsePutTask
 */

tasks.put('/:id', validate({body: validScheme.putTask}), function (req, res, next) {

    TaskModel.updateFromJson(taskId, req.body, function (err, task) {
        if (err) {
            next(err);
        } else {

            /**
             * @apiDefine ResponsePutTask
             *
             * @apiSuccessExample {json} Response 200
             Content-Type: application/json
             {
               "status": "ok"
             }
             */

            res.json({
                "status": "ok"
            });
        }
    });

});

/**
 * @api             {delete} /tasks/:id Task löschen
 * @apiName         DeleteTask
 * @apiGroup        Tasks
 *
 * @apiPermission   AuthToken
 * @apiUse          ValidLogin
 *
 * @apiParam        {ObjectId} id Tasks unique ID.
 *
 * @apiUse          ResponseTaskDelete
 */

tasks.delete('/:id', function (req, res, next) {

    var userId = req.user.sub;

    TaskModel.deleteById(userId, taskId, function (err) {
        if (err) {
            next(err)
        } else {

            /**
             * @apiDefine ResponseTaskDelete
             * @apiSuccessExample {json} Response 200
             Content-Type: application/json
             {
               "status": "ok"
             }
             */

            res.json({
                "status": "ok"
            })
        }
    })
});


/**
 * @api             {get} /tasks/:id/position Task position anzeigen
 * @apiName         GetTaskPosition
 * @apiGroup        Tasks
 *
 * @apiPermission   AuthToken
 * @apiUse          ValidLogin
 *
 * @apiParam        {ObjectId} id Tasks unique ID.
 * @apiSuccessExample {json} Response 200
 Content-Type: application/json
 {
   "lat": 56.4848,
   "lng": 75.6019
 }
 */

tasks.get('/:id/position', function (req, res, next) {
    TaskModel.findPosition(taskId, function (err, position) {
        if (err) {
            next(err);
        } else {
            res.send(position);
        }
    });
});

/**
 * @api             {get} /tasks/:id/applications Task-Bewerber anzeigen
 * @apiName         TaskApplications
 * @apiGroup        Tasks
 *
 * @apiPermission   AuthToken
 * @apiUse          ValidLogin
 *
 * @apiParam        {ObjectId} id Tasks unique ID.
 *
 * @apiUse          ResponseApplications
 */
tasks.get('/:id/applications', function (req, res, next) {
    TaskModel.findApplications(taskId, function (err, applications) {
        if (err) {
            next(err);
        } else {

            /**
             * @apiDefine ResponseApplications
             * @apiSuccessExample {json} Response 200
             Content-Type: application/json
             {
               "results": 1,
               "applications": [
                 {
                   "user": "/users/582c5174215d27113c3c709f",
                   "comment": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam"
                 }
               ]
             }
             *
             */

            res.send(applications);
        }
    });
});

/**
 * @api             {post} /tasks/:id/rate Task Mitwirkende bewerten
 * @apiName         RateTask
 * @apiGroup        Tasks
 *
 * @apiDescription  Hier können die Mitwirkenden bewertet werden. Sollten Sie der Ersteller des Task sein,
 * werden Sie den Auftragnehmer bewerten und als Auftragnehmer bewerten Sie den Auftraggeber.
 *
 * @apiParam        {ObjectId} id Tasks unique ID.
 *
 * @apiParam        (Request) {Boolean}   value       Bewertung true=positive, false=negativ.
 * @apiParam        (Request) {String}    comment     Kommentar zusätzlich zur Bewertung.
 *
 * @apiPermission   AuthToken
 * @apiUse          ValidLogin
 *
 * @apiUse          RequestPostTaskRatingJson
 * @apiUse          ResponseSuccessTaskRate
 */
tasks.post('/:id/rate', validate({body: validScheme.postRating}), function (req, res, next) {

    TaskModel.saveRatingFromJson(req.body, function (err, rating) {
        if (err) {
            next(err);
        } else {

            /**
             * @apiDefine ResponseSuccessTaskRate
             *
             * @apiSuccessExample {json} Response 200
             * Content-Type: application/json
             * {
             *      "status": "ok"
             * }
             */

            res.json({
                ratingid: rating._id
            });
        }
    });

});


module.exports = tasks;