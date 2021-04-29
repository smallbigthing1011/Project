import { IconButton, makeStyles } from "@material-ui/core";
import PowerSettingsNewRoundedIcon from "@material-ui/icons/PowerSettingsNewRounded";
import QueuePlayNextRoundedIcon from "@material-ui/icons/QueuePlayNextRounded";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { connect, createLocalTracks, LocalVideoTrack } from "twilio-video";

const useStyles = makeStyles({
  root: {
    maxWidth: "90vw",
    backgroundColor: "rgb(47,49,54)",
    height: "100vh",
    maxHeight: "100vh",
    overflow: "scroll",
  },
});
export default function RoomVideo() {
  const classes = useStyles();
  const [localTracks, setLocalTracks] = useState([]);
  const [room, setRoom] = useState();
  const { roomcall } = useParams();
  const history = useHistory();

  const cookie = document.cookie;
  const cookieData = JSON.parse(cookie);

  useEffect(async () => {
    console.log(roomcall);
    const videoTokenData = await (
      await fetch(`http://localhost:3000/video/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: cookieData.token,
        },
        body: JSON.stringify({
          roomId: roomcall,
        }),
      })
    ).json();
    const token = videoTokenData.token;
    const identity = videoTokenData.identity;
    console.log(token);
    console.log(identity);

    createLocalTracks({
      audio: true,
      video: { width: 300 },
    })
      .then((localTracks) => {
        setLocalTracks(localTracks);
        return connect(token, {
          name: "abc",
          tracks: localTracks,
        });
      })
      .then((room) => {
        console.log(room);
        setRoom(room);
        const localParticipant = room.localParticipant;
        console.log(
          `Connected to the Room as LocalParticipant "${localParticipant.identity}"`
        );

        localParticipant.tracks.forEach((publication) => {
          console.log(publication);
          document
            .getElementById("local-media-div")
            .appendChild(publication.track.attach());
        });
        // Log any Participants already connected to the Room
        room.participants.forEach((participant) => {
          console.log(
            `Participant "${participant.identity}" is connected to the Room`
          );
          participant.tracks.forEach((publication) => {
            if (publication.track) {
              document
                .getElementById("remote-media-div")
                .appendChild(publication.track.attach());
            }
          });

          participant.on("trackSubscribed", (track) => {
            document
              .getElementById("remote-media-div")
              .appendChild(track.attach());
          });
        });

        // Log new Participants as they connect to the Room
        room.on("participantConnected", (participant) => {
          console.log(
            `Participant "${participant.identity}" has connected to the Room`
          );

          participant.tracks.forEach((publication) => {
            if (publication.isSubscribed) {
              const track = publication.track;
              document
                .getElementById("remote-media-div")
                .appendChild(track.attach());
            }
          });

          participant.on("trackSubscribed", (track) => {
            document
              .getElementById("remote-media-div")
              .appendChild(track.attach());
          });
        });

        // Log Participants as they disconnect from the Room
        room.on("participantDisconnected", (participant) => {
          console.log(participant);
        });
        room.on("disconnected", (room) => {
          // Detach the local media elements
          room.localParticipant.tracks.forEach((publication) => {
            const attachedElements = publication.track.detach();
            attachedElements.forEach((element) => element.remove());
          });
        });
      });
  }, []);
  const screenShare = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { width: 800 },
    });
    const screenTrack = new LocalVideoTrack(stream.getTracks()[0]);
    room.localParticipant.publishTrack(screenTrack);
  };
  const participantDisconnect = () => {
    room.disconnect();
    history.push("/channel");
  };
  return (
    <div className={classes.root}>
      <IconButton
        variant="contained"
        color="secondary"
        onClick={participantDisconnect}
      >
        <PowerSettingsNewRoundedIcon></PowerSettingsNewRoundedIcon>
      </IconButton>
      <IconButton variant="contained" color="secondary" onClick={screenShare}>
        <QueuePlayNextRoundedIcon></QueuePlayNextRoundedIcon>
      </IconButton>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          id="remote-media-div"
          style={{
            width: "100%",
            border: "2px solid rgb(255,255,255)",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            minHeight: "300px",
          }}
        ></div>
        <div
          id="local-media-div"
          style={{
            maxWidth: "300px",
            border: "2px solid rgb(255,255,255)",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        ></div>
      </div>
    </div>
  );
}
