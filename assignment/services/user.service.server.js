module.exports = function(app) {
    app.post('/api/user', createUser);
    app.get('/api/user?username=username', findUserByUsername);
    app.get('/api/user?username=username&password=password', findUserByCredentials);
    app.get('/api/user/:userId', findUserById);
    app.put('/api/user/:userId', updateUser);
    app.delete('/api/user/:userId', deleteUser);

    function createUser(req, res) {
        console.log("function call createUser");
    }

    function findUserByUsername(req, res) {
        console.log("function call findUserByUsername");
    }

    function findUserByCredentials(req, res) {
        console.log("function call findUserByCredentials");
    }

    function findUserById(req, res) {
        console.log("function call findUserById");
    }

    function updateUser(req, res) {
        console.log("function call updateUser");
    }

    function deleteUser(req, res) {
        console.log("function call deleteUser");
    }
}
