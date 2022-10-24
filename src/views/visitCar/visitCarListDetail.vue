<template>
  <div class="board">
    <h2>방문차량 상세정보</h2>
    <table>
      <colgroup>
        <col style="width: 18.5%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">방문시작일</th>
          <td>{{ visitStartDate }}</td>
        </tr>
        <tr>
          <th scope="row">방문종료일</th>
          <td>{{ visitEndDate }}</td>
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
        <!-- <tr>
          <th scope="row">예약상태</th>
          <td>{{ resvFlag }}</td>
        </tr> -->
        <tr>
          <th scope="row">입차여부</th>
          <td>{{ inoutFlag }}</td>
        </tr>
      </tbody>
    </table>

    <div class="common-buttons">
      <!-- <button
        type="button"
        class="w3-button w3-round w3-blue-gray"
        v-on:click="fnUpdate"
      >
        수정</button
      >&nbsp; -->
      <button
        type="button"
        class="w3-button w3-round w3-red"
        v-on:click="fnDelete"
      >
        예약취소</button
      >&nbsp;
      <button
        type="button"
        class="w3-button w3-round w3-blue-gray"
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
      this.axios
        .get(this.$serverUrl + "/visitCar/getDetailedParkingResv/" + this.idx, {
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
          this.inoutFlag = res.data.inoutFlag.split("\n").join("<br>"); //개행처리
        })
        .catch((err) => {
          if (err.message.indexOf("Network Error") > -1) {
            alert("네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.");
          }
        });
    },

    fnList() {
      delete this.requestBody.idx;
      this.$router.push({
        path: "./visitCarList",
        query: this.requestBody,
      });
    },
    fnUpdate() {
      this.$router.push({
        path: "./visitCarListUpdate",
        query: this.requestBody,
      });
    },
    fnDelete() {
      var result = confirm("예약을 취소하시겠습니까?");
      if (result) {
        this.axios
          .delete(
            this.$serverUrl + "/visitCar/deleteParkingResv/" + this.idx,
            {}
          )
          .then((res) => {
            console.log("res.data.resultCode: " + res.data.resultCode);
            if (res.data.resultCode == "00") {
              alert("취소되었습니다.");
              //alert(JSON.stringify(res.data.resultMsg));
              this.fnList();
            } else {
              alert("취소되지 않았습니다.");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  },
};
</script>
<style scoped></style>
