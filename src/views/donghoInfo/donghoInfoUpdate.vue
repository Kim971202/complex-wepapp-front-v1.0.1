<template>
  <div class="board">
    <h2>동호정보</h2>
    <div class="common-buttons"></div>
    <table>
      <colgroup>
        <col style="width: 20%" />
        <col style="width: 30" />
        <col style="width: 20%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">동호(라인)</th>
          <td>{{ dongCode }}동 {{ hoCode }}호 ({{ lineCode }})</td>
          <th scope="row">면적타입</th>
          <td>
            <select
              v-model="hAreaType"
              ref="hAreaTypeInput"
              style="width: 100px; height: 25px; text-align: center"
            >
              <option
                v-for="model in items"
                :key="model.code"
                :value="model.code"
              >
                {{ model.name }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <th scope="row">알림설정</th>
          <td>
            <select v-model="hnSendFlag" ref="hnSendFlagInput">
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
          </td>
          <th scope="row">이사일자</th>
          <td>
            <input
              type="date"
              style="width: 150px; text-align: center"
              placeholder="이사일자를 입력하세요."
              ref="moveOutDtimeInput"
              v-model.trim="moveOutDtime"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">메모</th>
          <td colspan="3">
            <textarea
              rows="3"
              placeholder="메모를 입력하세요."
              ref="memoTextarea"
              v-model.trim="memo"
            ></textarea>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="common-buttons">
      <button
        type="button"
        class="w3-button w3-round w3-blue-gray"
        v-on:click="fnSave"
      >
        수정
      </button>
      &nbsp;
      <button
        type="button"
        class="w3-button w3-round w3-gray"
        v-on:click="fnList"
      >
        목록
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    //변수생성
    return {
      requestBody: this.$route.query,
      dongCode: this.$route.query.dongCode,
      hoCode: this.$route.query.hoCode,

      lineCode: "",
      hAreaType: "",
      hnSendFlag: "",
      moveOutDtime: "",
      memo: "",

      items: [],
    };
  },
  mounted() {
    this.fnGethArea();
    this.fnGetView();
  },
  methods: {
    fnGetView() {
      if (this.dongCode !== undefined && this.hoCode !== undefined) {
        this.axios
          .get(
            this.$serverUrl +
              "/donghoInfo/detail/" +
              this.dongCode +
              "/" +
              this.hoCode,
            {
              params: this.requestBody,
            }
          )
          .then((res) => {
            this.lineCode = res.data.lineCode;
            this.hAreaType = res.data.hAreaType;
            //alert(this.hAreaType);
            this.hnSendFlag = res.data.hnSendFlag;
            this.moveOutDtime = res.data.moveOutDtime;
            //alert(this.moveOutDtime);
            this.memo = res.data.memo;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    fnGethArea() {
      this.axios
        .get(this.$serverUrl + "/donghoInfo/hAreaList")
        .then((res) => {
          this.items = res.data.items;
          //alert(JSON.stringify(this.items));
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fnList() {
      delete this.requestBody.dongCode;
      delete this.requestBody.hoCode;
      this.$router.push({
        path: "./donghoInfoList",
        query: this.requestBody,
      });
    },
    fnView(dongCode, hoCode) {
      this.requestBody.dongCode = dongCode;
      this.requestBody.hoCode = hoCode;
      this.$router.push({
        // path: "./detail",
        path: "./donghoInfoUpdate",
        query: this.requestBody,
      });
    },
    fnSave() {
      if (this.dongCode == "") {
        alert("동정보를 입력하세요.");
        this.$refs.dongCodeInput.focus();
        return;
      }
      if (this.hoCode == "") {
        alert("호정보를 입력하세요.");
        this.$refs.hoCodeInput.focus();
        return;
      }
      if (this.hAreaType == "") {
        alert("면적타입을 입력하세요.");
        this.$refs.hAreaTypeInput.focus();
        return;
      }
      if (this.hnSendFlag == "") {
        alert("알림설정을 입력하세요.");
        this.$refs.hnSendFlagInput.focus();
        return;
      }
      // if (this.moveOutDtime == "") {
      //   alert("이사일자를 입력하세요.");
      //   this.$refs.moveOutDtimeInput.focus();
      //   return;
      // }
      if (this.memo == "") {
        alert("메모를 입력하세요.");
        this.$refs.memoTextarea.focus();
        return;
      }

      let apiUrl = this.$serverUrl + "/donghoInfo/write";
      this.form = {
        dongCode: this.dongCode,
        hoCode: this.hoCode,
        hAreaType: this.hAreaType,
        hnSendFlag: this.hnSendFlag,
        memo: this.memo,
      };

      var result = confirm("수정하시겠습니까?");
      if (result) {
        //UPDATE
        this.axios
          .put(apiUrl, this.form)
          .then((res) => {
            console.log("res.data.resultCode: " + res.data.resultCode);
            if (res.data.resultCode == "00") {
              alert("수정되었습니다.");
              //alert(JSON.stringify(res.data.resultMsg));
              this.fnView(res.data.dongCode, res.data.hoCode);
            } else {
              alert("수정되지 않았습니다.");
            }
          })
          .catch((err) => {
            if (err.message.indexOf("Network Error") > -1) {
              alert(
                "네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요."
              );
            }
          });
      }
    },
  },
};
</script>
<style scoped></style>
