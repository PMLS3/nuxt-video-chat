<template>
  <div>
    <vs-button
      color="primary"
      type="filled"
      icon="mic"
      @click="$router.push('/composition')"
    ></vs-button>
    <vs-button
      class="mic-btn"
      color="primary"
      type="filled"
      icon="mic"
      @click="muteMicrophone()"
    ></vs-button>
    <vs-button
      color="primary"
      type="filled"
      icon="videocam"
      @click="videoSwitch()"
      class="video-btn"
    ></vs-button>
    <vs-button
      color="primary"
      type="filled"
      class="videoshow-btn"
      icon="video_library"
      @click="videoShow()"
    ></vs-button>
    <div
      id="video-grid"
      class="absolute top-0 flex"
      style="height: 150px; z-index: 150"
    ></div>
  </div>
</template>

<script>
// const fs = require('fs')
// import Peer from "peerjs";
export default {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    room: {
      type: String,
      default: "test"
    }
  },

  data() {
    return {
      joinDetails: {
        roomId: "hello",
        userId: "Peet"
      },
      roomInfo: {},
      message: "",
      messages: [],
      users: [],
      messageInfo: {},
      videoGrid: null,
      myVideo: null,
      myPeer: null,
      peers: {},
      stream: null,
      mode: "camera",
      joinedRoom: "",
      video: true,
      audio: true,
      classesToAdd: [
        "transition",
        "duration-500",
        "ease-in-out",
        "bg-blue-500",
        "hover:bg-red-500",
        "transform",
        "hover:-translate-y-1",
        "hover:scale-110",
        "moveable"
      ]
    };
  },
  watch: {
    room: {
      handler(newValue, oldValue) {
        this.joinDetails = { room: oldValue.name, user: this.user };
        this.leaveRoom(this.joinDetails);

        this.joinDetails = { room: newValue.name, user: this.user };

        this.joinRoom(this.joinDetails);
      },
      deep: true
    }
  },
  mounted() {
    this.joinDetails.userId = Math.floor(Math.random() * 1000 + 1);
    this.joinDetails.roomId = this.room;
    if (process.client) {
      this.socket = this.$nuxtSocket({ channel: "/videochat" });
      this.startVideo();
    }
  },
  methods: {
    startVideo() {
      let vm = this;
      this.myPeer = new Peer(undefined);
      console.log("my PEER", this.myPeer);
      this.myPeer.on("open", id => {
        console.log("open", id);
        this.joinDetails.userId = id;
        this.socket.emit("joinRoom", this.joinDetails);
      });
      this.videoGrid = document.getElementById("video-grid");
      this.myVideo = document.createElement("video");
      this.myVideo.muted = true;
      this.myVideo.classList.add(...this.classesToAdd);

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(stream => {
          this.stream = stream;
          this.addVideoStream(this.myVideo, this.stream);
          this.myPeer.on("call", call => {
            call.answer(this.stream);
            const video = document.createElement("video");
            call.on("stream", userVideoStream => {
              console.log("vide user", userVideoStream);
              this.addVideoStream(video, userVideoStream);
            });
          });
        });
    },

    videoScreen() {
      this.myPeer = new Peer(undefined);
      this.myPeer.on("open", id => {
        this.joinDetails.userId = id;
        this.socket.emit("joinRoom", this.joinDetails);
      });
      let vm = this;
      let myVideo = document.createElement("video");
      myVideo.classList.add(...this.classesToAdd);
      if (this.mode === "camera") {
        // Request screen share, note we dont want to capture audio
        // as we already have the stream from the Webcam
        // this.stream.getTracks().forEach(track => track.stop())
        navigator.mediaDevices
          .getDisplayMedia({
            video: true,
            audio: false
          })
          .then(function(stream) {
            // Close allow screenshare snackbar
            vm.mode = "screen";
            stream;
            vm.addVideoStream(myVideo, stream);
            vm.myPeer.on("call", call => {
              call.answer(stream);
              const video = document.createElement("video");
              call.on("stream", userVideoStream => {
                vm.addVideoStream(video, userVideoStream);
              });
            });
          })
          .catch(function(err) {
            console.log("err", err);
          });
        // If mode is screenshare then switch to webcam
        // } else {
        //   // Stop the screen share track
        //   this.stream.getTracks().forEach(track => track.stop())
        //   // Get webcam input
        //   navigator.mediaDevices
        //     .getUserMedia({
        //       video: true,
        //       audio: true
        //     })
        //     .then(function(stream) {
        //       this.mode = 'camera'
        //       this.stream = stream
        //       this.addVideoStream(this.myVideo, this.stream)
        //       this.myPeer.on('call', call => {
        //         call.answer(this.stream)
        //         const video = document.createElement('video')
        //         call.on('stream', userVideoStream => {
        //           this.addVideoStream(video, userVideoStream)
        //         })
        //       })
        //     })
      }
    },
    // Swap current video track with passed in stream
    switchStreamHelper(stream) {
      // Get current video track
      let videoTrack = stream.getVideoTracks()[0];
      // Add listen for if the current track swaps, swap back
      videoTrack.onended = function() {
        this.swap();
      };
      if (this.VideoChat.connected) {
        // Find sender
        const sender = this.VideoChat.peerConnection
          .getSenders()
          .find(function(s) {
            // make sure tack types match
            return s.track.kind === videoTrack.kind;
          });
        // Replace sender track
        sender.replaceTrack(videoTrack);
      }
      // Update local video stream
      this.VideoChat.localStream = videoTrack;
      // Update local video object
      this.VideoChat.localVideo.srcObject = stream;
      // Unpause video on swap
      if (this.videoIsPaused) {
        this.pauseVideo();
      }
    },
    muteMicrophone() {
      this.stream.getAudioTracks()[0].enabled = !this.stream.getAudioTracks()[0]
        .enabled;
    },
    videoSwitch() {
      this.stream.getVideoTracks()[0].enabled = !this.stream.getVideoTracks()[0]
        .enabled;
    },
    videoLoad() {
      this.videoGrid = document.getElementById("video-grid");
      this.myVideo = document.createElement("video");
      this.myVideo.muted = true;
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(stream => {
          this.myStream = { ...this.joinDetails, stream: stream };
          this.addVideoStream(this.myVideo, stream);
          this.socket.emit("sendStream", this.myStream);
        });
      this.videoGrid = document.getElementById("video-grid");
      this.myVideo = document.createElement("video");
      this.myVideo.muted = true;
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(stream => {
          this.stream = stream;
          this.addVideoStream(this.myVideo, stream);
          this.myPeer.on("call", call => {
            call.answer(stream);
            const video = document.createElement("video");
            call.on("stream", userVideoStream => {
              this.addVideoStream(video, userVideoStream);
            });
          });
        });
    },
    connectToNewUser(userId, stream) {
      const call = this.myPeer.call(userId, stream);
      const video = document.createElement("video");

      call.on("stream", userVideoStream => {
        this.addVideoStream(video, userVideoStream);
      });
      call.on("close", () => {
        video.remove();
      });
    },
    addVideoStream(video, stream) {
      video.style.width = "150px";
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        video.play();
      });
      this.videoGrid.append(video);
    },
    // addVideoStream(video, stream) {
    //   video.srcObject = stream
    //   video.addEventListener('loadedmetadata', () => {
    //     video.play()
    //   })
    //   this.videoGrid.append(video)
    //   this.joinDetails.stream = stream
    //   this.joinRoom()
    // },
    updateUsers(resp) {
      console.log("update new user");
      this.users.push(resp);
      this.connectToNewUser(resp.userId, this.stream);
    },
    messageSend() {
      this.messageInfo = {
        message: this.message,
        roomId: this.joinDetails.roomId
      };
      this.messageSent();
    },
    receive(resp) {
      this.messages.push(resp);
    }
  }
};
</script>

<style>
#video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 300px;
}
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mic-btn {
  position: fixed;
  top: 26%;
  right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  z-index: 50000;
}

.video-btn {
  position: fixed;
  top: 18%;
  right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  z-index: 50000;
}

.videoshow-btn {
  position: fixed;
  top: 34%;
  right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  z-index: 50000;
}
</style>
