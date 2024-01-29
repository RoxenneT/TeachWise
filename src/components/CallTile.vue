<template>
  <main>
    <template v-if="loading">
      <div class="loading-spinner"><loading-tile /></div>
    </template>

    <template v-else>
      <div class="wrapper">
        <template v-if="error">
          <p class="error-text">{{ error }}</p>
          <button class="error-button" @click="leaveAndCleanUp">Обновить</button>
        </template>

        <template v-if="showPermissionsError">
          <permissions-error-msg :reset="leaveAndCleanUp" />
        </template>

        <template v-else>
          <div
            :class="screen ? 'tile-container' : 'tile-container full-height'"
          >
            <template v-if="screen">
              <screenshare-tile :participant="screen" />
            </template>

            <div v-if="participants" class="participants-container">
              <template v-for="p in participants" :key="p.session_id">
                <video-tile
                  :participant="p"
                  :handle-video-click="handleVideoClick"
                  :handle-audio-click="handleAudioClick"
                  :handle-screenshare-click="handleScreenshareClick"
                  :leave-call="leaveAndCleanUp"
                  :disable-screen-share="screen && !screen?.local"
                />
              </template>

              <template v-if="count === 1">
                <waiting-card :url="roomUrl" />
              </template>
            </div>
          </div>
        </template>

        <chat-tile :send-message="sendMessage" :messages="messages" />
      </div>
    </template>
  </main>
</template>

<script>
import daily from "@daily-co/daily-js";

import WaitingCard from "./WaitingCard.vue";
import ChatTile from "./ChatTile.vue";
import VideoTile from "./VideoTile.vue";
import ScreenshareTile from "./ScreenshareTile.vue";
import LoadingTile from "./LoadingTile.vue";
import PermissionsErrorMsg from "./PermissionsErrorMsg.vue";

export default {
  name: "CallTile",
  components: {
    VideoTile,
    WaitingCard,
    ChatTile,
    ScreenshareTile,
    LoadingTile,
    PermissionsErrorMsg,
  },
  props: ["leaveCall", "name", "roomUrl"],
  data() {
    return {
      callObject: null,
      participants: null,
      count: 0,
      messages: [],
      error: false,
      loading: false,
      showPermissionsError: false,
      screen: null,
    };
  },
  mounted() {
    const option = {
      url: this.roomUrl,
    };

    const co = daily.createCallObject(option);
    this.callObject = co;

    co.join({ userName: this.name });

    co.on("joining-meeting", this.handleJoiningMeeting)
      .on("joined-meeting", this.updateParticpants)
      .on("participant-joined", this.updateParticpants)
      .on("participant-updated", this.updateParticpants)
      .on("participant-left", this.updateParticpants)
      .on("error", this.handleError)
      .on("camera-error", this.handleDeviceError)
      .on("app-message", this.updateMessages);
  },
  unmounted() {
    if (!this.callObject) return;
    this.callObject
      .off("joining-meeting", this.handleJoiningMeeting)
      .off("joined-meeting", this.updateParticpants)
      .off("participant-joined", this.updateParticpants)
      .off("participant-updated", this.updateParticpants)
      .off("participant-left", this.updateParticpants)
      .off("error", this.handleError)
      .off("camera-error", this.handleDeviceError)
      .off("app-message", this.updateMessages);
  },
  methods: {
    updateParticpants(e) {
      console.log("[EVENT] ", e);
      if (!this.callObject) return;

      const p = this.callObject.participants();
      this.count = Object.values(p).length;
      this.participants = Object.values(p);

      const screen = this.participants.filter((p) => p.screenVideoTrack);
      if (screen?.length && !this.screen) {
        console.log("[SCREEN]", screen);
        this.screen = screen[0];
      } else if (!screen?.length && this.screen) {
        this.screen = null;
      }
      this.loading = false;
    },
    updateMessages(e) {
      console.log("[MESSAGE] ", e.data);
      this.messages.push(e?.data);
    },
    handleError(e) {
      console.log("[ERROR] ", e);
      this.error = e?.errorMsg;
      this.loading = false;
    },
    handleJoiningMeeting() {
      this.loading = true;
    },
    handleAudioClick() {
      const audioOn = this.callObject.localAudio();
      this.callObject.setLocalAudio(!audioOn);
    },
    handleVideoClick() {
      const videoOn = this.callObject.localVideo();
      this.callObject.setLocalVideo(!videoOn);
    },
    handleDeviceError() {
      this.showPermissionsError = true;
    },
    handleScreenshareClick() {
      if (this.screen?.local) {
        this.callObject.stopScreenShare();
        this.screen = null;
      } else {
        this.callObject.startScreenShare();
      }
    },
    sendMessage(text) {
      const local = this.callObject.participants().local;
      const message = { message: text, name: local?.user_name || "Guest" };
      this.messages.push(message);
      this.callObject.sendAppMessage(message, "*");
    },
    leaveAndCleanUp() {
      if (this.screen?.local) {
        this.callObject.stopScreenShare();
      }
      this.callObject.leave().then(() => {
        this.callObject.destroy();

        this.participantWithScreenshare = null;
        this.screen = null;
        this.leaveCall();
      });
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Ropa+Sans&display=swap");
main {
  font-family: "Ropa Sans", sans-serif;
  height: 100%;
  position: relative;
}
.wrapper {
  max-width: 1200px;
  margin: auto;
  padding: 0 16px;
  height: 643px;
}
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.tile-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.participants-container {
  display: flex;
  margin: 0 -20px;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
  height: 50%;
  height: inherit;
}
p {
  color: white;
}
.error-text {
  color: #e71115;
}
.full-height {
  height: 100%;
}
.error-button {
  color: #fff;
  background-color: #121a24;
  border: none;
  font-size: 12px;
  border: 1px solid #2b3f56;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
}

@media (max-width: 1390px) {
  .participants-container {
  flex-direction: column;
  min-height: 50%;
  max-height: fit-content;
}
}
</style>
