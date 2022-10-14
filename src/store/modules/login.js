/**
 * Vuex PersistedState - 데이터 유지하기
 */

import axios from "axios";
const axiosRefresh = axios.create(); // 추가

const loginStore = {
  namespaced: true,
  state: {
    memberId: "",
    accessToken: "",
    refreshToken: "", // 추가
  },
  getters: {
    // 로그인 여부
    isLogin(state) {
      return state.refreshToken == "" ? false : true; // 수정
    },
    // accessToken이 만료되었는지 여부
    isAccessTokenExpire(state) {
      let expire = false;
      // accessToken에서 .(도트)로 분리하여 payload를 가져옴
      let base64Payload = state.accessToken.split(".")[1];
      // URL과 호환되지 않는 문자를 base64 표준 문자로 교체함
      base64Payload = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
      // atob() 메소드로 복호화
      base64Payload = atob(base64Payload);
      // JSON 객체로 변환
      var payloadObject = JSON.parse(base64Payload);
      // accessToken의 만료 시간을 확인
      var currentDate = new Date().getTime() / 1000;
      if (payloadObject.exp <= currentDate) {
        console.log("token expired");
        expire = true;
      } else {
        console.log("token valid");
      }
      return expire;
    },
  },
  mutations: {
    // memberId를 설정합니다.
    setMmemberId(state, memberId) {
      state.memberId = memberId;
    },
    // Access-Token를 설정합니다.
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken;
    },
    // Refresh-Token를 설정합니다.
    setRefreshToken(state, refreshToken) {
      state.refreshToken = refreshToken;
    },
    // 초기화시킵니다.
    reset(state) {
      state.memberId = "";
      state.accessToken = "";
      state.refreshToken = "";
    },
  },
  actions: {
    // 로그인 처리
    async doLogin({ commit }, memberInfo) {
      let result = false;
      let resultErr = null;
      try {
        let res = await axios.post(
          "http://localhost:9000/members/login",
          memberInfo
        );
        if (res.data.success == true) {
          console.log("로그인되었습니다.");
          commit("setMmemberId", memberInfo.id);
          commit("setAccessToken", res.data.accessToken);
          commit("setRefreshToken", res.data.refreshToken); // 추가
          // // 추가 - Storage에 state를 저장합니다.
          // commit("saveStateToStorage");
          axios.defaults.headers.common["Access-Token"] = res.data.accessToken; // 추가
          result = true;
        } else {
          console.log("로그인되지 않았습니다.");
          let err = new Error("Request failed with status code 401");
          err.status = 401; // 추가
          err.response = {
            data: { success: false, errormessage: "로그인되지 않았습니다." },
          };
          resultErr = err;
        }
      } catch (err) {
        if (!err.response) {
          err.response = {
            data: { success: false, errormessage: err.message },
          };
        }
        resultErr = err;
      }
      return new Promise((resolve, reject) => {
        if (result) {
          resolve();
        } else {
          reject(resultErr);
        }
      });
    },
    // 로그아웃
    doLogout({ commit }) {
      commit("reset");
      delete axios.defaults.headers.common["Access-Token"]; //추가
    },
    // Access-Token를 갱신합니다.
    async doRefreshToken({ commit, state }) {
      let result = false;
      let resultErr = null;
      if (state.accessToken != "") {
        let token = {
          id: state.memberId,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        };
        try {
          let res = await axiosRefresh.post(
            "http://localhost:9000/members/refresh",
            token
          ); // ***수정
          if (res.data.success == true) {
            console.log("Access-Token이 갱신되었습니다.");
            commit("setAccessToken", res.data.accessToken);
            console.log(res.data.accessToken);
            axios.defaults.headers.common["Access-Token"] =
              res.data.accessToken;
            result = true;
          } else {
            console.log("Access-Token이 갱신되지 않았습니다.");
            let err = new Error("Request failed with status code 401");
            err.status = 401;
            err.response = {
              data: {
                success: false,
                errormessage: "Access-Token이 갱신되었습니다.",
              },
            };
            resultErr = err;
          }
        } catch (err) {
          if (!err.response) {
            err.response = {
              data: { success: false, errormessage: err.message },
            };
          }
          resultErr = err;
        }
      } else {
        let err = new Error("Access-Token does not exist");
        err.status = 401;
        err.response = {
          data: { success: false, errormessage: "Access-Token이 없습니다." },
        };
        resultErr = err;
      }
      return new Promise((resolve, reject) => {
        if (result) {
          resolve();
        } else {
          reject(resultErr);
        }
      });
    },
  },
};

export default loginStore;
