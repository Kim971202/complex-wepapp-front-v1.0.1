<template>
  <div class="board">
    <h1>This is an board write page</h1>
    <table>
      <colgroup>
        <col style="width: 18.5%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">도착일시</th>
          <td><span v-html="arrivalTime"></span></td>
        </tr>
        <tr>
          <th scope="row">수령여부</th>
          <td>
            <textarea
              rows="10"
              placeholder="내용을 입력하세요."
              ref="parcelStatusTextarea"
              v-model.trim="parcelStatus"
            ></textarea>
          </td>
        </tr>
        <tr>
          <th scope="row">동</th>
          <td><span v-html="dongCode"></span></td>
        </tr>
        <tr>
          <th scope="row">호</th>
          <td><span v-html="hoCode"></span></td>
        </tr>
        <tr>
          <th scope="row">메모(택배사)</th>
          <td>{{ memo }}</td>
        </tr>
      </tbody>
    </table>

    <div class="common-buttons">
      <button
        type="button"
        class="w3-button w3-round w3-blue-gray"
        v-on:click="fnSave"
      >
        수정</button
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
      arrivalTime: "",
      parcelStatus: "",
      dongCode: "",
      hoCode: "",
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
          .get(this.$serverUrl + "/parcel/parcelListDetail/" + this.idx, {
            params: this.requestBody,
          })
          .then((res) => {
            this.arrivalTime = res.data.arrivalTime;
            this.parcelStatus = res.data.parcelStatus;
            this.dongCode = res.data.dongCode;
            this.hoCode = res.data.hoCode;
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
        path: "./getparcelList",
        query: this.requestBody,
      });
    },
    fnView(idx) {
      this.requestBody.idx = idx;
      this.$router.push({
        path: "./etparcelListdetail",
        query: this.requestBody,
      });
    },
    fnSave() {
      if (this.contents == "") {
        alert("택배상태를 입력하세요.");
        this.$refs.parcelStatusTextArea.focus();
        return;
      }

      let apiUrl = this.$serverUrl + "/parcel/parcelUpdate";
      this.form = {
        idx: this.idx,
        parcelStatus: this.parcelStatus,
      };

      var result = confirm("수정하시겠습니까?");
      if (result) {
        //UPDATE
        this.axios
          .patch(apiUrl, this.form)
          .then((res) => {
            console.log("res.data.resultCode: " + res.data.resultCode);
            if (res.data.resultCode == "00") {
              alert("수정되었습니다.");
              //alert(JSON.stringify(res.data.resultMsg));
              this.fnView(res.data.idx);
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
