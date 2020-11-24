const ss = require("socket.io-stream");

function Svc(socket, io) {
  const roomSvc = Object.freeze({
    joinRoom({ roomId, userId }) {
      console.log("room", roomId, userId);
      return new Promise((resolve, reject) => {
        let roomSet = {
          roomId: roomId,
          userId: userId
        };
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("joinedRoom", roomSet);
        resolve(roomSet);
      });
    },

    messageSent({ message, roomId }) {
      console.log("message", message);
      return new Promise((resolve, reject) => {
        socket.to(roomId).broadcast.emit("receivedMessage", message);
      });
    },

    videoSend({ stream, room }) {
      console.log("stream", stream, room);
      return new Promise((resolve, reject) => {
        let mystream = { stream: stream };
        socket.to(room).broadcast.emit("videoReceived", mystream);
      });
    }
  });

  return roomSvc;
}

module.exports = {
  Svc
  // videoSend
  // ImageStream
};
