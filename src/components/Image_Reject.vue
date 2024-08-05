<template>
  <div class="glass_pop_wrapper">
    <div v-if="reject_flag">
      <div class="glass_pop_blocker"></div>
      <div class="glass_pop">
        <p class="pop_title">해당 이미지에 문제가 있을 경우에만 제출 해 주세요</p>
        <p>현재 상태 :
          <span v-if="is_reject == 1" class="co_state3">오류</span>
          <span v-else-if="is_reject == 0" class="co_state1">정상</span>
        </p>
        <!-- <p v-if="qna == 'q'">※20개의 질문이 온전히 등록된 경우에만 오류체크할 수 있습니다.</p>
        <span>질문측 오류 사유</span>
        <input type="text" class="inputbox" id="reject_etc_q" placeholder="질문측 오류 사유"
          v-model="reject_info.qc_reject_reason" :readonly="qna != 'q'" />
        <span>답변측 오류 사유</span>
        <input type="text" class="inputbox" id="reject_etc_a" placeholder="답변측 오류 사유"
          v-model="reject_info.ac_reject_reason" :readonly="qna != 'a' && qna != 'aa'" />
        <br />
        <div>
          <input type="checkbox" name="rejects" id="reject1" :checked="rejects.poi" @change="reject_select('poi')">
          <label for="reject1">POI 오류</label>&nbsp;&nbsp;
          <input type="checkbox" name="rejects" id="reject2" :checked="rejects.triple"
            @change="reject_select('triple')">
          <label for="reject2">트리플 오류</label>&nbsp;&nbsp;
          <input type="checkbox" name="rejects" id="reject3" :checked="rejects.qna" @change="reject_select('qna')">
          <label for="reject3">Q&A 오류</label>&nbsp;&nbsp;
          <input type="checkbox" name="rejects" id="reject4" :checked="rejects.image" @change="reject_select('image')">
          <label for="reject4">이미지 오류</label>
        </div> -->
        <!-- <p>※최종 수정에 할당된 POI는 오류제출과 해제를 할 수 없습니다.</p> -->
        <div class="glass_pop_btns">
          <!-- <a class="btn bg3 mgT10" @click="reject_submit2(1)">기능체크</a> -->
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
      reject_etc: "",
      reject_info: {},
      rejects: {
        "poi": false,
        "triple": false,
        "qna": false,
        "image": false,
      },
      is_reject: 0,
      ino: -1,
    };
  },
  methods: {
    toggle() {
      this.$emit("reject_flag", false);
    },
    // reject_select(cate) {
    //   this.rejects[cate] = !this.rejects[cate];
    // },
    reject_submit(is_reject) {
      let check = false;

      if (is_reject == 1) {
        if(confirm("오류체크 하시겠습니까?")) check = true;
      }else{
        if(confirm("오류체크를 해제하시겠습니까?")) check = true;
      }

      if (check) {
        axios({
          url: config.apiurl + "?part=image&mode=image_edit_set_reject",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          method: "POST",
          data: {
            token: this.$store.state.token,
            is_reject: is_reject,
            ino: this.ino,
          },
        }).then((response) => {
          console.log(response.data);
          if (is_reject == 1) {
            alert("오류체크 되었습니다.");
          } else {
            alert("오류체크가 해제되었습니다.");
          }
          this.$emit('close');
          this.$emit('reload');
        }).catch(function (error) {
          alert("오류가 발생했습니다...(1)");
          console.log("에러야!");
          console.log(error);
        });
      }
    },
    load_reject: function (ino) {
      this.ino = ino;
      axios({
        url: config.apiurl + "?part=image&mode=image_edit_get_reject_info",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
        data: {
          token: this.$store.state.token,
          ino: this.ino,
        },
      })
        .then((response) => {
          let d = response.data;
          console.log(d);
          this.is_reject = d.is_reject;
        })
        .catch(function (error) {
          alert("ERROR : cannot get qna reject infos");
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
  height: 140px;
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