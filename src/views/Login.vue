<template>
  <div id="login_wrap">
    <!-- login -->
    <div id="login">
      <!-- <p class="p_desc1">Welcome to <span>CJM</span></p> -->
      <p class="p_desc2">로그인 정보를 입력해주세요.</p>
      <form action="/mypage">
        <div class="login_box">
          <ul>
            <li><input type="text" id="userid" name="userid" value="" placeholder="ID" v-on:keyup.enter="login()"></li>
            <li><input type="password" id="password" name="password" value="" placeholder="PASSWORD"
                v-on:keyup.enter="login()"></li>
            <li><input type="button" @click="login()" id="" name="" value="LOGIN"></li>
          </ul>
          <router-link :to="{ path: '/join' }" class="btn size1"> 초간단 회원가입 </router-link>
        </div>
      </form>

    </div>
    <!-- //login -->
  </div>
</template>

<script>
import axios from "axios";
import config from "../common/config.js";

export default {
  name: 'Login',
  data() {
    return {
    };
  },
  methods: {
    async login() { // 로그인
      var userid = document.querySelector('#userid').value;
      var password = document.querySelector('#password').value;

      if (userid == "" || password == "") {
        alert("아이디와 비밀번호를 모두 입력해주세요.");
      } else {
        var url = config.apiurl + '/login';

        axios({
          url: url,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          data:{
            userid:   userid,
            password: password
          }
        }).then((response) => {
          console.log(response);
          if(response.data.result == 1){
            alert("로그인되었습니다.");
            this.$store.commit('set_token', response.data.token); // 생성된 토큰 저장
            this.$router.push({ name: 'Mypage' });
          }else{
            alert("로그인에 실패했습니다.");
          }
        }).catch(function (error) {
          alert('오류가 발생했습니다...(1)');
          console.log(error);
        })
      }
    }
  },
  mounted: function () {
    this.$store.commit('set_token', "");
  }
};
</script>