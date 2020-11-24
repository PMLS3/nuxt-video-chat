let users = {};

function Svc(socket, io) {
  const chatSvc = Object.freeze({
    joinRoom({ room, user }) {
      return new Promise((resolve, reject) => {
        socket.join(room, () => {
          let type = { type: "join" };
          const resp = { room, user, type };

          // add user to room
          if (users[room]) {
            users[room].push(user);
          } else {
            users[room] = [];
            users[room].push(user);
          }
          console.log("resp", resp);
          socket.to(room).broadcast.emit("joinedRoom", resp);
          resolve(users[room]);
        });
      });
    },
    leaveRoom({ room, user }) {
      return new Promise((resolve, reject) => {
        socket.leave(room, () => {
          let type = { type: "left" };
          const resp = { room, user, type };
          socket.to(room).broadcast.emit("leavedRoom", resp);
          resolve(resp);
        });
      });
    }
  });
  return chatSvc;
}

module.exports = {
  Svc
};
