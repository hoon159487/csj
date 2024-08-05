<template>
  <div id="login_wrap">
    <!-- login -->
    <div id="login">
      <p class="p_desc1">Welcome to <span>CJM</span></p>
      <p class="p_desc2">회원가입 정보를 입력해주세요.</p>
      <div class="login_box">
        <ul>
          <li><input type="text" v-model="form.userid" placeholder="아이디"></li>
          <li><input type="text" v-model="form.username" placeholder="이름"></li>
          <li><input type="text" v-model="form.nickname" placeholder="닉네임"></li>
          <li><input type="password" v-model="form.password" placeholder="비밀번호"></li>
          <!-- <li><input type="text" v-model="form.tel" placeholder="연락처( -를 포함해서 입력 )"></li> -->
          <!-- <li>
            <select name="" id="" class="selectbox" v-model="form.perm">
              <option value="" disabled>작업 역할을 선택해주세요</option>
              <option v-for="r in perm" :key="r" v-bind:value="r.value">
                {{ r.desc }}
              </option>
            </select>
          </li>

          <li>
            <select name="" id="" class="selectbox" v-model="form.cno">
              <option value="" disabled>소속 그룹을 선택해주세요</option>
              <option v-for="c in class_" :key="c" v-bind:value="c.value">
                {{ c.desc }}
              </option>
            </select>
          </li> -->

          <li><input type="button" @click="join()" id="" name="" value="가입하기"></li>
          <li>
            <router-link :to="{ path: '/login' }" class="btn size1"> 뒤로가기 </router-link>
          </li>
        </ul>
      </div>
    </div>
    <!-- //login -->
  </div>
</template>

<script>
import axios from "axios";
// import common from "../common/common.js"

export default {
  name: 'Login',
  data() {
    return {
      perm: [],
      class_: [],
      form: {
        userid: "",
        username: "",
        nickname: "",
        password: "",
        // tel: "",
        // perm: "",
        // cno: "",
      }
    };
  },
  methods: {
    // perm_info_load() { // DB로부터 작업 역할 선택 정보 리스트 가져오기
    //   var url = 'https://cjm.cloud.olym.co.kr/api/index.php?part=util&mode=join_perm';
    //   axios({
    //     url: url,
    //     headers: {
    //       'Access-Control-Allow-Origin': '*',
    //       'Content-Type': 'application/json',
    //     },
    //     method: 'POST',
    //     data: {}
    //   }).then((response) => {
    //     console.log(response.data);
    //     this.perm = response.data.perm;
    //     this.class_ = response.data.class;
    //   }).catch(function (error) {
    //     alert('오류가 발생했습니다...(1)');
    //     console.log(error);
    //   })
    // },
    async join() { // 회원가입 폼 보내기
      let idcheck = await this.idcheck();
      if (!idcheck) {
        alert("중복된 아이디입니다.");
      } else {
        if (Object.values(this.form).indexOf('') != -1) {
          alert("가입정보를 모두 입력해주세요.");
        } else {
          var url = 'https://cjm.cloud.olym.co.kr/api/index.php?part=util&mode=join';
          axios({
            url: url,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            method: 'POST',
            data: {
              form: this.form,
            }
          }).then((response) => {
            console.log(response);
            if (response.data.result == 1) {
              alert("회원가입이 완료되었습니다. 로그인 화면으로 이동합니다!");
              this.$router.push({ name: 'Login' });
            } else {
              alert("회원가입에 실패했습니다.");
            }
          }).catch(function (error) {
            alert('오류가 발생했습니다...(2)');
            console.log(error);
          })
        }
      }
    },
    idcheck() { // 아이디 중복체크
      return new Promise((resolv) => {
        var userid = this.form.userid;
        if (userid == "") {
          alert("아이디를 입력해주세요.");
        } else {
          var url = 'https://cjm.cloud.olym.co.kr/api/index.php?part=util&mode=join_idCheck';
          axios({
            url: url,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            method: 'POST',
            data: {
              userid: userid
            }
          }).then((response) => {
            console.log(response);
            if (response.data.result == 1) {
              resolv(true);
            } else {
              resolv(false);
            }
          }).catch(function (error) {
            alert('오류가 발생했습니다...(3)');
            console.log(error);
            this.userid_confirm = false;
          })
        }
      });
    },
    reset_userid() {
      this.userid_confirm = false;
      this.userid_result = "";
      this.form.userid = "";
    },
  },
  mounted: function () {
    this.perm_info_load();
  }
};
</script>

<style>
.selectbox {
  height: 60px;
  padding: 0 30px;
}
</style>