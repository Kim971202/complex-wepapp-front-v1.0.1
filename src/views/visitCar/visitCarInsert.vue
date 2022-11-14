<template>
  <div class="board">
    <h1>방문차량 입력</h1>
    <div class="common-buttons"></div>
    <table>
      <colgroup>
        <col style="width: 18.5%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">방문일</th>
          <td style="float: center">
            <input
              type="date"
              style="width: 150px; text-align: center"
              v-model.trim="visitDate"
            />
          </td>
        </tr>
        <!-- 방문일 선택해야 동호가 표시되는 버그 -->
        <tr>
          <th scope="row">세대정보</th>
          <td style="float: center">
            <select
              v-model="dongCode"
              ref="dongCodeInput"
              @change="onChange($event)"
              style="width: 150px; height: 25px; text-align: center"
            >
              <option value="">---선택하세요---</option>
              <!-- <option value="undefined">-선택하세요-</option> -->
              <option
                v-for="model in dong_items"
                :key="model.code"
                :value="model.code"
              >
                {{ model.name }}
              </option>
            </select>
            &emsp;동&nbsp;&nbsp;
            <select
              v-model="hoCode"
              ref="hoCodeInput"
              style="width: 150px; height: 25px; text-align: center"
            >
              <option value="">---선택하세요---</option>
              <option
                v-for="model in ho_items"
                :key="model.code"
                :value="model.code"
              >
                {{ model.name }}
              </option>
            </select>
            &emsp;호
          </td>
        </tr>

        <tr>
          <th scope="row">방문기간</th>
          <td>1일</td>
        </tr>

        <tr>
          <th scope="row">차량번호</th>
          <td>
            <input
              type="text"
              placeholder="방문할 차량번호를 입력하세요."
              ref="carNumberInput"
              v-model.trim="carNumber"
              @keyup.enter="fnSave"
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
      dongCode: "",
      hoCode: "",
      visitDate: "",
      visitperiod: "",
      carNumber: "",
      dong_itmes: [],
      ho_items: [],
      items: [],
    };
  },

  mounted() {
    this.fnGetDong();
  },

  methods: {
    fnGetDong() {
      this.axios
        .get(this.$serverUrl + "/donghoInfo/dongList")
        .then((res) => {
          this.dong_items = res.data.items;
          //alert(JSON.stringify(this.items));
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onChange(event) {
      console.log("event =>" + event.target.value);
      //alert(this.dongCode);
      this.fnGetDongho(this.dongCode);
    },
    fnGetDongho(dongCode) {
      this.axios
        .get(this.$serverUrl + "/donghoInfo/donghoList?dongCode=" + dongCode)
        .then((res) => {
          this.ho_items = res.data.items;
          //alert(JSON.stringify(this.items));
        })
        .catch((err) => {
          console.log(err);
        });
    },

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
        dongCode: this.dongCode,
        hoCode: this.hoCode,
        visitDate: this.visitDate,
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
