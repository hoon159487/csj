<template>
  <div id="container">
    <!-- header -->
    <Header />
    <!-- /header -->
    <div id="contents_box">
      <!-- contents -->
      <div id="contents" class="wrap_box">
        <!-- <h2 class="h_title">참여중인 프로젝트({{ page_num }})</h2> -->
        <div class="project_list">
          <template v-for="pagegroup in pages" :key="pagegroup">
            <!-- <template v-if="pagegroup.active"> -->
            <template v-if="true">
              <span class="h_title">{{ pagegroup.name }}</span>

              <ul id="pages">
                <template v-for="page in pagegroup.list" :key="page">
                  <!-- <li v-if="check_perm(page.permno)"> -->
                  <li v-if="true">
                    <a :href="page.link"><img :src="page.img" alt="" />
                      <p>
                        {{ page.name }}
                        <i :class="page.icon_class"></i>
                      </p>
                    </a>
                  </li>
                </template>
              </ul>

            </template>
          </template>
        </div>
      </div>
      <!-- //contents -->
    </div>
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import axios from "axios";
import common from "../common/common.js";
import config from "../common/config.js";

export default {
  name: "Mypage",
  data() {
    return {
      pages: [
        {
          name: "미니게임",
          active: true,
          list: [
            {
              permno: [""],
              name: "도미니언",
              link: "/dominion",
              img: "/design/com/img_pd9.png",
              icon_class: "fa-solid fa-eye",
            },
          ]
        },
        // {
        //   name: "일정",
        //   active: true,
        //   list: [
        //     {
        //       permno: [""],
        //       name: "대국 일정 (큐 잡기)",
        //       link: "/queue_list",
        //       img: "/design/com/img_pd9.png",
        //       icon_class: "fa-solid fa-eye",
        //     },
        //   ]
        // },
        // {
        //   name: "기록 및 순위",
        //   active: true,
        //   list: [
        //     {
        //       permno: [""],
        //       name: "순위(다승, 국수, 12위률, 승률)",
        //       link: "/rank_list",
        //       img: "/design/com/img_pd9.png",
        //       icon_class: "fa-solid fa-eye",
        //     },
        //     {
        //       permno: [""],
        //       name: "기간별 경기 기록",
        //       link: "/game_list",
        //       img: "/design/com/img_pd9.png",
        //       icon_class: "fa-solid fa-eye",
        //     },
        //     {
        //       permno: [""],
        //       name: "내 경기 기록",
        //       link: "/game_list_my",
        //       img: "/design/com/img_pd9.png",
        //       icon_class: "fa-solid fa-eye",
        //     },
        //   ]
        // },
        // {
        //   name: "기록 입력",
        //   active: true,
        //   list: [
        //     {
        //       permno: [""],
        //       name: "경기 입력",
        //       link: "/game_record_list",
        //       img: "/design/com/img_pd9.png",
        //       icon_class: "fa-solid fa-eye",
        //     },
        //     {
        //       permno: [""],
        //       name: "역만 입력",
        //       link: "/yakuman_record_list",
        //       img: "/design/com/img_pd9.png",
        //       icon_class: "fa-solid fa-eye",
        //     },
        //   ]
        // },
        // {
        //   name: "게시판",
        //   active: true,
        //   list: [
        //     {
        //       permno: [""],
        //       name: "공지사항",
        //       link: "/notice",
        //       img: "/design/com/img_pd9.png",
        //       icon_class: "fa-solid fa-eye",
        //     },
        //     {
        //       permno: [""],
        //       name: "이벤트",
        //       link: "/event",
        //       img: "/design/com/img_pd9.png",
        //       icon_class: "fa-solid fa-eye",
        //     },
        //   ]
        // },
        // {
        //   name: "관리",
        //   active: true,
        //   list: [
        //     {
        //       permno: [""],
        //       name: "유저 관리",
        //       link: "/user_list",
        //       img: "/design/com/img_pd9.png",
        //       icon_class: "fa-solid fa-eye",
        //     },
        //   ]
        // },
      ],
      myperm: ["1001", "1002"], // 내 권한
      page_num: 0, // 내 페이지 갯수
    };
  },
  components: {
    Header,
  },
  methods: {
    check_mypage() {
      axios({
        url: config.apiurl + "?part=util&mode=check_mypage",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
        data: {
          token: this.$store.state.token,
        },
      }).then((response) => {
        let d = response.data;
        if (d.superAdmin == 1) {
          this.set_admin();
        } else {
          this.myperm = d.perm_list;
          this.set_page();
        }
        this.page_count();
      }).catch(function (error) {
        alert("오류가 발생했습니다...(1)");
        console.log("에러야!");
        console.log(error);
      });
    },
    check_perm(permno) {
      let check = permno.filter((x) => this.myperm.includes(x));
      if (check.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    set_admin() {
      let admin_page = [];
      this.pages.forEach((pagegroup) => {
        pagegroup.list.forEach((page) => {
          page.permno.forEach((permno) => {
            admin_page.push(permno);
          });
        });
      });
      this.myperm = admin_page;
    },
    page_count() {
      var count = 0;
      this.pages.forEach((pagegroup) => {
        pagegroup.list.forEach((page) => {
          let check = page.permno.filter((x) => this.myperm.includes(x));
          if (check.length > 0) {
            count++;
          }
        });
      });
      this.page_num = count;
    },
    set_page() { // 내 권한이 포함되지 않은 영역은 비활성화
      this.pages.forEach((pagegroup) => {
        let check = false;
        pagegroup.list.forEach((page) => {
          page.permno.forEach((permno) => {
            if (this.myperm.indexOf(permno) !== -1) {
              check = true;
            }
          });
        });

        pagegroup.active = check;
      });
    },
  },
  mounted: function () {
    // this.check_mypage();
    common.reset_page_info(this);
  },
};
</script>
