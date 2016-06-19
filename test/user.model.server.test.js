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
        it('should register a new user and return it', function (done) {
            var user = {
                username: 'test2',
                password: 'test',
                firstName: 'Testy',
                lastName: 'McTestFace',
            };
            userModel
                .registerUser(user)
                .then(
                    function (user) {
                        user.username.should.equal('test2');
                        user.password.should.equal('test');
                        user.firstName.should.equal('Testy');
                        user.lastName.should.equal('McTestFace');
                        done();
                    },
                    function (error) {
                        done(error);
                    });
        });
    });

    describe('#registerUser (unhappy)', function () {
        it('should fail to register a user with a taken name', function(done) {
            var user = {
                username: 'test',
                password: 'test',
                firstName: 'Testy',
                lastName: 'McTestFace',
            };
            userModel
                .registerUser(user)
                .then(
                    function (user) {
                        done(new Error('Registered a duplicate user: ' + JSON.stringify(user)));
                    },
                    function (error) {
                        error.name.should.equal('ValidationError');
                        error.errors.should.have.property('username');
                        done();
                    });
        });
    })
})
