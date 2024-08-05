<template>
  <div class="create">
    <!-- header -->
    <Header />
    <!-- /header -->
    <div id="contents_box">
      <!-- contents -->
      <div id="contents">
        <div class="view_top">
          <h2 class="h_title">
            도미니언
            (방번호 : {{ queue_no }})
          </h2>
          <router-link to="/dominion" class="btn size1">나가기</router-link>
        </div>
        <div class="fx-1">
          <!-- table_type -->
          <div class="json_box">
            <button @click="disconnect" v-if="status === 'connected'">연결끊기</button>
            <button @click="connect" v-if="status === 'disconnected'">채팅 연결</button> {{ status }}
            <br /><br />
            <div v-if="status === 'connected'">
              <form @submit.prevent="sendMessage" action="#">
                <input v-model="message"><button type="submit">메세지 전송</button>
              </form>
            </div>
          </div>
          <div class="json_box">
            <!-- <pre>{{ json }}</pre> -->
            <ul id="logs">
              <li v-for="log in logs" class="log" :key="log">
                {{ log.event }}: {{ log.data }}
              </li>
            </ul>
          </div>
        </div>
        <div class="list_bot mgT20" style="justify-content: end; gap: 5px">
        </div>
      </div>
      <!-- //contents -->
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Header from "../components/Header.vue";
// import common from "../common/common.js";
import config from "../common/config.js";

export default {
  name: "DominionView",
  data() {
    return {
      my_mno: 0,
      queue_no: 0,
      logs: [],
      status: "disconnected",
      message: "",
    };
  },
  components: {
    Header,
  },
  methods: {
    async queue_create_info() {
      // 큐 생성 사전정보 조회
      axios({
        url: config.apiurl + "/queue_create_info",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        method: "post",
        data: {
          token: this.$store.state.token,
        },
      })
        .then((response) => {
          let d = response.data;
          console.log(d);
        })
        .catch(function (error) {
          alert("오류가 발생했습니다...(1)");
          console.log("에러야!");
          console.log(error);
        });
    },
    connect() {
      this.socket = new WebSocket("wss://echo.websocket.org");
      this.socket.onopen = () => {
        this.status = "connected";
        // this.logs.push({ event: "연결 완료: ", data: 'wss://echo.websocket.org' })


        this.socket.onmessage = ({ data }) => {
          this.logs.push({ event: "메세지 수신", data });
        };
      };
    },
    disconnect() {
      this.socket.close();
      this.status = "disconnected";
      this.logs = [];
    },
    sendMessage(e) {
      e;
      this.socket.send(this.message);
      // this.logs.push({ event: "메시지 전송", data: this.message });
      this.message = "";
    }
  },
  mounted: async function () {

    this.queue_no = this.$route.params.queue_no;
  },
};
</script>
