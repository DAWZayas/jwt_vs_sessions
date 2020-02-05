const express = require('express')
const session = require('express-session');
const app = express()
app.use(session({
    secret: 's3Cur3',
    name: 'sessionId',
})
);
app.use(express.json())

const port = 3000

const users = [
    {
        name: "javier",
        password: "1"
    },
    {
        name: "ana",
        password: "2"
    }
]

const rooms = {
    1: {
        id: 1,
        name: "simple"
    },
    2: {
        id: 2,
        name: "double"
    },
    3: {
        id: 3,
        name: "suite"
    }
}

app.get('/room', (req, res) => {
    res.json(rooms);
})

app.get('/room/:id', (req, res) => {
    const roomId = req.params.id;
    const room = rooms[roomId];
    if (room) {
        res.json(room);
    } else {
        res.status(418).send("Room not found!");
    }
})

app.post('/room', (req, res) => {
    const user = req.session.user;
    if (user) {
        const id = Object.keys(rooms).length + 1
        const room = { id, name: req.body.name }
        rooms[id] = room
        res.json(room)
    } else {
        res.status(403).send("Unauthenticated!");
    }
})

app.post('/login', (req, res) => {
    const name = req.body.name;
    const pass = req.body.pass;
    const user = users.find(user => user.name === name && user.password === pass)

    if (user) {
        req.session.user = name
        res.send("ok");
    } else {
        res.status(401).send("ko");
    }
})


app.post('/logout', (req, res) => {
    req.session.destroy();
    res.send("ok");
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))