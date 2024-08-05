<template>
  <div class="popup_wrapper" :class="{ active: active }">
    <div class="blocker"></div>
    <div class="popup">
      <h3>{{ title }}</h3>
      <div class="result_wrapper">
        <ul>
          <li
            v-for="result in results.slice().reverse()"
            :key="result.no"
            :class="[result.result=='실패' ? 'error' : '']"
          >
            {{ result.result }} : {{ result.filename }}
          </li>
        </ul>
      </div>
      <div class="btn_wrapper">
        <ul>
          <li><a class="btn" href="">확인</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["active", "title", "results"],
};
</script>

<style>
.popup_wrapper * {
  box-sizing: border-box;
}
.popup_wrapper.active .blocker {
  display: block;
}
.popup_wrapper .blocker {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  display: none;
}
.popup_wrapper.active .popup {
  display: block;
}
.popup_wrapper .popup {
  display: none;
  flex-direction: column;
  align-content: center;
  justify-content: space-evenly;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: white;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
  transition: 0.3s;
  border-radius: 5px;
  padding: 24px;
}
.popup h3 {
  font-size: 32px;
  text-align: center;
  height: 10%;
}
.popup .result_wrapper {
  height: 80%;
  padding: 10px 0;
  overflow-y: scroll;
}
.popup .result_wrapper li {
  border-bottom: 1px #ddd solid;
  padding: 4px 0;
}
.popup .result_wrapper li:last-child {
  border-bottom: 0;
}
.popup .result_wrapper li::before {
  content: "-";
  padding: 0 6px 0 0;
}
.popup .result_wrapper li.error{ color: red; }
.popup .btn_wrapper {
  text-align: center;
  height: 10%;
}
</style>