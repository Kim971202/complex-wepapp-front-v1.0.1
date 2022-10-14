<template>
  <div class="board">
    <h2>세대 주차위치 상세 정보</h2>
    <table>
      <colgroup>
        <col style="width: 18.5%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">동</th>
          <td>{{ dongCode }}</td>
        </tr>
        <tr>
          <th scope="row">호</th>
          <td>{{ hoCode }}</td>
        </tr>
        <tr>
          <th scope="row">Tag ID</th>
          <td>{{ tagName }}</td>
        </tr>
        <tr>
          <th scope="row">기둥명칭</th>
          <td><span v-html="posDesc"></span></td>
        </tr>
        <tr>
          <th scope="row">좌표</th>
          <td><span v-html="position"></span></td>
        </tr>
        <tr>
          <th scope="row">층</th>
          <td><span v-html="floorName"></span></td>
        </tr>
        <tr>
          <th scope="row">건물명</th>
          <td><span v-html="buildingName"></span></td>
        </tr>
        <tr>
          <th scope="row">등록일시</th>
          <td>{{ posUpdateDate }}</td>
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
      <!-- <button
        type="button"
        class="w3-button w3-round w3-red"
        v-on:click="fnDelete"
      >
        삭제</button
      >&nbsp; -->
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
      dongCode: "",
      hoCode: "",
      tagName: "",
      posDesc: "",
      position: "",
      floorName: "",
      buildingName: "",
      posUpdateDate: "",
    };
  },
  mounted() {
    this.fnGetView();
  },
  methods: {
    fnGetView() {
      this.axios
        .get(
          this.$serverUrl +
            "/parking/getDetailedParkingLocationList/" +
            this.idx,
          {
            params: this.requestBody,
          }
        )

        .then((res) => {
          this.dongCode = res.data.dongCode;
          this.hoCode = res.data.hoCode;
          this.tagName = res.data.tagName;
          this.posDesc = res.data.posDesc;
          this.position = res.data.position;
          this.floorName = res.data.floorName;
          this.buildingName = res.data.buildingName;
          this.posUpdateDate = res.data.posUpdateDate.split("\n").join("<br>"); //개행처리
          // this.contents = res.data.contents.split("\n").join("<br>"); //개행처리
          // this.created_at = res.data.created_at;
        })
        .catch((err) => {
          if (err.message.indexOf("Network Error") > -1) {
            alert("네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.");
          }
        });
      console.log(
        this.axios.get(
          this.$serverUrl +
            "/parking/getDetailedParkingLocationList/" +
            this.idx,
          {
            params: this.requestBody,
          }
        )
      );
    },

    fnList() {
      delete this.requestBody.idx;
      this.$router.push({
        path: "./parkingLocation",
        query: this.requestBody,
      });
    },
    // fnUpdate() {
    //   this.$router.push({
    //     path: "./update",
    //     query: this.requestBody,
    //   });
    // },
    // fnDelete() {
    //   var result = confirm("삭제하시겠습니까?");
    //   if (result) {
    //     this.axios
    //       .delete(this.$serverUrl + "/vueboard/delete/" + this.idx, {})
    //       .then((res) => {
    //         console.log("res.data.resultCode: " + res.data.resultCode);
    //         if (res.data.resultCode == "00") {
    //           alert("삭제되었습니다.");
    //           //alert(JSON.stringify(res.data.resultMsg));
    //           this.fnList();
    //         } else {
    //           alert("삭제되지 않았습니다.");
    //         }
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   }
    // },
  },
};
</script>
<style scoped></style>
