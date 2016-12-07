const routes = require('express').Router();

/**
 * @apiDefine AuthToken Nur mit gültigem JWT Token
 * Bitte übergeben Sie den Authorization Header mit einem gültigen JWT Token
 */

/**
 * @apiDefine ValidLogin
 * @apiHeader (Authorization) {String} Authorization Bearer JWT Token
 */

routes.use('/users', require('./users'));
routes.use('/tasks', require('./tasks'));

/**
 * @api             {get} / Verbindung prüfen
 * @apiName         CheckConnection
 * @apiGroup        Connection Check
 *
 * @apiPermission   AuthToken
 * @apiUse          ValidLogin
 *
 */

routes.get('/', function (req, res) {
    res.status(200).json({message: 'Connected!'});
});

module.exports = routes;