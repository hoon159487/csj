<template>
  <div class="map_wrapper">
    <div class="map" id="map"></div>
  </div>
</template>

<script>
export default {
  props: ["apikey"],
  data() {
    return {
      // option: {
      //   center: {
      //     lat: 37.5642135,
      //     lng: 127.0016985,
      //   },
      // },
      center: {
        lat: 37.5642135,
        lng: 127.0016985,
      },
      level: 5,
      option: {},
      map: null,
    };
  },
  methods: {
    getSWNEBounds() {
      let bounds = this.map.getBounds();
      return {
        sw: bounds.getSouthWest(),
        ne: bounds.getNorthEast(),
      };
    },
  },
  mounted: async function () {
    console.log(this.test);
    const script = document.createElement("script");
    /* global kakao */
    script.onload = () => kakao.maps.load(this.initMap);
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${this.apikey}&libraries=services`;
    document.head.appendChild(script);

    var container = document.getElementById("map");
    var options = {
      center: new kakao.maps.LatLng(this.center.lat, this.center.lng),
      level: this.level,
    };

    this.map = new kakao.maps.Map(container, options);
  },
};
</script>

<style>
#map {
  width: 500px;
  height: 400px;
}
</style>