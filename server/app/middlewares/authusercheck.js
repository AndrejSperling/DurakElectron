var request     = require('request'),
    config      = require('../config.js'),
    UserModel   = require('../models/users');

module.exports = function (req, res, next) {

    var tokenInfoUrl = 'https://' + config.auth.domain + '/tokeninfo';

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

        process.nextTick(function () {

            var id_token = req.headers.authorization.split(' ')[1];
            var userId = req.user.sub;

            UserModel.findById(userId, function(err, user) {

                if (err)
                    return next(err);

                if (!user) {
                    request({
                        url: tokenInfoUrl,
                        method: 'POST',
                        json: {id_token: id_token}
                    }, function (err, res, body) {

                        if (err) {
                            return next(err);

                        } else {

                            var picture = body.picture;
                            var displayName = body.nickname;
                            var email = body.email;
                            var address = body.address;

                            UserModel.createUser({
                                _id:            userId,
                                email:          (email) ? email : "",
                                displayName:    displayName,
                                picture:        picture,
                                address:        (address) ? address : ""
                            }, function (err) {
                                console.log("Err", err);
                                if(err) return next(err);
                            });

                        }
                    });
                }
            });

        });
    }

    next();

};