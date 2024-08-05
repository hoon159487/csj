<template>
  <div class="create">
    <!-- header -->
    <Header />
    <!-- /header -->
    <div id="contents_box">
      <!-- contents -->
      <div id="contents">
        <div class="view_top">
          <h2 class="h_title">
            <span>POI 업로드</span>
          </h2>
          <a href="/poi_list" class="btn size1">목록보기</a>
        </div>
        <div class="fx-1">
          <!-- table_type -->
          <div class="table_type3" @change="json_preview()">
            <table>
              <colgroup>
                <col width="20%" />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th scope="row">
                    <input value="관광타입" class="inputbox" readonly />
                  </th>
                  <td>
                    <div class="fx-2">
                      <select @change="set_type($event)" id="" name="" class="selectbox">
                        <option value="관광지">관광지</option>
                        <option value="문화시설">문화시설</option>
                        <option value="음식점">음식점</option>
                        <option value="레포츠">레포츠</option>
                        <option value="숙박">숙박</option>
                        <option value="쇼핑">쇼핑</option>
                        <option value="편의오락시설">편의오락시설</option>
                      </select>
                    </div>
                  </td>
                </tr>

                <tr v-for="t in type" :key="t">
                  <th scope="row">
                    <input v-model="t[0]" class="inputbox" readonly />
                  </th>
                  <td>
                    <div class="fx-2">
                      <!-- <input v-if="is_combine('개요', t[0]) == true" id="" name="" class="inputbox">
                      <textarea v-else id="" name="" class="textareabox"></textarea> -->
                      <div v-if="is_combine('개요', t[0]) || is_combine('소개', t[0])
                        " style="width: 100%">
                        <textarea id="" name="" class="textareabox" v-model="t[1]"></textarea>
                      </div>
                      <div v-else style="width: 100%">
                        <input id="" name="" class="inputbox" v-model="t[1]" />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <th scope="row">
                    <input v-model="addkey" type="text" class="inputbox" />
                  </th>
                  <td>
                    <div class="fx-2">
                      <input v-model="addvalue" type="text" class="inputbox" />
                      <a @click="addmeta" class="btn">추가</a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="json_box">
            json_preview<br /><br />
            <pre>{{ json }}</pre>
          </div>
        </div>
        <div class="list_bot mgT20" style="justify-content: end; gap: 5px">
          <a @click="submit()" class="btn bg1">확인</a>
        </div>
      </div>
      <!-- //contents -->
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Header from "../components/Header.vue";
import common from "../common/common.js";
import config from "../common/config.js";

export default {
  name: "QueueCreate",
  data() {
    return {
      my_mno: 0
    };
  },
  components: {
    Header,
  },
  methods: {
    async queue_create_info() {
      // 큐 생성 사전정보 조회
      axios({
        url: config.apiurl + "/queue_create_info",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        method: "post",
        data: {
          token: this.$store.state.token,
        },
      })
        .then((response) => {
          let d = response.data;
          console.log(d);
        })
        .catch(function (error) {
          alert("오류가 발생했습니다...(1)");
          console.log("에러야!");
          console.log(error);
        });
    },
    async submit() {
      // POI 생성
      var metas = this.type;
      var address = "";
      metas.push(["관광타입", this.temp_type]);

      let address_index = 0;
      for (let i = 0; i < metas.length; i++) {
        const meta = metas[i];
        if (meta[0] == "주소") {
          address_index = i;
          address = meta[1];
          break;
        }
      }

      var address_info = await this.address_search(address);

      if (address_info.address) {
        metas.splice(address_index + 1, 0, [
          "주소(지번주소)",
          address_info.address,
        ]);
      }
      if (address_info.road_address) {
        metas.splice(address_index + 1, 0, [
          "주소(도로명)",
          address_info.road_address,
        ]);
      }
      let ll = address_info.coord;

      axios({
        url: config.apiurl + "?part=poi&mode=create",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        method: "post",
        data: {
          token: this.$store.state.token,
          latlng: ll,
          metas: metas,
        },
      })
        .then(() => {
          // console.log(response);
          alert("등록되었습니다");
          this.$router.push({ name: "PoiList" });
        })
        .catch(function (error) {
          alert("오류가 발생했습니다...(1)");
          console.log("에러야!");
          console.log(error);
        });
    },
  },
  mounted: async function () {
    let token_check = await common.check_token(this.$store.state.token);
    if (token_check <= 0) {
      alert("대국 일정 추가는 로그인이 필요합니다.");
      location.href = '/login';
    } else {
      this.my_mno = token_check;
      this.queue_create_info();
    }
  },
};
</script>
