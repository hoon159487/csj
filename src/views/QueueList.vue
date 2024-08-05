<template>
  <div id="container">
    <!-- header -->
    <Header />
    <!-- /header -->
    <div id="contents_box">
      <!-- contents -->
      <div id="contents">
        <h2 class="h_title">
          <router-link :to="{ path: '/queue_list' }">대국 일정(큐) 목록</router-link>
        </h2>
        <span style="color:blue;">파란 배경 : 참가 가능</span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span style="color:red;">빨간 배경 : 참가 불가</span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span style="color:gray;">회색 배경 : 지난 일정</span>
        <div class="list_bot" style="justify-content: end; gap: 5px">
          <a @click="list_load()" class="btn bg0">목록 새로고침</a>
          <a v-if="is_my == false" @click="my_list(true)" class="btn bg2">내가 참가한 대국 보기</a>
          <a v-else @click="my_list(false)" class="btn bg2">전체 대국 보기</a>
          <router-link :to="{ path: '/queue_create' }" class="btn bg1">대국 일정 추가</router-link>
        </div>
        <!-- <div class="search_wrapper">
          <input type="text" class="inputbox" @input="doSearch" placeholder="검색어를 입력하세요." />
        </div> -->
        <!-- table_type -->
        <div class="table_type_queue mgT30">
          <table>
            <colgroup>
              <col width="5%" />
              <col width="6%" />
              <col width="10%" />
              <col width="7%" />
              <col />
              <col width="7%" />
              <col width="7%" />
              <col width="7%" />
              <col width="7%" />
              <col width="15%" />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">번호</th>
                <th scope="col">대국 형식</th>
                <th scope="col">대국 날짜</th>
                <th scope="col">주최자</th>
                <th scope="col">비고</th>
                <th scope="col">참가자1</th>
                <th scope="col">참가자2</th>
                <th scope="col">참가자3</th>
                <th scope="col">참가자4</th>
                <th scope="col">관리</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="queue_list.length == 0">
                <td colspan="10">
                  <!-- <span>{{ search_now }}로 검색된 결과가 없습니다</span> -->
                  <span>대국 일정이 없습니다.</span>
                </td>
              </tr>
              <tr v-for="( queue, index ) in  queue_list " :key="queue.no"
                :class="{ 'queue_bg_gray': queue.queue_state == -1, 'queue_bg_red': queue.queue_state == 2, 'queue_bg_blue': queue.queue_state == 1 }">
                <td>{{ queue_numbering(index) }}</td>
                <td>{{ queue.game_type }}</td>
                <td>{{ queue.game_date }}</td>
                <td :class="{ 'queue_name_bold': is_my && my_mno > 0 && queue.reg_mno == my_mno }">{{ queue.un0 }}</td>
                <td class="txL">{{ queue.desc }}</td>
                <!-- <td class="txL">{{ queue.queue_state }} / {{ queue.is_in }}</td> -->
                <td :class="{ 'queue_name_bold': is_my && my_mno > 0 && queue.mno1 == my_mno }">{{ queue.un1 }}</td>
                <td :class="{ 'queue_name_bold': is_my && my_mno > 0 && queue.mno2 == my_mno }">{{ queue.un2 }}</td>
                <td :class="{ 'queue_name_bold': is_my && my_mno > 0 && queue.mno3 == my_mno }">{{ queue.un3 }}</td>
                <td :class="{ 'queue_name_bold': is_my && my_mno > 0 && queue.mno4 == my_mno }">{{ queue.un4 }}</td>

                <td>
                  <template v-if="queue.queue_state > 0 && my_mno > 0">
                    <a v-if="queue.is_in == 0" @click="queue_join(queue.no)" class="btn size1">참가</a>
                    <a v-if="queue.is_in == 1" @click="queue_cancel(queue.no)" class="btn size1">취소</a>
                    <a v-if="queue.is_my_reg == 1" @click="queue_delete(queue.no)" class="btn size1">삭제</a>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="page_box mgT10">
          page :
          <input type="text" class="page" v-model="page" @input="paging($event, true)" />
          / {{ page_total }}
          &nbsp;
          <a @click="paging(-1)" class="btn size1">이전</a>
          &nbsp;
          <a @click="paging(1)" class="btn size1">다음</a>
        </div>
        <!-- //table_type -->
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import Header from "../components/Header.vue";
import common from "../common/common.js";
import config from "../common/config.js";

export default {
  name: "QueueList",
  data: function () {
    return {
      my_mno: this.$store.state.user_info.no,
      search: "",
      search_now: "",
      search_keyup: 0,
      search_queue: false,
      page: 1,
      page_total: 1,
      limit: 20,
      is_my: false,
      queue_num: 1,
      queue_list: [],
      submit_result: [],
      popup: {
        active: false,
        title: "Results...",
        results: [],
      },
    };
  },
  components: {
    Header,
  },
  methods: {
    doAdressSearch(e) {
      this.address_search(e.target.value);
    },
    paging(count, to = false) {
      // 리스트 페이징
      var c = 1;
      if (to) {
        c = Number(count.target.value);
      } else {
        c = this.page + count;
      }

      if (c >= 1 && c <= this.page_total) {
        this.page = c;
      }
      this.list_load();
    },
    queue_numbering(num) {
      // POI 목록 번호 세팅
      if (this.page < 1) {
        return this.queue_num - num;
      } else if (this.page >= 1 && this.page <= this.page_total) {
        return this.queue_num - (this.page - 1) * this.limit - num;
      } else {
        return this.queue_num - (this.page_total - 1) * this.limit - num;
      }
    },
    list_load() {
      this.queue_list = [];
      let search = "";
      if (this.search !== "") {
        search = this.search;
      }

      axios({
        url: config.apiurl + "/queue_list",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
        data: {
          token: this.$store.state.token,
          // search: search,
          page: this.page,
          limit: this.limit,
          is_my: this.is_my,
        },
      })
        .then((response) => {
          let d = response.data;
          console.log(d);

          this.queue_list = d.list;
          this.queue_num = d.queue_num;
          this.page_total = d.page_total;

          common.set_page_info(this, this.$route.name, this.page, search);
        })
        .catch(function (error) {
          alert("오류가 발생했습니다...(1)");
          console.log(error);
        });
    },
    list_delete(poi_no) {
      if (confirm("해당 POI를 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
        axios({
          url: config.apiurl + "?part=poi&mode=delete2",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          method: "POST",
          data: {
            token: this.$store.state.token,
            no: poi_no,
          },
        })
          .then((response) => {
            alert("삭제되었습니다.");
            console.log(response);
            this.list_load();
          })
          .catch(function (error) {
            alert("오류가 발생했습니다...(2)");
            console.log("에러야!");
            console.log(error);
          });
      }
    },
    // doSearch: function (e) {
    //   this.search = e.target.value;
    //   clearTimeout(this.search_queue);
    //   this.search_queue = setTimeout(() => {
    //     this.search_now = this.search;
    //     this.page = 1;
    //     this.list_load();
    //   }, 250);
    // },
    queue_join(queue_no) {
      // 큐 참가

      if (confirm("해당 대국에 참가하시겠습니까?")) {
        axios({
          url: config.apiurl + "/queue_join",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          method: "POST",
          data: {
            token: this.$store.state.token,
            queue_no: queue_no,
          },
        })
          .then((response) => {
            if (response.data.result < 0) {
              alert(response.data.message);
            }
            this.list_load();
          })
          .catch(function (error) {
            alert("오류가 발생했습니다...(2)");
            console.log("에러야!");
            console.log(error);
          });
      }
    },
    async my_list(toggle) {
      if (toggle) {
        let token_check = await common.check_token(this.$store.state.token);
        if (token_check <= 0) {
          alert("내가 참가한 대국 보기는 로그인이 필요합니다.");
        } else {
          this.is_my = toggle;
          this.list_load();
        }
      } else {
        this.is_my = toggle;
        this.list_load();
      }
    }
  },
  mounted: async function () {
    this.list_load();
  },
};
</script>


<style>
.search_wrapper {
  padding: 12px;
}

.page {
  width: 50px;
  border: 0;
  border-bottom: 1px red solid;
  text-align: center;
  box-sizing: border-box;
}

.page_box * {
  box-sizing: border-box;
}

.page_box {
  line-height: 18px;
}

.page_box a {
  user-select: none;
}

.queue_bg_gray {
  background-color: rgb(230, 226, 226) !important;
}

.queue_bg_red {
  background-color: rgb(236, 212, 212) !important;
}

.queue_bg_blue {
  background-color: rgb(209, 216, 250) !important;
}

.queue_bg_green {
  background-color: rgb(235, 255, 227) !important;
}

.queue_name_bold {
  font-weight: bold;
}
</style>