<template>
  <div class="board">
    <h1>방문차량 입력</h1>
    <table>
      <colgroup>
        <col style="width: 18.5%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">방문일</th>
          <td>
            <input
              type="text"
              placeholder="방문일시를 입력하세요"
              ref="visitDateInput"
              v-model.trim="visitDate"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">방문일</th>
          <td>1일</td>
        </tr>
        <tr>
          <th scope="row">동</th>
          <td>
            <input
              type="text"
              placeholder="동 입력"
              ref="dongCodeInput"
              v-model.trim="dongCode"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">호</th>
          <td>
            <input
              type="text"
              placeholder="호 입력"
              ref="hoCodeInput"
              v-model.trim="hoCode"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">차량번호</th>
          <td>
            <input
              type="text"
              placeholder="방문할 차량번호를 입력하세요."
              ref="carNumberInput"
              v-model.trim="carNumber"
            />
          </td>
        </tr>
        <!-- <tr>
          <th scope="row">수령여부</th>
          <td>
            <input
              type="text"
              placeholder="제목을 입력하세요."
              ref="titleInput"
              v-model.trim="title"
            />
          </td>
        </tr> -->
        <!-- <tr>
          <th scope="row">내용</th>
          <td>
            <textarea
              rows="10"
              placeholder="내용을 입력하세요."
              ref="contentsTextarea"
              v-model.trim="contents"
            ></textarea>
          </td>
        </tr> -->
      </tbody>
    </table>

    <div class="common-buttons">
      <button
        type="button"
        class="w3-button w3-round w3-blue-gray"
        v-on:click="fnSave"
      >
        예약</button
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
      visitDate: "",
      visitperiod: "",
      dongCode: "",
      hoCode: "",
      carNumber: "",
      //   author: this.$store.state.loginStore.memberId,
    };
  },

  methods: {
    fnList() {
      delete this.requestBody.idx;
      this.$router.push({
        path: "./visitCarList",
        query: this.requestBody,
      });
    },
    fnSave() {
      if (this.visitDate == "") {
        alert("방문일시를 입력하세요");
        this.$refs.visitDateInput.focus();
        return;
      } else if (this.dongCode == "") {
        alert("동을 입력하세요.");
        this.$refs.dongCodeInput.focus();
        return;
      } else if (this.hoCode == "") {
        alert("호을 입력하세요.");
        this.$refs.hoCodeInput.focus();
        return;
      } else if (this.carNumber == "") {
        alert("방문할 차량 번호를 입력하세요.");
        this.$refs.carNumberInput.focus();
        return;
      }

      let apiUrl = this.$serverUrl + "/visitCar/uploadParkingResv";
      this.form = {
        visitDate: this.visitDate,
        dongCode: this.dongCode,
        hoCode: this.hoCode,
        carNumber: this.carNumber,
      };

      var result = confirm("등록하시겠습니까?");

      if (result) {
        //INSERT
        this.axios
          .post(apiUrl, this.form)
          .then((res) => {
            console.log("res.data.resultCode: " + res.data.resultCode);
            if (res.data.resultCode == "00") {
              alert("방문차량 예약이 완료되었습니다.");
              //alert(JSON.stringify(res.data.resultMsg));
              this.fnList();
            } else {
              alert("방문차량 예약이 완료되지 않았습니다.");
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
