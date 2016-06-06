module.exports = function(app) {
    var users = [{
        _id: "123",
        username: "alice",
        password: "alice",
        firstName: "Alice",
        lastName: "Wonder"
    }, {
        _id: "234",
        username: "bob",
        password: "bob",
        firstName: "Bob",
        lastName: "Marley"
    }, {
        _id: "345",
        username: "charly",
        password: "charly",
        firstName: "Charly",
        lastName: "Garcia"
    }, {
        _id: "456",
        username: "jannunzi",
        password: "jannunzi",
        firstName: "Jose",
        lastName: "Annunzi"
    }];

    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', updateUser);
    app.delete('/api/user/:userId', deleteUser);

    function createUser(req, res) {
        var newUser = req.body;
        newUser._id = app.getNextId();

        var maybeTaken = users
                            .filter((user, _i, _a) => user.username === newUser.username)
                            .shift();
        if (maybeTaken) {
            res
                .status(400)
                .send(`The username ${maybeTaken.username} is already taken.`)
                .end();
                return;
        }

        if (newUser.password === newUser.verifyPassword) {
            delete newUser.verifyPassword;
            users.push(newUser);
            res.json(newUser);
        } else {
            res
                .status(400)
                .send('Passwords did not match.')
                .end();
        }
    }

    function findUser(req, res) {
        if (req.query.username &&
            req.query.password) {
            findUserByCredentials(req, res);
        } else if (req.query.username) {
            findUserByUsername(req, res);
        } else {
            res
                .status(400)
                .send('Bad request.')
                .end();
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        var maybeUser = users
                            .filter((user, _i, _a) => user.username === username)
                            .shift();

        if (maybeUser) {
            res.json(maybeUser);
        } else {
            res
                .status(404)
                .send(`No user ${username} exists.`)
                .end();
        }
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        var maybeUser = users
                            .filter((user, _i, _a) => {
                                return user.username === username &&
                                    user.password === password;
                            })
                            .shift();

        if (maybeUser) {
            res.json(maybeUser);
        } else {
            res
                .status(404)
                .send(`No user ${username} exists.`)
                .end();
        }
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        var maybeUser = users
                            .filter((user, _i, _a) => user._id === userId)
                            .shift();

        if (maybeUser) {
            res.json(maybeUser);
        } else {
            res
                .status(404)
                .send(`No user with ID ${userId} exists.`)
                .end();
        }
    }

    function getUserIndexById(userId) {
        for (var i in users) {
            if (users[i]._id === userId) {
                return i;
            }
        }
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var updatedUser = req.body;
        var maybeIndex = getUserIndexById(userId);

        if (!updatedUser.password) {
            res
                .status(400)
                .send('Password required.')
                .end();
                return;
        }

        if (maybeIndex) {
            var user = users[maybeIndex];
            user.password = updatedUser.password;
            user.firstName = updatedUser.firstName;
            user.lastName = updatedUser.lastName;
            users[maybeIndex] = user;
            res.json(user);
        } else {
            res
                .status(404)
                .send(`No user with ID ${userId} exists.`)
                .end();
        }
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        var maybeIndex = getUserIndexById(userId);

        if (maybeIndex) {
            users.splice(maybeIndex, 1);
            res
                .status(200)
                .send(`User ${userId} deleted.`)
                .end();
        } else {
            res
                .status(404)
                .send(`No user with ID ${userId} exists.`)
                .end();
        }
    }
}
