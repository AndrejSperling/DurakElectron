var apiTasks = "/tasks/",
    apiUsers = "/users/";

exports.convertUserToJsonResponse = function (user) {
    return {
        id:          user._id,
        displayName: user.displayName,
        email:       user.email,
        picture:     user.picture,
        address:     user.address,
        ratings:     apiUsers + user._id + "/ratings"
    }
};

exports.convertRatingToJsonResponse = function (rating) {
    return {
        assignedTo: apiUsers + rating.assignedTo,
        task:       apiTasks + rating.task,
        isExecutor: rating.isExecutor,
        value:      rating.value,
        comment:    rating.comment
    }
};

exports.convertTaskToJsonResponse = function(task){
    return {
        _id:            task._id,
        createdBy:      apiUsers + task.createdBy,
        assignedTo:     apiUsers + task.assignedTo,
        name:           task.name,
        description:    task.description,
        payment:        task.payment,
        applications:   apiTasks + task._id + "/applications",
        starts:         task.starts,
        position:       apiTasks + task._id + "/position",
        category:       task.category
    }
};

exports.convertApplicationToJsonResponse = function(application){
    return {
        user:       apiUsers + application.user,
        comment:    application.comment
    };
};