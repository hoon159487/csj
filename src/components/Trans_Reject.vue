<template>
  <div class="glass_pop_wrapper">
    <div v-if="reject_flag">
      <div class="glass_pop_blocker"></div>
      <div class="glass_pop">
        <p class="pop_title">해당 POI에 문제가 있을 경우에만 제출 해 주세요</p>
        <input
          type="text"
          class="inputbox"
          id="reject_etc"
          placeholder="오류 사유"
          v-model="reject_info.reject_reason"
        />
        <br />
        <div class="glass_pop_btns">
          <a class="btn bg3 mgT10" @click="reject_submit(1)">오류제출</a>
          <a class="btn bg1 mgT10" @click="reject_submit(0)">오류해제</a>
          <a class="btn bg mgT10" @click="$emit('close')">취소</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../common/config.js";

export default {
  props: ["reject_flag"],
  data: function () {
    return {
      tno: -1,
      reject_etc: "",
      reject_info: {}
    };
  },
  methods: {
    toggle() {
      this.$emit("reject_flag", false);
    },
    reject_submit(is_reject) {
      if (this.reject_info.reject_reason == "") {
        alert("오류 사유를 입력 해 주세요.");
      } else {
        if (confirm("오류 사유를 제출합니다.")) {
          axios({
            url: config.apiurl + "?part=trans&mode=trans_set_reject",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            method: "POST",
            data: {
              token: this.$store.state.token,
              is_reject: is_reject,
              tno: this.tno,
              reject_reason: this.reject_info.reject_reason,
            },
          })
            .then((response) => {
              console.log(response.data);
              if(is_reject){
                alert("오류 설정 되었습니다.");
              } else{
                alert("오류 설정 취소 되었습니다.");
              }
              this.$emit('close');
            })
            .catch(function (error) {
              alert("오류가 발생했습니다...(6)");
              console.log("에러야!");
              console.log(error);
            });
        }
      }
    },
    load_reject: function (tno) {
      this.tno = tno;
      this.reject_info = {};
      axios({
        url: config.apiurl + "?part=trans&mode=trans_get_reject_info",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
        data: {
          token: this.$store.state.token,
          tno: this.tno,
        },
      })
        .then((response) => {
          this.reject_info = response.data.reject;
        })
        .catch(function (error) {
          alert("ERROR : cannot get trans reject infos");
          console.log(error);
        });
    },
  },
  mounted: function () {
  },
};
</script>

<style>
.glass_pop_blocker {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 10000;
}

.glass_pop {
  padding: 12px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 160px;
  box-shadow: 0 4px 8px rgba(32, 33, 36, 0.28);
  transition: 0.3s;
  border-radius: 5px;
  background: white;
  z-index: 11000;
  text-align: center;
}
.glass_pop .pop_title {
  line-height: 34px;
  font-size: 26px;
  padding: 12px 0;
  font-weight: bold;
}
.glass_pop .inputbox {
  width: 100%;
}
.glass_pop_btns {
  margin-top: 12px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  align-items: center;
}
</style>