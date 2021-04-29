import { Box, makeStyles, IconButton } from "@material-ui/core";
import React from "react";
import ImageZoom from "react-medium-image-zoom";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import firebase from "firebase/app";
import "firebase/storage";
const useStyles = makeStyles({
  selfMessage: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  otherMessage: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  selfWrapper: {
    backgroundColor: "rgb(54,134,255)",
    color: "rgb(255,255,255)",
    borderRadius: "10px",
    padding: "10px",
    margin: "5px",
    maxWidth: "200px",
  },
  otherWrapper: {
    backgroundColor: "rgb(62,64,66)",
    color: "rgb(255,255,255)",
    borderRadius: "10px",
    padding: "10px",
    margin: "5px",
    maxWidth: "200px",
  },
  content: {
    maxWidth: "100%",
    overflowWrap: "break-word",
  },
  username: {
    fontSize: "10px",
  },
  alert: {
    color: "yellow",
    fontSize: "10px",
    textAlign: "center",
  },
});

export default function Message({ username, content, userId, type, url }) {
  const classes = useStyles();
  const cookie = document.cookie;
  const cookieData = JSON.parse(cookie);

  return (
    <div>
      {type === "alert" && <Box className={classes.alert}>{content}</Box>}
      {type === "text" && (
        <Box
          className={
            userId === cookieData.me._id
              ? classes.selfMessage
              : classes.otherMessage
          }
        >
          <Box
            className={
              userId === cookieData.me._id
                ? classes.selfWrapper
                : classes.otherWrapper
            }
          >
            <Box className={classes.username}>{username}</Box>
            <Box className={classes.content}>{content}</Box>
          </Box>
        </Box>
      )}
      {type === "image" && (
        <Box
          className={
            userId === cookieData.me._id
              ? classes.selfMessage
              : classes.otherMessage
          }
        >
          <a href={url} download>
            <IconButton style={{ color: "rgb(255,255,255)" }}>
              <GetAppRoundedIcon></GetAppRoundedIcon>
            </IconButton>
          </a>

          <Box
            className={
              userId === cookieData.me._id
                ? classes.selfWrapper
                : classes.otherWrapper
            }
          >
            <Box className={classes.username}>{username}</Box>
            <Box className={classes.content}>
              <ImageZoom
                image={{
                  src: url,
                  className: "img",
                  style: { width: "200px" },
                }}
                zoomImage={{
                  src: url,
                }}
              />
              {/* <img src={content} style={{ width: "150px" }}></img> */}
            </Box>
          </Box>
        </Box>
      )}
      {type === "video" && (
        <Box
          className={
            userId === cookieData.me._id
              ? classes.selfMessage
              : classes.otherMessage
          }
        >
          <a href={url} download>
            <IconButton style={{ color: "rgb(255,255,255)" }}>
              <GetAppRoundedIcon></GetAppRoundedIcon>
            </IconButton>
          </a>

          <Box
            className={
              userId === cookieData.me._id
                ? classes.selfWrapper
                : classes.otherWrapper
            }
          >
            <Box className={classes.username}>{username}</Box>
            <Box className={classes.content}>
              <video
                style={{ width: "200px" }}
                autoPlay
                controls
                muted
                src={url}
              ></video>
            </Box>
          </Box>
        </Box>
      )}

      {type === "file" && (
        <Box
          className={
            userId === cookieData.me._id
              ? classes.selfMessage
              : classes.otherMessage
          }
        >
          <a href={url} download>
            <IconButton style={{ color: "rgb(255,255,255)" }}>
              <GetAppRoundedIcon></GetAppRoundedIcon>
            </IconButton>
          </a>
          <Box
            className={
              userId === cookieData.me._id
                ? classes.selfWrapper
                : classes.otherWrapper
            }
          >
            <Box className={classes.username}>{username}</Box>
            <Box className={classes.content}>
              <Box>{content}</Box>
            </Box>
          </Box>
        </Box>
      )}
    </div>
  );
}
