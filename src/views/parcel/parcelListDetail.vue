<template>
  <div class="board">
    <h1>택배 상세정보</h1>
    <div class="common-buttons"></div>
    <table>
      <colgroup>
        <col style="width: 18.5%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">도착일시</th>
          <td>{{ arrivalTime }}</td>
        </tr>
        <tr>
          <th scope="row">수령여부</th>
          <!-- <span v-html="parcelStatus"></span> -->
          <td>{{ parcelStatus }}</td>
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
          <th scope="row">메모(택배회사)</th>
          <td>{{ memo }}</td>
        </tr>
      </tbody>
    </table>

    <div class="common-buttons">
      <button
        type="button"
        class="w3-button w3-round w3-blue-gray"
        v-on:click="fnUpdate"
      >
        수정</button
      >&nbsp;
      <button
        type="button"
        class="w3-button w3-round w3-red"
        v-on:click="fnDelete"
      >
        삭제</button
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
      this.axios
        .get(this.$serverUrl + "/parcel/getDetailedParcelList/" + this.idx, {
          params: this.requestBody,
        })

        .then((res) => {
          this.arrivalTime = res.data.arrivalTime;
          this.parcelStatus = res.data.parcelStatus;
          this.dongCode = res.data.dongCode;
          this.hoCode = res.data.hoCode;
          this.memo = res.data.memo.split("\n").join("<br>"); //개행처리
          // this.contents = res.data.contents.split("\n").join("<br>"); //개행처리
          // this.created_at = res.data.created_at;
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
        path: "./parcelList",
        query: this.requestBody,
      });
    },
    fnUpdate() {
      this.$router.push({
        path: "./parcelListUpdate",
        query: this.requestBody,
      });
    },
    fnDelete() {
      var result = confirm("삭제하시겠습니까?");
      if (result) {
        this.axios
          .delete(this.$serverUrl + "/parcel/deleteParcel/" + this.idx, {})
          .then((res) => {
            console.log("res.data.resultCode: " + res.data.resultCode);
            if (res.data.resultCode == "00") {
              alert("삭제되었습니다.");
              //alert(JSON.stringify(res.data.resultMsg));
              this.fnList();
            } else {
              alert("삭제되지 않았습니다.");
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
