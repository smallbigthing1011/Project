import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { connect, createLocalTracks } from "twilio-video";

export default function RoomVideo() {
  const [localTracks, setLocalTracks] = useState([]);
  const [room, setRoom] = useState();
  const { roomcall } = useParams();

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
      video: { width: 400 },
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
          console.log(
            `Participant "${participant.identity}" has disconnected from the Room`
          );
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

  return (
    <div>
      <button
        onClick={() => {
          room.disconnect();
        }}
      >
        disconnect
      </button>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div id="local-media-div" style={{ width: "200px" }}></div>

        <div id="remote-media-div"></div>
      </div>
    </div>
  );
}
