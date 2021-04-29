import {
  Box,
  CircularProgress,
  Fab,
  Grid,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import PermMediaRoundedIcon from "@material-ui/icons/PermMediaRounded";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import VideoCallRoundedIcon from "@material-ui/icons/VideoCallRounded";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { app } from "../../base";
import { Message, RoomInfo } from "../../components";

const useStyles = makeStyles({
  root: {
    color: "rgb(255,255,255)",
    position: "relative",
    maxHeight: "90vh",
    overflowY: "scroll",
  },
  sendbar: {
    position: "fixed",
    bottom: "0",
    width: "100%",
  },
  messagebox: {
    overflowY: "scroll",
    height: "100%",
  },
  roomside: {
    position: "sticky",
    height: "100vh",
    backgroundColor: "rgb(37,39,43)",
    border: "3px solid rgb(98,45,141)",
    borderTop: "0",
    borderBottom: "0",
    borderRight: "0",
  },
  // fileWrapper: {
  //   width: "100%",
  //   height: "100px",
  //   position: "fixed",
  //    bottom: ""
  // }
});
const db = app.firestore();
export default function Room() {
  const classes = useStyles();
  const { roomid } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageValue, setMessageValue] = useState("");
  const [members, setMembers] = useState([]);
  const [roomCall, setRoomCall] = useState("");
  // const [page, setPage] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const [loading, setLoading] = useState(false);
  const socketRef = useRef();
  const cookie = document.cookie;
  const cookieData = JSON.parse(cookie);
  const handleChange = (event) => {
    setMessageValue(event.target.value);
  };
  const handleClickCall = useCallback(() => {
    const socket = socketRef.current;
    if (socket && socket.connected) {
      socket.emit("oncall", {
        roomid,
      });
    }
  }, [roomid]);
  const handleSend = useCallback(
    async (event) => {
      event.preventDefault();

      const socket = socketRef.current;
      if (socket && socket.connected) {
        if (preview) {
          const storageRef = app.storage().ref();
          const fileRef = storageRef.child(`files/${file.name}`);
          await fileRef.put(file);
          const downloadUrl = await fileRef.getDownloadURL();
          if (file.type === "video/mp4") {
            socket.emit("send-message", {
              userid: cookieData.me._id,
              content: file.name,
              roomid,
              username: cookieData.me.username,
              type: "video",
              url: downloadUrl,
            });
            const newMessage = await (
              await fetch(`http://localhost:3000/message/room/${roomid}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  token: cookieData.token,
                },
                body: JSON.stringify({
                  type: "video",
                  content: file.name,
                  url: downloadUrl,
                }),
              })
            ).json();
            if (!newMessage.message) {
              db.collection("room").doc(roomid).set({
                file: downloadUrl,
                userId: cookieData.me._id,
              });
              setPreview();
              setFile();
              setMessageValue("");
            }
            console.log("video");
          } else if (file.type.split("/")[0] === "image") {
            socket.emit("send-message", {
              userid: cookieData.me._id,
              content: file.name,
              roomid,
              username: cookieData.me.username,
              type: "image",
              url: downloadUrl,
            });
            const newMessage = await (
              await fetch(`http://localhost:3000/message/room/${roomid}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  token: cookieData.token,
                },
                body: JSON.stringify({
                  type: "image",
                  content: file.name,
                  url: downloadUrl,
                }),
              })
            ).json();
            if (!newMessage.message) {
              db.collection("room").doc(roomid).set({
                file: downloadUrl,
                userId: cookieData.me._id,
              });
              setPreview();
              setFile();
              setMessageValue("");
            }
          } else {
            socket.emit("send-message", {
              userid: cookieData.me._id,
              content: file.name,
              roomid,
              username: cookieData.me.username,
              type: "file",
              url: downloadUrl,
            });
            const newMessage = await (
              await fetch(`http://localhost:3000/message/room/${roomid}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  token: cookieData.token,
                },
                body: JSON.stringify({
                  type: "file",
                  content: file.name,
                  url: downloadUrl,
                }),
              })
            ).json();
            if (!newMessage.message) {
              db.collection("room").doc(roomid).set({
                file: downloadUrl,
                userId: cookieData.me._id,
              });
              setPreview();
              setFile();
              setMessageValue("");
            }
            console.log("video");
          }
        } else {
          if (messageValue) {
            socket.emit("send-message", {
              userid: cookieData.me._id,
              content: messageValue,
              roomid,
              username: cookieData.me.username,
              type: "text",
            });
            setLoading(true);
            const newMessage = await (
              await fetch(`http://localhost:3000/message/room/${roomid}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  token: cookieData.token,
                },
                body: JSON.stringify({
                  type: "text",
                  content: messageValue,
                }),
              })
            ).json();
            setMessageValue("");
            setLoading(false);
          }
        }
      }
    },
    [messageValue, cookieData.me._id, roomid]
  );
  const handleScroll = (event) => {
    const { scrollTop } = event.currentTarget;

    if (scrollTop === 0) {
      console.log("top");
    }
  };
  const handleChangeFile = (event) => {
    const getFile = event.target.files[0];
    console.log(getFile);
    setFile(getFile);
    let reader = new FileReader();
    reader.onload = function (event) {
      // setFile(event.target.result);
      setPreview(event.target.result);
    };

    reader.readAsDataURL(getFile);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const roomData = await (
        await fetch(`http://localhost:3000/room/${roomid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: cookieData.token,
          },
        })
      ).json();
      if (!roomData.message) {
        setMessages(roomData.messages);
        setMembers(roomData.members);
        setLoading(false);
        const fileCollection = await db.collection("room").get();
        setFileList(
          fileCollection.docs.map((doc) => {
            return doc.data();
          })
        );
      }
    };
    fetchData();
  }, [roomid]);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      // withCredentials: true,
      extraHeaders: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Requested-With",
      },
    });

    socketRef.current = socket;

    socket.on("setcall", ({ roomid }) => {
      setRoomCall(roomid);
    });
    socket.emit("join-room", {
      userid: cookieData.me._id,
      roomid,
      username: cookieData.me.username,
    });
    socket.on("alert-new-user", async ({ userid, username }) => {
      console.log("joined");
      const newMessage = await (
        await fetch(`http://localhost:3000/message/room/${roomid}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: cookieData.token,
          },
          body: JSON.stringify({
            type: "alert",
            content: `${username} has joined room`,
          }),
        })
      ).json();
      if (!newMessage.message) {
        setMessages((messages) => [...messages, newMessage]);
      }
    });
    socket.on(
      "broadcast-message",
      async ({ userid, content, roomid, username, type, url }) => {
        let cloneMessage = {
          content,
          type,
          url,
          userId: {
            _id: userid,
            username,
          },
          roomid,
        };
        setMessages((messages) => [...messages, cloneMessage]);
      }
    );
  }, []);

  return (
    <div>
      <Grid container>
        <Grid item xs={10} sm={10} md={10} lg={10}>
          <IconButton onClick={handleClickCall}>
            <VideoCallRoundedIcon></VideoCallRoundedIcon>
          </IconButton>
          <div className={classes.root} onScroll={handleScroll}>
            <Box className={classes.messagebox}>
              {messages.map((item) => {
                return (
                  <Message
                    userId={item.userId._id}
                    username={item.userId.username}
                    content={item.content}
                    type={item.type}
                    url={item.url}
                  ></Message>
                );
              })}

              {loading && <CircularProgress></CircularProgress>}
            </Box>
          </div>
          <Box className={classes.sendbar}>
            {preview && (
              <Box>
                <Fab
                  color="primary"
                  size="small"
                  aria-label="cancel"
                  onClick={() => {
                    setPreview();
                  }}
                >
                  <CancelRoundedIcon />
                </Fab>
                {file.type === "video/mp4" && (
                  <video
                    src={preview}
                    style={{
                      width: "150px",
                      borderRadius: "8px",
                      border: "1px solid rgb(255,255,255)",
                    }}
                    autoPlay
                  ></video>
                )}
                {file.type.split("/")[0] === "image" && (
                  <img
                    src={preview}
                    style={{
                      width: "150px",
                      borderRadius: "8px",
                      border: "1px solid rgb(255,255,255)",
                    }}
                  ></img>
                )}
                <Box
                  style={{
                    width: "200px",
                    borderRadius: "8px",
                    backgroundColor: "rgb(62,64,66)",
                  }}
                >
                  <Box
                    style={{
                      fontWeight: "bold",
                      overflowWrap: "break-word",
                      color: "rgb(255,255,255)",
                    }}
                  >
                    {file.name}
                  </Box>
                  <Box
                    style={{
                      fontWeight: "bold",
                      fontSize: "12px",
                      overflowWrap: "break-word",
                      textAlign: "center",
                      color: "rgb(9,126,235)",
                    }}
                  >{`${(file.size / (1024 * 1024)).toFixed(2)} MB`}</Box>
                </Box>
              </Box>
            )}
            <form onSubmit={handleSend}>
              <label htmlFor="upload">
                <input
                  style={{ display: "none" }}
                  id="upload"
                  name="upload"
                  type="file"
                  onChange={handleChangeFile}
                />

                <Fab
                  color="secondary"
                  size="small"
                  component="span"
                  aria-label="add"
                >
                  <PermMediaRoundedIcon></PermMediaRoundedIcon>
                </Fab>
              </label>
              <label htmlFor="uploadcustom">
                <input
                  style={{ display: "none" }}
                  id="uploadcustom"
                  name="uploadcustom"
                  type="file"
                  onChange={handleChangeFile}
                />

                <Fab
                  color="secondary"
                  size="small"
                  component="span"
                  aria-label="up"
                >
                  <AttachFileIcon></AttachFileIcon>
                </Fab>
              </label>
            </form>
            <form
              onSubmit={handleSend}
              style={{
                width: "70%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                onChange={handleChange}
                value={messageValue}
                style={{
                  width: "70%",
                  background: "transparent",
                  border: "1px solid black",
                  borderRadius: "14px",
                  padding: "10px",
                  outline: "none",
                  color: "rgb(255,255,255)",
                }}
              ></input>
              <IconButton aria-label="send" color="secondary" type="submit">
                <SendRoundedIcon fontSize="large" />
              </IconButton>
            </form>
          </Box>
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2} className={classes.roomside}>
          <RoomInfo
            members={members}
            fileList={fileList}
            roomid={roomid}
            roomCall={roomCall}
          ></RoomInfo>
        </Grid>
      </Grid>
    </div>
  );
}
