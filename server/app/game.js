var users = {};
var usersInGame = {};
var counter = 1337;
var names = ['Vitali', 'Wladimir', 'Mascha', 'Ivan', 'Anja', 'Tanja'];

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
            users[socket.user.username] = socket;
        });

		// Nutzer beim Spiel anmelden
        socket.on('game.join', function (username, cb) {

            console.log(username);
            console.log(users);
            socket.emit('user.joined', {
                'user': socket.user
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
            socket.emit('game.move.received', data);
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