module.exports = function(app, models) {
    var userModel = models.userModel;

    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', updateUser);
    app.delete('/api/user/:userId', deleteUser);

    function createUser(req, res) {
        var newUser = req.body;

        userModel
            .createUser(newUser)
            .then(
                function(user) {
                    res.json(user);
                },
                function(error) {
                    res
                        .status(500)
                        .send(error);
                });
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
        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    res.json(user);
                },
                function(error) {
                    res
                        .status(500)
                        .send(error);
                });
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        userModel
            .findUserByCredentials(username, password)
            .then(
                function(user) {
                    if (!user) {
                        res
                            .status(404)
                            .send('Your username or password is incorrect.');
                    } else {
                        res.json(user);
                    }
                },
                function(error) {
                    res
                        .status(500)
                        .send(error);
                });
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        userModel
            .findUserById(userId)
            .then(
                function(user) {
                    res.json(user);
                },
                function(error) {
                    res
                        .status(500)
                        .send(error);
                });
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var updatedUser = req.body;
        userModel
            .updateUser(userId, updatedUser)
            .then(
                function(status) {
                    if (status['nModified'] != 1) {
                        res
                            .status(200)
                            .send('No changes made.');
                    } else {
                        res
                            .status(200)
                            .send('Profile updated.');
                    }
                },
                function(error) {
                    res
                        .status(500)
                        .send('Server error while processing request.');
                });
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        userModel
            .deleteUser(userId)
            .then(
                function(status) {
                    res.sendStatus(200);
                },
                function(error) {
                    res
                        .status(500)
                        .send(error);
                });
    }
}
