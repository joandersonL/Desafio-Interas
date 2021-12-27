const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
    const { name, username } = request.body;

    const userAlreadyExists = users.some((user) => user.username === username);

    if (userAlreadyExists) {
        return response.status(400).json({ error: "User already exists!" });
    }
    return next();
}

function checksIdAccount(request, response, next) {
    const { id } = request.params;
    const user = users.find((user) => user.id === id);
    if (!user) {
        return response.status(404).json({ error: "User not found!" });
    }
    request.user = user;
    return next();
}


app.post('/users', checksExistsUserAccount, (request, response) => {
    const { name, username } = request.body;
    const user = {
        id: uuidv4(),
        name,
        username
    }
    users.push(user);

    response.status(201).json(user);

});

app.get('/users', (request, response) => {
    // Complete aqui
    return response.json(users);

});

app.get('/users/:id',  checksIdAccount,(request, response) => {
    // const { id } = request.params;
    // const user = users.find((user) => user.id === id);
    const { user } = request;
    return response.status(201).json(user);

})


app.put('/users/:id',  checksIdAccount, (request, response) => {

    //const { id } = request.params;
    const { name, username } = request.body;
    const { user } = request;
    user.name = name;
    user.username = username;
    response.status(201).json(user);
});


app.delete('/users/:id',  checksIdAccount, (request, response) => {
    const { user } = request;
    users.slice(user, 1);
    response.status(201).send();
});

module.exports = app;