<template>
  <div class="glass_pop_wrapper">
    <div v-if="reject_flag">
      <div class="glass_pop_blocker"></div>
      <div class="glass_pop">
        <p class="pop_title">해당 POI에 문제가 있을 경우에만 제출 해 주세요</p>
        <p v-if="qna == 'q'">※20개의 질문이 온전히 등록된 경우에만 오류체크할 수 있습니다.</p>
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
        </div>
        <!-- <p>※최종 수정에 할당된 POI는 오류제출과 해제를 할 수 없습니다.</p> -->
        <div class="glass_pop_btns">
          <!-- <a class="btn bg3 mgT10" @click="reject_submit2(1)">기능체크</a> -->
          <template v-if="(is_final == false)">
            <a class="btn bg3 mgT10" @click="reject_submit2(1)">오류제출</a>
            <a class="btn bg1 mgT10" @click="reject_submit2(0)">오류해제</a>
          </template>
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
  props: ["reject_flag", "qna"],
  data: function () {
    return {
      qna_no: -1,
      reject_etc: "",
      reject_info: {},
      item_count: 0,
      item_count_a: 0,
      rejects: {
        "poi": false,
        "triple": false,
        "qna": false,
        "image": false,
      },
      is_final: false,
    };
  },
  methods: {
    toggle() {
      this.$emit("reject_flag", false);
    },
    reject_select(cate) {
      this.rejects[cate] = !this.rejects[cate];
    },
    reject_submit2(is_reject) {
      if (this.qna == 'q' && this.item_count < 20) {
        alert("질문이 20개가 아닌 POI는 오류를 체크할 수 없습니다.");
      }
      else if ((this.qna == 'aa' || this.qna == 'a') && this.item_count_a < 20) {
        alert("답변이 20개가 아닌 POI는 오류를 체크할 수 없습니다.");
      }
      else
        // if (this.reject_info.reject_reason == "") {
        //   alert("오류 사유를 입력 해 주세요.");
        // }
        // else
        if (this.rejects['poi'] == false &&
          this.rejects['triple'] == false &&
          this.rejects['qna'] == false &&
          this.rejects['image'] == false) {
          alert("오류 항목을 최소 1개 체크해주세요.");
        } else {
          if (confirm("오류 사유를 제출합니다.")) {
            let rr = "";
            if (this.qna == 'q') {
              rr = this.reject_info.qc_reject_reason;
            } else if (this.qna == 'a' || this.qna == 'aa') {
              rr = this.reject_info.ac_reject_reason;
            }
            axios({
              url: config.apiurl + "?part=qna&mode=qna_set_reject",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
              method: "POST",
              data: {
                token: this.$store.state.token,
                is_reject: is_reject,
                qna_no: this.qna_no,
                reject_reason: rr,
                qna: this.qna,
                rejects: this.rejects,
              },
            })
              .then((response) => {
                console.log(response.data);
                if (is_reject) {
                  alert("오류 설정 되었습니다.");
                } else {
                  alert("오류 설정 취소 되었습니다.");
                }
                this.$emit('close');

                if (this.$route.name == 'QuestionConfirmView') {
                  this.$router.push({ name: "QuestionConfirmList" });
                } else if (this.$route.name == 'AnswerConfirmView') {
                  this.$router.push({ name: "AnswerConfirmList" });
                } else if (this.$route.name == 'AnswerView') {
                  this.$router.push({ name: "AnswerList" });
                } else {
                  // location.reload();
                }

              })
              .catch(function (error) {
                alert("오류가 발생했습니다...(1)");
                console.log("에러야!");
                console.log(error);
              });

          }
        }
    },
    reject_submit(is_reject) {
      if (this.qna == 'q' && this.item_count < 20) {
        alert("질문이 20개가 아닌 POI는 오류를 체크할 수 없습니다.");
      }
      else if ((this.qna == 'aa' || this.qna == 'a') && this.item_count_a < 20) {
        alert("답변이 20개가 아닌 POI는 오류를 체크할 수 없습니다.");
      }
      else if (this.reject_info.reject_reason == "") {
        alert("오류 사유를 입력 해 주세요.");
      } else {
        if (confirm("오류 사유를 제출합니다.")) {
          let rr = "";
          if (this.qna == 'q') {
            rr = this.reject_info.qc_reject_reason;
          } else if (this.qna == 'a' || this.qna == 'aa') {
            rr = this.reject_info.ac_reject_reason;
          }
          axios({
            url: config.apiurl + "?part=qna&mode=qna_set_reject",
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            method: "POST",
            data: {
              token: this.$store.state.token,
              is_reject: is_reject,
              qna_no: this.qna_no,
              reject_reason: rr,
              qna: this.qna,
            },
          })
            .then((response) => {
              console.log(response.data);
              if (is_reject) {
                alert("오류 설정 되었습니다.");
              } else {
                alert("오류 설정 취소 되었습니다.");
              }
              this.$emit('close');

              if (this.$route.name == 'QuestionConfirmView') {
                this.$router.push({ name: "QuestionConfirmList" });
              } else if (this.$route.name == 'AnswerConfirmView') {
                this.$router.push({ name: "AnswerConfirmList" });
              } else if (this.$route.name == 'AnswerView') {
                this.$router.push({ name: "AnswerList" });
              } else {
                location.reload();
              }

            })
            .catch(function (error) {
              alert("오류가 발생했습니다...(1)");
              console.log("에러야!");
              console.log(error);
            });
        }
      }
    },
    load_reject: function (qna_no) {
      this.qna_no = qna_no;
      this.reject_info = {};
      axios({
        url: config.apiurl + "?part=qna&mode=qna_get_reject_info",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
        data: {
          token: this.$store.state.token,
          qna_no: this.qna_no,
          qna: this.qna
        },
      })
        .then((response) => {
          let d = response.data;
          console.log(d);
          this.reject_info = d.reject;
          this.item_count = d.item_count;
          this.item_count_a = d.item_count_a;
          this.rejects = d.rejects;
          this.is_final = d.is_final;
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
  height: 280px;
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