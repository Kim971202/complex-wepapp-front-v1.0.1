import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate"; //추가
//import scoreStore from "@/store/modules/score.js";
import loginStore from "@/store/modules/login.js";

//추가
const storageState = createPersistedState({
  paths: ["loginStore"],
});

export default createStore({
  modules: {
    // scoreStore: scoreStore,
    loginStore: loginStore,
  },
  plugins: [storageState], //추가
});
