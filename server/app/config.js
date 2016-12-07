module.exports = {
    'mongodb': 'mongodb://192.168.11.130/tinytask',
    'auth': {
        'domain': process.env.AUTH_DOMAIN || 'tinytask.eu.auth0.com',
        'clientID': process.env.AUTH_CLIENT_ID || 'Bp4PPmbo5IXZumI4wrZ2Asi7mJgG9Dk3',
        'clientSecret': process.env.AUTH_CLIENT_SECRET || 'hVGlnq1D4g8-y7UmCkPaWN33FwE11TOmq2_-3J_4FJF6Qk9n1NMwQ_Z2LPEM4-KR'
    },
    'tasks': {
        'defaultRadius': 10,
        'maxRadius': 20
    }
};