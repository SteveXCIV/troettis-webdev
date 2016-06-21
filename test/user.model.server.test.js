var chai = require('chai');
var should = chai.should();

var mongoose = require('mongoose');
var userModel = require('../project/model/user/user.model.server.js')();

mongoose.connect('mongodb://localhost/test');

describe('Users', function () {
    var testUser = null;

    beforeEach(function () {
        var templateUser = {
            username: 'test',
            password: 'test',
            firstName: 'Testy',
            lastName: 'McTestFace',
        };
        return userModel
            .registerUser(templateUser)
            .then(
                function (user) {
                    user.username.should.equal('test');
                    user.password.should.equal('test');
                    user.firstName.should.equal('Testy');
                    user.lastName.should.equal('McTestFace');
                    testUser = user;
                });
    });

    afterEach(function () {
        return userModel.$model
            .remove({})
            .then(
                function (response) {
                    response.result.ok.should.equal(1);
                    response.result.n.should.be.at.least(1);
                    testUser = null;
                });
    });

    describe('#registerUser (happy)', function () {
        it('should register a new user and return it', function() {
            var user = {
                username: 'test2',
                password: 'test',
                firstName: 'Testy',
                lastName: 'McTestFace',
            };
            return userModel
                .registerUser(user)
                .then(
                    function (user) {
                        user.username.should.equal('test2');
                        user.password.should.equal('test');
                        user.firstName.should.equal('Testy');
                        user.lastName.should.equal('McTestFace');
                        return user;
                    },
                    function (error) {
                        throw new Error(error);
                    });
        });
    });

    describe('#registerUser (unhappy)', function () {
        it('should fail to register a user with a taken name', function() {
            var user = {
                username: 'test',
                password: 'test',
                firstName: 'Testy',
                lastName: 'McTestFace',
            };
            return userModel
                .registerUser(user)
                .then(
                    function (user) {
                        throw new Error('Registered a duplicate user.');
                    },
                    function (error) {
                        error.name.should.equal('ValidationError');
                        error.errors.should.have.property('username');
                        return error;
                    });
        });

        it('should reject registrations with missing fields', function() {
            var user = {
                password: 'foo',
                firstName: 'first',
                lastName: 'last',
            };
            return userModel
                .registerUser(user)
                .then(
                    function (user) {
                        throw new Error('Registered invalid user.');
                    },
                    function (error) {
                        error.name.should.equal('ValidationError');
                        error.errors.username.should.exist;
                        return error;
                    });
        });
    })

    describe('#updateUserProfile (happy)', function () {
        it('should only update first, last, and contact info', function() {
            var user = {
                username: 'newUsername',
                password: 'newPassword',
                firstName: 'newFirstName',
                lastName: 'newLastName',
                contacts: [{
                    kind: 'EMAIL',
                    value: 'test@test.com',
                }],
            };
            testUser.username.should.not.equal('newUsername');
            testUser.password.should.not.equal('newPassword');
            testUser.firstName.should.not.equal('newFirstName');
            testUser.lastName.should.not.equal('newLastName');
            testUser.contacts.should.be.empty;
            return userModel
                .updateUserProfile(testUser._id, user)
                .then(
                    function (user) {
                        user.username.should.not.equal('newUsername');
                        user.password.should.not.equal('newPassword');
                        user.firstName.should.equal('newFirstName');
                        user.lastName.should.equal('newLastName');
                        user.contacts.should.not.be.empty;
                        user.contacts.length.should.equal(1);
                        return user;
                    },
                    function (error) {
                        throw new Error(error);
                    });
        });
    });

    describe('#updateUserProfile (unhappy)', function () {
        it('should return an error 404 if the specified user does not exist', function() {
            var user = {
                username: 'foo',
                password: 'bar',
            };
            return userModel
                .updateUserProfile('ffffffffffffffffffffffff', user)
                .then(
                    function (user) {
                        throw new Error('Returned a user even though the ID was bad.');
                    },
                    function (error) {
                        error.should.equal(404);
                        return error;
                    });
        });
    });

    describe('#deleteUser (happy)', function () {
        it('should return the user after deleting a user', function () {
            var user = {
                username: 'foo',
                password: 'bar',
            };
            return userModel
                .registerUser(user)
                .then(
                    function (dbUser) {
                        return userModel.deleteUser(dbUser._id);
                    },
                    function (error) {
                        throw new Error(error);
                    })
                .then(
                    function (user) {
                        user.username.should.equal('foo');
                        user.password.should.equal('bar');
                    },
                    function (error) {
                        throw new Error(error);
                    });
        });
    });

    describe('#deleteUser (unhappy)', function () {
        it('should return an error 404 if the user does not exist', function () {
            return userModel
                .deleteUser('ffffffffffffffffffffffff')
                .then(
                    function (user) {
                        throw new Error('Returned a user even though the ID was bad.');
                    },
                    function (error) {
                        error.should.equal(404);
                        return error;
                    });
        });
    });
})
