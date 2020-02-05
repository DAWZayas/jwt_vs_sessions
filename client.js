const fetch = require('node-fetch');

const getRoom = (roomId) =>
    fetch(`http://localhost:3000/room/${roomId}`)
        .then(res => {
            if (res.status >= 400) {
                throw new Error("Invalid room")
            }
            return res.json();
        }
        )
        .then(room => console.log(room))
        .catch(err => console.log(err));


getRoom(1);
getRoom(145);