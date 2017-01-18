var users = {};
var usersInGame = {};
var counter = 1337;
var names = ['Vitali', 'Wladimir', 'Mascha', 'Ivan', 'Olga', 'Tanja'];

function random(low, high) {
    return (Math.random() * (high - low) + low).toFixed(0);
}

function generateUserName() {

    var rand = random(0, names.length - 1);
    var name = names[rand] + counter;
    console.log("Name: " + name);
    counter++;

    return name;
}

module.exports = function (io) {

    io.on('connection', function (socket) {

		// Registriere neuen Nutzer
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

		// Nutzer beim Spiel anmelden
        socket.on('game.join', function (username, cb) {
            console.log("Game.Join: " + username);
            socket.broadcast.emit('user.joined', {
                'user': {
                    username : username
                }
            });

        });

		// Nutzer verlässt das Spiel
        socket.on('game.leave', function (user, cb) {
            socket.emit('user.left', {
                user: users[username].user
            });
        });

		// Nutzer macht einen Schritt
        socket.on('game.move.make', function (data, cb) {
            console.log("Game.Move.Make");
            io.sockets.emit('game.move.received', data);
        });

		// Meldet Nutzer ab, wenn er das Programm velässt
        socket.on('disconnect', function (data) {
            if (!socket.user) return;

			// Informiert die anderen Teilnehmer, dass ein Nutzer das Spiel verlassen hat
            socket.emit('user.left', {
                user: socket.user
            });

            delete users[socket.user.username];
        });

    });

};