module.exports = function(app, models) {
    var err = require('./errorHandler')();
    var log = require('../../lib/logger')();
    var validate = require('express-validation');
    var validators = require('../validators/validators')();
    var bcrypt = require('bcrypt-nodejs');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var userModel = models.userModel;

    var biome = require('../../lib/biome.js')();
    var facebookAuthConfig = {
        clientID: biome.get('FACEBOOK_CLIENT_ID'),
        clientSecret: biome.get('FACEBOOK_CLIENT_SECRET'),
        callbackURL: biome.get('FACEBOOK_CALLBACK_URL'),
    };
    passport.use(new FacebookStrategy(facebookAuthConfig, facebookStrategy));

    app.post('/api/register', validate(validators.register), register);
    app.get('/api/user', validate(validators.findUserByUsername), findUserByUsername);
    app.get('/api/user/current', findCurrentUser);
    app.post('/api/login', passport.authenticate('project'), login);
    app.post('/api/logout', logout);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', validate(validators.updateUser), updateUser);
    app.delete('/api/user/:userId', deleteUser);
    app.get('/api/loggedin', loggedin);

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/project/#/profile',
            failureRedirect: '/project/#/login',
        }));

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    passport.use('project', new LocalStrategy(localStrategy));

    function register(req, res) {
        var newUser = req.body;
        log.debug(`Request to create new user: ${JSON.stringify(newUser)}.`);
        delete newUser.verifyPassword;
        newUser.password = bcrypt.hashSync(newUser.password);
        log.debug('Hashed password');

        userModel
            .registerUser(newUser)
            .then(
                function(user) {
                    return req.login(user, function (error) {
                        if (error) {
                            log.error('Login error after registration.', error);
                            res
                                .status(400)
                                .send(error);
                        } else {
                            log.debug(`Login successful: ${JSON.stringify(user)}`);
                            res.json(user);
                        }
                    })
                },
                function (error) {
                    log.error('Database error.', error);
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function findCurrentUser(req, res) {
        if (req.user) {
            res.json(stripPassword(req.user));
        } else {
            res
                .status(404)
                .json(['Failed to find current login session. Please try logging out and in again.']);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        log.debug(`Request to find user named "${username}".`);
        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    if (user) {
                        user = stripPassword(user);
                        log.debug(`Returning user: ${JSON.stringify(user)}.`);
                        res.json(user);
                    } else {
                        log.error('Error finding user by username.', error);
                        res
                            .status(404)
                            .send('User not found.');
                    }
                });
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        log.debug(`Request to find user with ID ${userId}.`);
        userModel
            .findUserById(userId)
            .then(
                function(user) {
                    user = stripPassword(user);
                    log.debug(`Returning user: ${JSON.stringify(user)}.`);
                    res.json(user);
                },
                function(error) {
                    log.error('Error finding user by ID.', error);
                    res
                        .status(500)
                        .send(error);
                });
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var updatedUser = req.body;
        log.debug(`Request to update user with ID ${userId} and payload ${JSON.stringify(updatedUser)}.`);

        try {
            if (req.user &&
                req.user._id.equals(userId) &&
                bcrypt.compareSync(updatedUser.password, req.user.password)) {
                updatedUser.password = (updatedUser.newPassword) ? bcrypt.hashSync(updatedUser.newPassword) : req.user.password;
                userModel
                    .updateUser(userId, updatedUser)
                    .then(
                        function (user) {
                            log.debug(`Got update result: ${JSON.stringify(user)}.`);
                            if (user) {
                                res.json(user);
                            } else {
                                res
                                    .status(404)
                                    .send('User not found.');
                            }
                        },
                        function (error) {
                            log.error('Error updating user.', error);
                            res
                                .json(error);
                        });
            } else {
                log.error(`User update validation error: Checks: \nreq.user = ${req.user}; \n(req.user._id.equals(userId)) = ${req.user._id.equals(userId)}; \nreq.user._id = ${req.user._id}; \nuserId       = ${userId}; \nbcrypt.compareSync(updatedUser.password, req.user.password) = ${bcrypt.compareSync(updatedUser.password, req.user.password)}.`);
                res
                    .status(403)
                    .json(['You need to be logged in to do that.'])
                    .end();
            }
        } catch (e) {
            log.error('Error updating user.', error);
            res
                .status(400)
                .json(e);
        }
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
        log.debug('Begin local strategy login request.');
        userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    log.debug(`User = ${JSON.stringify(user)}.`);
                    try {
                        if (user && bcrypt.compareSync(password, user.password)) {
                            log.debug('Login success, returning user.');
                            return done(null, user);
                        } else {
                            log.error('Login failed, invalid credentials.');
                            return done(null, false, { message: 'Invalid credentials.' });
                        }
                    } catch (error) {
                        log.error('Exception thrown.', error);
                        return done(error, null);
                    }
                },
                function (error) {
                    log.error('Error from database model.', error);
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
                            password: profile.id.toString(),
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

    function stripPassword(user) {
        var clone = Object.assign({}, user)._doc;
        delete clone.password;
        return clone;
    }
}
