var users = {};
var usersInGame = {};
var counter = 1337;
var names = ['Vitali', 'Wladimir', 'Mascha', 'Ivan', 'Anja', 'Tanja'];

function random(low, high) {
    return (Math.random() * (high - low) + low).toFixed(0);
}

function generateUserName() {

    var rand = random(0, names.length - 1);
    var name = names[rand] + counter
    console.log("Name: " + name);
    counter++;

    return name;
}

module.exports = function (io) {

    io.on('connection', function (socket) {

        socket.on('user.new', function (cb) {
            var username = generateUserName();
            cb({
                'username': username
            });
            socket.user = {'username': username};
            users[username] = socket;
            console.log("UserNew: " + username);
        });

        socket.on('user.login', function (username, cb) {
            socket.user = {'username': username};
            users[username] = socket;
            console.log("UserLogin: " + username);
        });

        socket.on('game.join', function (username, cb) {

            socket.emit('user.joined', {
                'user': socket.user
            });

        });

        socket.on('game.leave', function (user, cb) {
            socket.broadcast.emit('user.left', {
                user: users[username].user
            });
        });

        socket.on('game.move.make', function (data, cb) {

            socket.broadcast.emit('game.move.received', data);

        });

        socket.on('disconnect', function (data) {
            if (!socket.user) return;

            socket.emit('user.left', {
                user: socket.user
            });

            delete users[socket.user.username];
        });

    });

};