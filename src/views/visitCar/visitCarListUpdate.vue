<template>
  <div class="board">
    <h1>방문차량 상세정보</h1>
    <div class="common-buttons"></div>
    <table>
      <colgroup>
        <col style="width: 18.5%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">방문시작일</th>
          <td><span v-html="visitStartDate"></span></td>
        </tr>
        <tr>
          <th scope="row">방문종료일</th>
          <td><span v-html="visitEndDate"></span></td>
        </tr>
        <tr>
          <th scope="row">방문차량</th>
          <td><span v-html="carNumber"></span></td>
        </tr>
        <tr>
          <th scope="row">예약자</th>
          <td><span v-html="applicant"></span></td>
        </tr>
        <tr>
          <th scope="row">예약등록일시</th>
          <td>{{ registerDate }}</td>
        </tr>
        <tr>
          <th scope="row">예약방법</th>
          <td>{{ resvMethod }}</td>
        </tr>
        <tr>
          <th scope="row">방문종료일</th>
          <td>
            <textarea
              rows="1"
              placeholder="예약/취소 중 선택하세요"
              ref="resvFlagInput"
              v-model.trim="resvFlag"
            ></textarea>
          </td>
        </tr>
        <tr>
          <th scope="row">입차여부</th>
          <td>{{ inoutFlag }}</td>
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
      visitStartDate: "",
      visitEndDate: "",
      carNumber: "",
      applicant: "",
      registerDate: "",
      resvMethod: "",
      resvFlag: "",
      inoutFlag: "",
    };
  },
  mounted() {
    this.fnGetView();
  },
  methods: {
    fnGetView() {
      if (this.idx !== undefined) {
        this.axios
          .get(this.$serverUrl + "/parcel/getDetailedParkingResv/" + this.idx, {
            params: this.requestBody,
          })
          .then((res) => {
            this.visitStartDate = res.data.visitStartDate;
            this.visitEndDate = res.data.visitEndDate;
            this.carNumber = res.data.carNumber;
            this.applicant = res.data.applicant;
            this.registerDate = res.data.registerDate;
            this.resvMethod = res.data.resvMethod;
            this.resvFlag = res.data.resvFlag;
            this.inoutFlag = res.data.inoutFlag;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    fnList() {
      delete this.requestBody.idx;
      this.$router.push({
        path: "./visitCatListUpdate",
        query: this.requestBody,
      });
    },
    fnView(idx) {
      this.requestBody.idx = idx;
      this.$router.push({
        path: "./visitCarListDetail",
        query: this.requestBody,
      });
    },
    fnSave() {
      if (this.resvFlag == "") {
        alert("예약 상태를 선택하세요.");
        this.$refs.resvFlagTextArea.focus();
        return;
      }

      let apiUrl = this.$serverUrl + "/visitCar/updateParkingResv/" + this.idx;
      this.form = {
        idx: this.idx,
        resvFlag: this.resvFlag,
      };

      var result = confirm("수정하시겠습니까?");
      if (result) {
        //UPDATE
        this.axios
          .patch(apiUrl, this.form)
          .then((res) => {
            console.log("res.data.resultCode: " + res.data.resultCode);
            if (res.data.resultCode == "00") {
              alert("예약 상태가 변경되었습니다.");
              //alert(JSON.stringify(res.data.resultMsg));
              this.fnView(res.data.idx);
            } else {
              alert("예약 상태가 변경되지 않았습니다.");
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
