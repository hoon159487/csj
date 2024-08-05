import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  state() {
    return {
      page_info: {
        name: "",
        page: 0,
        search: "",
        option: {},
      },
      token: "",
      user_info: {},
    }
  },
  mutations: {
    set_token: function (state, token) {
      state.token = token;
    },
    set_user_info: function (state, user_info) {
      state.user_info = user_info;
    },
    set_page: function (state, page_info) {
      state.page_info = page_info;
    },
    get_page: function (state) {
      return state.page_info;
    },
  },
  actions: {
  },
  modules: {
  },
  plugins: [
    createPersistedState()
  ]
})
