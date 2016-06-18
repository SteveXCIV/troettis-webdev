module.exports = function(app, models) {
    var bcrypt = require('bcrypt-nodejs');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var userModel = models.userModel;

    var biome = require('../lib/biome.js')();
    var facebookAuthConfig = {
        clientID: biome.get('FACEBOOK_CLIENT_ID'),
        clientSecret: biome.get('FACEBOOK_CLIENT_SECRET'),
        callbackURL: biome.get('FACEBOOK_CALLBACK_URL'),
    };
    passport.use(new FacebookStrategy(facebookAuthConfig, facebookStrategy));

    app.post('/api/register', register);
    app.get('/api/user', findUser);
    app.post('/api/login', passport.authenticate('wam'), login);
    app.post('/api/logout', logout);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', updateUser);
    app.delete('/api/user/:userId', deleteUser);
    app.get('/api/loggedin', loggedin);

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/assignment/#/user',
            failureRedirect: '/assignment/#/login',
        }));

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    passport.use('wam', new LocalStrategy(localStrategy));

    function register(req, res) {
        var newUser = req.body;

        if (newUser.password !== newUser.verifyPassword) {
            res
                .status(400)
                .send('Passwords did not match.');
            return;
        } else {
            delete newUser.verifyPassword;
        }

        newUser.password = bcrypt.hashSync(newUser.password);

        userModel
            .findUserByUsername(newUser.username)
            .then(
                function (user) {
                    if (user) {
                        throw `The username "${user.username}" is already taken.`;
                    }
                    return userModel.createUser(newUser);
                },
                function (error) {
                    throw error;
                })
            .then(
                function(user) {
                    req.login(
                        user,
                        function (error) {
                            if (error) {
                                res
                                    .status(400)
                                    .send(error);
                            } else {
                                res.json(user);
                            }
                        }
                    )
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
            .findUserByUsername(username)
            .then(
                function (user) {

                    // pulled this out into a block because if bcrypt gets
                    // unsanitary data, the promise will reject due to time out
                    var hash_match = false;
                    try {
                        hash_match = bcrypt.compareSync(password, user.password);
                    } catch (error) {
                        return done(error, null);
                    }

                    if (user && hash_match) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function (error) {
                    return done(error, null);
                });
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByFacebookId(profile.id)
            .then(
                function (user) {
                    if (!user) {
                        var newUser = {
                            // this is a dirty hack
                            username: profile.displayName.toLocaleLowerCase().replace(/\s+/g, '_'),
                            password: null,
                            // this too
                            firstName: profile.displayName,
                            facebook: {
                                id: profile.id,
                                token: token,
                            },
                        };
                        userModel
                            .createUser(newUser)
                            .then(
                                function (user) {
                                    return done(null, user);
                                },
                                function (error) {
                                    return done(error, null);
                                });
                    } else {
                        return done(null, user);
                    }
                },
                function (error) {
                    return done(error, null);
                });
    }
}
