// import axios from "axios";
const axios = require("axios");
// import config from "./config.js";

// const apiurl = "http://192.168.1.87:3000";
const apiurl = "http://localhost:3000";

module.exports = {
  check_token: (token) => { // 가지고 있는 토큰 체크
    return new Promise((resolv) => {
      // var url = 'https://cjm.cloud.olym.co.kr/api/index.php?part=util&mode=check_token';
      var url = apiurl + '/check_token';
      axios({
        url: url,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        data: {
          token: token
        }
      }).then((response) => {
        resolv(response.data.result);
      }).catch(function (error) {
        alert('오류가 발생했습니다...(1)');
        console.log(error);
      })
    });
  },
  logout: (token) => { // 로그아웃
    var url = apiurl + '/logout';
    axios({
      url: url,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      data: {
        token: token
      }
    }).then((response) => {
      if (response.data.result == 1) {
        alert("로그아웃되었습니다.");
        location.href = '/';
      } else {
        alert("로그아웃에 실패했습니다.");
      }
    }).catch(function (error) {
      alert('오류가 발생했습니다...(2)');
      console.log(error);
    })
  },
  remained_time: (expireddate) => { // 잔여시간 계산
    let a = new Date(expireddate);
    let b = new Date();

    let base = (a - b) / 1000;

    let hour = Math.floor(base / 60 / 60);
    let minute = Math.floor(base / 60 % 60);
    let second = Math.floor(base % 60);

    if (hour > 0 && hour < 10) { hour = '0' + hour.toString(); } else if (hour == 0) { hour = '00'; }
    if (minute > 0 && minute < 10) { minute = '0' + minute.toString(); } else if (minute == 0) { minute = '00'; }
    if (second > 0 && second < 10) { second = '0' + second.toString(); } else if (second == 0) { second = '00'; }

    let timestr = "";
    if (base >= 0) { timestr = hour + ":" + minute + ":" + second; }
    else { timestr = '00:00:00'; }

    return timestr;
  },
  test() {
    // location.href = '/mypage';
    // return "valval";
  },
  check_perm(token, page_perm) {
    return new Promise((resolv) => {
      var url = 'https://cjm.cloud.olym.co.kr/api/index.php?part=util&mode=check_perm';
      axios({
        url: url,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        data: {
          token: token,
          page_perm: page_perm,
        }
      }).then((response) => {
        // console.log(response.data);
        if (response.data.result == -1) {
          alert("페이지 접근 권한이 없습니다.");
          location.href = '/mypage';
        }

        resolv();
      }).catch(function (error) {
        alert('오류가 발생했습니다...(3)');
        console.log(error);
      })
    })
  },
  get_info(token) {
    return new Promise((resolv) => {
      // var url = config.apiurl + '/get_info';
      var url = apiurl + '/get_info';
      axios({
        url: url,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        data: {
          token: token,
        }
      }).then((response) => {
        resolv(response.data.user_info);
      }).catch(function (error) {
        alert('오류가 발생했습니다...(4)');
        console.log(error);
      })
    });
  },
  set_page_info(that, name, page, search, option = {}) {
    that.$store.commit('set_page', { // 페이지, 검색기록 저장
      name: name,
      page: page,
      search: search,
      option: option,
    });
  },
  reset_page_info(that) { // vuex store에 저장된 페이징 및 검색기록 초기화
    that.$store.commit('set_page', { // 페이지, 검색기록 저장
      name: "",
      page: 1,
      search: "",
      option: {},
    });
  },
  set_page(that) { // 페이지 세팅
    return new Promise((resolv) => {
      let page_info = that.$store.state.page_info;
      if (page_info.name == that.$route.name) {
        // console.log(page_info)
        that.page = page_info.page;
        that.search = page_info.search;
        if (page_info.option != {}) {
          that.page_option = page_info.option;
        }
      }
      resolv(1);
    });
  },
  isMobile() {
    return new Promise((resolv) => {
      var user = navigator.userAgent;
      var is_mobile = false;

      if (user.indexOf("iPhone") > -1 || user.indexOf("Android") > -1) {
        is_mobile = true;
      }
      resolv(is_mobile);
    })
  }
}