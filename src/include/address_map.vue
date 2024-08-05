<template>
  <div class="map_modal" v-show="visible" @click.self="close_map">
    <div class="map_modal__dialog">
      <header class="map_modal__header">
        <span>지도 보기</span>
      </header>
      <div class="map_modal__body">
        <span>{{ address }}</span>
        <!-- <slot></slot> -->

        <div id="map" style="border:solid 1px red;"></div>

      </div>
      <button id="closeBtn"  @click="$emit('update:visible', !visible)">닫기</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'map_modal',
  data(){
    return {
      map:""
    }
  },
  props: {
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    address: {
      type: String,
      require : true,
      default: ""
    },
    width: {
        type: Number,
        default: 400
    },
    height: {
        type: Number,
        default: 300
    },
    center: {
        type: Array,
        required: true,
    },
  },
  watch:{
    visible:function(){
      if(this.visible){
        this.address_search(this.address);
      }
    }
  },
  methods: {
    close_map(){ // 지도 닫기
      this.$emit('update:visible', false)
    },
    initMap() { // 지도 init
      var container = document.getElementById("map");
      var options = {
        center: new kakao.maps.LatLng(this.center[0], this.center[1]),
        level: 5,
      };

      this.map = new kakao.maps.Map(container, options);

    }, // 주소로 좌표 찾기 + 마커표시
    async address_search(address){
      var map = this.map;
      var geocoder = new kakao.maps.services.Geocoder();

      var callback = function(result, status) {
        return new Promise((resolv) => {
          if (status === kakao.maps.services.Status.OK) {
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            console.log("해당 좌표 : " + result[0].y + ", " + result[0].x);

            var marker = new kakao.maps.Marker({
                position: coords
            });

            marker.setMap(map);

            resolv(map.setCenter(coords));
          }else{
            console.log("좌표 없음");
          }
        })
      };

      await geocoder.addressSearch(address, callback);
      map.relayout();
    },
  },
  mounted:function(){
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=6d213af40222b5124ab4c81049cb37c4&libraries=services";
      document.head.appendChild(script);
    }
  }
}
</script>

<style lang="scss">
$module: 'map_modal';
.#{$module} {
  // This is modal bg
  background-color: rgba(0,0,0,.7);
  top: 0; right: 0; bottom: 0; left: 0;
  position: fixed;
  overflow: auto;
  margin: 0;
  //This is modal layer
  &__dialog{
    left: 50%;
    top: 75px;
    width: 600px;
    position: absolute;
    background: #fff;
    margin-bottom: 50px;
  }

  &__header {
    font-size: 28px;
    font-weight: bold;
    line-height: 1.29;
    padding: 16px 16px 0 25px;
    position: relative;
  }
  &__body {
    padding: 25px;
    min-height: 150px;
    max-height: 412px;
    // overflow-y: scroll;
  }
}

#closeBtn{
  width:50px;
  margin:auto;
  display:block;
}

// #map{
//   width: 500px;
//   height: 400px;
// }

</style>