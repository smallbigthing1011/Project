const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("conected");
    socket.on("join-room", ({ userid, roomid, username }) => {
      console.log(`datas: ${username}`);
      socket.join(roomid);

      io.to(roomid).emit("alert-new-user", { userid, username });
    });
    socket.on("oncall", ({ roomid }) => {
      io.to(roomid).emit("setcall", { roomid });
    });
    socket.on(
      "send-message",
      ({ userid, content, roomid, username, type, url }) => {
        console.log("server receive");

        io.to(roomid).emit("broadcast-message", {
          userid,
          content,
          roomid,
          username,
          type,
          url,
        });
      }
    );
    // socket.on("update", (data) => {
    //   console.log(data);
    //   io.to(data.room).emit("update-message", { content: data.content });
    // });
  });
};

module.exports = { initSocket };
