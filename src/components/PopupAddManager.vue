<template>
  <div class="popup_wrapper" :class="{ active: active }">
    <div class="blocker"></div>
    <div class="popup">
      <h3>매니저 추가</h3>
      <input type="text" class="inputbox" @input="doSearch2" placeholder="매니저를 검색하고 추가를 원하시는 분의 이름(아이디)를 클릭하고 확정해주세요." />
      <!-- <a @click="dosearch2()" class="btn">검색</a> -->
      <div class="result_wrapper">
        <ul v-if="search_now != '' && worker_list.length == 0">[{{ search_now }}] 로 검색한 결과가 없습니다.</ul>
        <ul>
          <li v-for="w in worker_list" :key="w">
            <a class="add_worker_a" @click="add_worker(w.mno, w.permno, w.username)">
              <span>{{  (w.permno == 411 || w.permno == 421 || w.permno == 431 || w.permno == 441) ? "관리자" : "매니저"  }}
                :</span>
              {{  w.permno  }}
              {{  w.username  }}({{  w.userid  }})</a>
          </li>
        </ul>
      </div>
      <div class="btn_wrapper">
        <ul>
          <li><a class="btn" @click="$emit('close:popup', false)">확인</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../common/config.js";

export default {
  data: function () {
    return {
      search: "",
      search_now: "",
      search_queue: false,
      worker_list: [],
      permno_ex: [411, 421, 431, 441],
      permno_ma: [412, 422, 432, 442],
    };
  },
  props: ["active", "gno", "permno"],
  methods: {
    load() {
      let search = "";
      if (this.search != "") {
        search = this.search;
      }
      axios({
        url: config.apiurl + "?part=group&mode=group_view_add",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
        data: {
          token: this.$store.state.token,
          permno: this.permno,
          gno: this.gno,
          lan: this.$route.params.lan,
          search: search,
        },
      })
        .then((response) => {
          let d = response.data;
          // console.log(d);
          this.worker_list = d.list;
        })
        .catch(function (error) {
          alert("오류가 발생했습니다...(1)");
          console.log("에러야!");
          console.log(error);
        });
    },
    doSearch2(e){
      this.search = e.target.value;
      clearTimeout(this.search_queue);
      this.search_queue = setTimeout(() => {
        this.search_now = this.search;
        this.load();
      }, 250);
    },
    add_worker(mno, permno, username) {
      permno = Number(permno);
      let role = 2;
      if (this.permno_ex.indexOf(permno) > -1) role = 3;
      else if (this.permno_ma.indexOf(permno) > -1) role = 2;
      if (confirm(username + " 매니저(관리자)를 추가하시겠습니까?")) {
        axios({
          url: config.apiurl + "?part=group&mode=group_view_worker_add",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          method: "POST",
          data: {
            token: this.$store.state.token,
            mno: mno,
            gno: this.gno,
            role: role,
          },
        }).then(() => {
          this.load();
        }).catch(function (error) {
          alert("오류가 발생했습니다...(2)");
          console.log("에러야!");
          console.log(error);
        });
      }
    },
  },
  mounted: function () {

  },
};
</script>

<style>
.popup_wrapper a {
  color: black;
}

.popup_wrapper * {
  box-sizing: border-box;
}

.popup_wrapper.active .blocker {
  display: block;
}

.popup_wrapper .blocker {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  display: none;
}

.popup_wrapper.active .popup {
  display: block;
}

.popup_wrapper .popup {
  display: none;
  flex-direction: column;
  align-content: center;
  justify-content: space-evenly;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: white;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
  transition: 0.3s;
  border-radius: 5px;
  padding: 24px;
}

.popup h3 {
  font-size: 32px;
  text-align: center;
  height: 10%;
}

.popup .result_wrapper {
  height: 72%;
  padding: 10px 0;
  overflow-y: scroll;
  margin-top: 3%;
}

.popup .btn_wrapper ul {
  text-align: center;
  display: flex;
  justify-content: center;
}

.popup .btn_wrapper li {
  margin: 0 10px;
}


.result_wrapper li {
  padding: 2px 0;
}

.result_wrapper li::before {
  content: " · ";
}

.add_worker_a {
  cursor: pointer;
}
</style>