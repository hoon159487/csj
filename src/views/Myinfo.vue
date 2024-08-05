<template>
  <div>
    <!-- login -->
    <div id="login">
      <p class="h_title">회원 정보 수정</p>
      <div class="login_box">
        <ul>
          <li>ID : {{ form.userid }}</li>
          <li><input type="username" v-model="form.username" placeholder="이름"></li>
          <li><input type="password" v-model="form.password" placeholder="비밀번호"></li>
          <li><input type="password" v-model="form.password2" placeholder="비밀번호 확인"></li>
          <li><input type="text" v-model="form.tel" placeholder="연락처( -를 포함해서 입력 )"></li>
          <li><input type="button" @click="submit()" id="" name="" value="수정하기"></li>
          <li><a @click="$router.back()" class="btn size1">뒤로가기</a></li>
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
      form: {
        username: "",
        userid: "",
        password: "",
        password2: "",
        tel: "",
      }
    };
  },
  methods: {
    get_myinfo() {
      var url = 'https://cjm.cloud.olym.co.kr/api/index.php?part=util&mode=myinfo_data';
      axios({
        url: url,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        data: {
          token: this.$store.state.token,
        }
      }).then((response) => {
        console.log(response.data);
        this.form = response.data.form;
      }).catch(function (error) {
        alert('오류가 발생했습니다...(1)');
        console.log(error);
      })
    },
    submit() { // 회원수정 폼 보내기
      if(this.form.password != this.form.password2){
        alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      }else{
        if(confirm("회원정보를 수정하시겠습니까?")){
          axios({
            url: 'https://cjm.cloud.olym.co.kr/api/index.php?part=util&mode=myinfo_submit',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
            method: 'POST',
            data: {
              token: this.$store.state.token,
              form: this.form,
            }
          }).then((response) => {
            console.log(response.data);
            if (response.data.result == 1) {
              alert("수정이 완료되었습니다. 마이페이지 화면으로 이동합니다.");
              this.$router.push({ name: 'Mypage' });
            } else {
              alert("회원수정에 실패했습니다. 관리자에게 문의해주세요.");
            }
          }).catch(function (error) {
            alert('오류가 발생했습니다...(2)');
            console.log(error);
          })
        }
      }
    },
  },
  mounted: function () {
    this.get_myinfo();
  }
};
</script>