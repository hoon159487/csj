<template>
  <div id="header">
    <div class="wrap_box">
      <h1><a href="/">CJM</a></h1>
      <p v-if="info.userid != ''" class="head_name">{{ info.username }}({{ info.userid }})</p>
      <!-- <div id="lnb">
        <select id="" name="" onchange="if(this.value) location.href=(this.value);" v-model="nowLocation">
          <option value="" selected>선택하세요</option>
          <option value="/poi_list">POI 업로드</option>
          <option value="/img_list">이미지 업로드</option>
          <option value="/img_confirm_list">이미지 검수</option>
          <option value="/trans_list/en">번역 작업(영어)</option>
          <option value="/question_list">Q&A 등록</option>
        </select>
      </div> -->
      <div id="gnb2">
        <router-link v-if="info.userid != ''" :to="{ path: '/myinfo' }">회원정보 수정</router-link>
      </div>
      <div id="gnb">
        <a v-if="info.userid != ''" @click="logout()">로그아웃</a>
        <a v-else @click="login()">로그인</a>
      </div>
    </div>
  </div>
</template>

<script>
import common from "../common/common.js";
export default {
  data: function () {
    return {
      info: { userid: "", username: "", nickname: "" },
    }
  },
  methods: {
    login() {
      location.href = '/login';
    },
    logout() {
      if (confirm("로그아웃 하시겠습니까?")) {
        this.info = { userid: "", username: "", nickname: "" };
        this.$store.commit('set_token', ""); // 토큰 제거
        common.logout(this.$store.state.token);
      }
    },
  },
  computed: {
    // nowLocation: function () {
    //   let this_name = this.$route.name;
    //   let routeHelper = {
    //     // "/Login": ["Login"],
    //     // "/Mypage": ["Mypage"],
    //     "/poi_list": [
    //       "PoiList",
    //       "PoiView",
    //       "PoiEdit",
    //       "PoiCreate",
    //       // "SubView",
    //       // "SubCreate",
    //       // "SubEdit",
    //     ],
    //     "/img_list": ["ImgList", "ImgCreate", "ImgView"],
    //     "/img_confirm_list": ["ImgConfirmList", "ImgConfirmView"],
    //     // "/trans_list/en": ["TransList", "TransView"],
    //     "/question_list": ["QuestionList", "QuestionView"],
    //     // "/UserPerm": ["UserPerm"],
    //   };

    //   for (const key in routeHelper) {
    //     for (const key2 in routeHelper[key]) {
    //       if (routeHelper[key][key2] == this_name) {
    //         return key;
    //       }
    //     }
    //   }

    //   return "";
    // },
  },
  mounted: async function () {
    let user_info = await common.get_info(this.$store.state.token);
    if (user_info != undefined) {
      this.info = user_info;
      this.$store.commit('set_user_info', user_info); // 유저정보 저장
    }
  },
};
</script>


<style>
.head_name {
  color: white;
}
</style>