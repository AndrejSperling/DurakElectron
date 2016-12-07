var TinyTaskDB  = require("tinytaskdb"),
    mapper      = require('./mapper'),
    ObjectId    = require('mongodb').ObjectID;

exports.findById = function (id, cb) {

    var isValidObjectId = (id.match(/^[0-9a-fA-F]{24}$/));
    if(!isValidObjectId) return cb(new Error("Invalid ObjectId", 400), null);

    TinyTaskDB.Task.findOne({'_id': id}, function (err, task) {
        if (!err && task) {
            cb(err, mapper.convertTaskToJsonResponse(task))
        } else {
            cb(err, null);
        }
    });
};

exports.findAll = function (cb) {
    TinyTaskDB.Task.find({}, function (err, tasks) {
        var taskMap = {};

        tasks.forEach(function (task) {
            taskMap[task._id] = mapper.convertTaskToJsonResponse(task);
        });

        cb(err, taskMap)
    });
};

exports.filterBy = function (filter, cb) {

    // TODO filter

    TinyTaskDB.Task.find({}, function (err, tasks) {
        var taskMap = {};

        tasks.forEach(function (task) {
            taskMap[task._id] = mapper.convertTaskToJsonResponse(task);
        });

        cb(err, taskMap)
    });
};


exports.saveFromJson = function (userid, json, cb) {

        var newTask = new TinyTaskDB.Task({
            _id: ObjectId(),
            createdBy: userid,
            assignedTo: null,
            name: json.name,
            description: json.description,
            payment: json.payment,
            position: {
                latitude: json.position.latitude,
                longitude: json.position.longitude
            },
            starts: json.starts,
            category: json.category
        });

        newTask.save(function (err, task) {
            if (err) return cb(err, null);
            return cb(err, task._id);
        });

};

exports.deleteById = function (userid, taskid, cb) {
    this.findById(taskid, function(err, task){

        if(err)
            return cb(err, null);

        if(task.createdBy === userid) {
            TinyTaskDB.Task.findByIdAndRemove(taskid, cb);
        }else{
            return cb(new Error("You are not the owner!", 400), null)
        }

    });
};

exports.updateFromJson = function (taskid, json, cb) {

    TinyTaskDB.Task.findOneAndUpdate(
        {'_id': taskid},
        {$set: json},
        function (err, task) {
            if (err) return cb(err, null);
            return cb(err, task);
        });
};


exports.findPosition = function (id, cb) {

    TinyTaskDB.Task.findOne({'_id': id}, function (err, task) {
        if (err) {
            cb(err, null);
        } else {
            cb(err, {
                'lat': task.position.latitude,
                'lng': task.position.longitude
            });
        }
    });

};

exports.findApplications = function (id, cb) {

    TinyTaskDB.Application.find({'task':id}, function (err, application) {

        if (err) {
            cb(err, null);
        } else {

            var applicationMap = {};

            applicationMap["results"] = application.length;
            applicationMap["applications"] = [];
            application.forEach(function (application) {
                applicationMap["applications"].push(mapper.convertApplicationToJsonResponse(application))
            });

            cb(err, applicationMap);
        }
    });

};

exports.saveRatingFromJson = function(json, cb){

    TinyTaskDB.Task.findById(json.task, function (err, task) {

        if(err) return cb(err, null);

        TinyTaskDB.User.findById(json.assignedTo, function(err, user){

            if(err) return cb(err, null);

            var rating = new TinyTaskDB.Rating({
                assignedTo:     json.assignedTo,
                task:           json.taskid,
                isExecutor:     (json.assignedTo === user),
                value:          json.value,
                comment:        json.comment
            });

            rating.save(function (err, rating) {
                if(err) return cb(err, null);
                return cb(err, rating)
            });

        });

    });

};