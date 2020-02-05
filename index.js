const express = require('express')
const jwt = require('jsonwebtoken');

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

const app = express();

const secret = "Secret";

app.use(express.json())


app.use("/secure/*", (req, res, next) => {
    const token = ((req.headers.authorization || "").match(/^bearer (.*)$/i) || [])[1]
    try {
        const decoded = jwt.decode(token);
        const username = decoded.user;
        if (username) {
            const user = users.find(user => user.name === username);
            if (user) {
                jwt.verify(token, secret + user.password);
                return next();
            }
        }
        res.status(403).send("Unauthenticated!");
    } catch {
        res.status(403).send("Unauthenticated!");
    }
})


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

app.post('/secure/room', (req, res) => {
    const id = Object.keys(rooms).length + 1
    const room = { id, name: req.body.name }
    rooms[id] = room
    res.json(room)
})

app.post('/login', (req, res) => {
    const name = req.body.name;
    const pass = req.body.pass;
    const user = users.find(user => user.name === name && user.password === pass)

    if (user) {
        const token = jwt.sign({ user: user.name }, secret + user.password);
        res.json({
            token
        });
    } else {
        res.status(401).send("ko");
    }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))