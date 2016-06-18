module.exports = function(app, models) {
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var userModel = models.userModel;

    app.post('/api/user', createUser);
    app.get('/api/user', findUser);
    app.post('/api/login', passport.authenticate('wam'), login);
    app.post('/api/logout', logout);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', updateUser);
    app.delete('/api/user/:userId', deleteUser);

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    passport.use('wam', new LocalStrategy(localStrategy));

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
        if (req.query.username) {
            findUserByUsername(req, res);
        } else {
            res
                .status(400)
                .send('Bad request.')
                .end();
        }
    }

    function login(req, res) {
        var user = req.user;
        app.debug(`Handle login for user: ${user._id} (${user.username}).`);
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        app.debug(`Handle logout request. Session user set to ${req.user}.`);
        res.send(200);
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

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function (user) {
                    done(null, user);
                },
                function (error) {
                    done(error, null);
                });
    }

    function localStrategy(username, password, done) {
        userModel
            .findUserByCredentials(username, password)
            .then(
                function (user) {
                    if (user.username === username && user.password === password) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function (error) {
                    if (err) {
                        return done(err);
                    }
                });
    }
}
