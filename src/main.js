import "./assets/w3.css";
import "./assets/common.css";
import "./assets/bbs.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
//import axios from "axios";
import axios from "./axios"; // 수정
import store from "./store";

import "bootstrap"; // 추가
import "bootstrap/dist/css/bootstrap.min.css"; // 추가
import "bootstrap-icons/font/bootstrap-icons.css"; // 추가

const app = createApp(App).use(router).use(store);
app.config.globalProperties.axios = axios;
app.config.globalProperties.$serverUrl = "//localhost:9000"; //API서버
app.mount("#app");
