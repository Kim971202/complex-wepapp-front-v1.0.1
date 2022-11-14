<!-- 
    프로그램 명 : 주요연락처 등록
    최초 작성자: 최문준
    최초 작성일자: 2022년10월21일

    마지막 수정자: 최문준
    마지막 수정일자: 2022년11월14일

                  수정 내용
  | NO |              contents                |  Data
  | 1  | 구분 콤보 박스 변경                   | 2022-11-14
-->

<template>
  <div class="board">
    <h1>주요연락처 등록</h1>
    <div class="common-buttons"></div>
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
              type="text"
              placeholder="시설의 명칭을 입력하세요"
              ref="facilityNameInput"
              v-model.trim="facilityName"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">연락처</th>
          <td>
            <input
              type="text"
              placeholder="연락처를 입력하세요"
              ref="phoneNumInput"
              v-model.trim="phoneNum"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">메&emsp;모</th>
          <td>
            <input
              type="text"
              placeholder=""
              ref="memoInput"
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
        등록</button
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
      id: "",
      contractFlag: "",
      facilityName: "",
      phoneNum: "",
      memo: "",
      //   author: this.$store.state.loginStore.memberId,
    };
  },

  methods: {
    fnList() {
      delete this.requestBody.idx;
      this.$router.push({
        path: "./keyContractList",
        query: this.requestBody,
      });
    },
    fnSave() {
      if (this.contractFlag == "") {
        alert("단지시설/주변상가/공공기관/기타시설 중 하나를 입력하세요");
        this.$refs.contractFlagInput.focus();
        return;
      } else if (this.facilityName == "") {
        alert("시설명을 입력하세요");
        this.$refs.facilityNameInput.focus();
        return;
      } else if (this.phoneNum == "") {
        alert("연락처를 입력하세요");
        this.$refs.phoneNumInput.focus();
        return;
      }

      let apiUrl = this.$serverUrl + "/keyContract/uploadKeyContract";
      this.form = {
        contractFlag: this.contractFlag,
        facilityName: this.facilityName,
        phoneNum: this.phoneNum,
        memo: this.memo,
      };

      var result = confirm("등록하시겠습니까?");

      if (result) {
        //INSERT
        this.axios
          .post(apiUrl, this.form)
          .then((res) => {
            console.log("res.data.resultCode: " + res.data.resultCode);
            if (res.data.resultCode == "00") {
              //alert("글이 등록되었습니다.");
              //alert(JSON.stringify(res.data.resultMsg));
              this.fnList();
            } else {
              alert("등록되지 않았습니다.");
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
