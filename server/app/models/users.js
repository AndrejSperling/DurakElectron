var TinyTaskDB  = require("tinytaskdb");
var mapper      = require("./mapper");

exports.findById = function (id, cb) {
    TinyTaskDB.User.findOne({'_id': id}, function (err, user) {
        if (!err && user) {
            cb(err, mapper.convertUserToJsonResponse(user))
        } else {
            cb(err, null);
        }
    });
};

exports.findAll = function (cb) {
    TinyTaskDB.User.find({}, function (err, users) {
        var userMap = {};

        users.forEach(function (user) {
            userMap[user._id] = mapper.convertUserToJsonResponse(user);
        });

        cb(err, userMap);
    });
};

exports.createUser = function(json, cb){

    var newUser = new TinyTaskDB.User({
        _id:            json._id,
        email:          json.email,
        displayName:    json.displayName,
        picture:        json.picture,
        address:        json.address
    });

    newUser.save(function (err) {
        cb(err)
    });

};

exports.deleteById = function (id, cb) {
    TinyTaskDB.User.findByIdAndRemove(id, cb);
};

exports.saveRatingFromJson = function (id, json, cb) {

    TinyTaskDB.Task.findById(json.taskid, function (err, task) {

        if(err) return cb(err, null);

        TinyTaskDB.User.findByIdAndUpdate(
            id, {
                $push: {
                    "ratings": {
                        task: json.taskid,
                        isExecutor: (task.assignedTo === id),
                        value: json.value,
                        comment: json.comment
                    }
                }
            },
            {
                safe: true, upsert: true, new: true
            },
            function (err, model) {
                if(err) return cb(err, null);
                return cb(err, model.ratings)
            }
        );
    });

};

exports.loadRatings = function (id, cb) {

    TinyTaskDB.Rating.find({'assignedTo': id}, function(err, ratings){

        if(err){
            cb(err, null)
        }else {

            var ratingMap = {};

            ratingMap["results"] = ratings.length;
            ratingMap["ratings"] = [];
            ratings.forEach(function (rating) {
                ratingMap["ratings"].push(mapper.convertRatingToJsonResponse(rating))
            });

            cb(err, ratingMap);

        }

    });

};