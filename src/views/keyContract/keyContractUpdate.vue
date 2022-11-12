<template>
  <div class="board">
    <h1>주요연락처</h1>
    <table>
      <colgroup>
        <col style="width: 18.5%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">구&emsp;분</th>
          <td>
            <select
              v-model="contractFlag"
              ref="contractFlagInput"
              style="width: 700px; height: 25px; text-align: center"
            >
              <option value="단지시설">단지시설</option>
              <option value="주변상가">주변상가</option>
              <option value="공공기관">기타시설</option>
            </select>
          </td>
        </tr>
        <tr>
          <th scope="row">시설명</th>
          <td>
            <input
              rows="1"
              style="width: 700px"
              placeholder="시설의 명칭을 입력하세요"
              ref="facilityNameTextarea"
              v-model.trim="facilityName"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">연락처</th>
          <td>
            <input
              rows="1"
              style="width: 700px"
              placeholder="연락처를 입력하세요"
              ref="phoneNumTextarea"
              v-model.trim="phoneNum"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">메&emsp;모</th>
          <td>
            <input
              rows="1"
              style="width: 700px"
              placeholder=""
              ref="memoTextarea"
              v-model.trim="memo"
            />
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
        저장</button
      >&nbsp;
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
      idx: this.$route.query.idx,
      contractFlag: "",
      facilityName: "",
      phoneNum: "",
      memo: "",
    };
  },
  mounted() {
    this.fnGetView();
  },
  methods: {
    fnGetView() {
      if (this.idx !== undefined) {
        this.axios
          .get(
            this.$serverUrl + "/keyContract/getDetailedKeyContract/" + this.idx,
            {
              params: this.requestBody,
            }
          )
          .then((res) => {
            this.contractFlag = res.data.contractFlag;
            this.facilityName = res.data.facilityName;
            this.phoneNum = res.data.phoneNum;
            this.memo = res.data.memo;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    fnList() {
      delete this.requestBody.idx;
      this.$router.push({
        path: "./keyContractList",
        query: this.requestBody,
      });
    },
    fnView(idx) {
      this.requestBody.idx = idx;
      this.$router.push({
        path: "./keyContractList",
        query: this.requestBody,
      });
    },
    fnSave() {
      if (this.contractFlag == "") {
        alert("시설 항목을 입력하세요.");
        this.$refs.contractFlagInput.focus();
        return;
      }
      if (this.facilityName == "") {
        alert("시설 명칭을 입력하세요.");
        this.$refs.facilityNameInput.focus();
        return;
      }
      if (this.phoneNum == "") {
        alert("연락처를 입력하세요.");
        this.$refs.phoneNumInput.focus();
        return;
      }

      let apiUrl =
        this.$serverUrl + "/keyContract/updateKeyContract/" + this.idx;
      this.form = {
        idx: this.idx,
        contractFlag: this.contractFlag,
        facilityName: this.facilityName,
        phoneNum: this.phoneNum,
        memo: this.memo,
      };

      var result = confirm("저장하시겠습니까?");
      if (result) {
        //UPDATE
        this.axios
          .patch(apiUrl, this.form)
          .then((res) => {
            console.log("res.data.resultCode: " + res.data.resultCode);
            if (res.data.resultCode == "00") {
              alert("저장되었습니다.");
              this.fnList();
              // alert(JSON.stringify(res.data.resultMsg));
              // this.fnView(res.data.idx);
            } else {
              alert("저장되지 않았습니다.");
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
