<template>
  <div class="board">
    <h1>택배 정보 입력</h1>
    <div class="common-buttons"></div>
    <table>
      <colgroup>
        <col style="width: 18.5%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">도착일시</th>
          <td>
            <input
              type="text"
              placeholder="도착일시를 입력하세요"
              ref="arrivalTimeInput"
              v-model.trim="arrivalTime"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">수령여부</th>
          <td>
            <input
              type="text"
              placeholder="미수령 or 수령 or 반품"
              ref="parcelStatusInput"
              v-model.trim="parcelStatus"
            />
          </td>
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
          <th scope="row">메모</th>
          <td>
            <input
              type="text"
              placeholder="택배회사 등 기타사항을 입력하세요."
              ref="memoInput"
              v-model.trim="memo"
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
      arrivalTime: "",
      parcelStatus: "",
      dongCode: "",
      hoCode: "",
      memo: "",
      //   author: this.$store.state.loginStore.memberId,
    };
  },

  methods: {
    fnList() {
      delete this.requestBody.idx;
      this.$router.push({
        path: "./parcelList",
        query: this.requestBody,
      });
    },
    fnSave() {
      if (this.arrivalTime == "") {
        alert("도착일시를 입력하세요");
        this.$refs.arrivalTimeInput.focus();
        return;
      } else if (this.dongCode == "") {
        alert("동을 입력하세요.");
        this.$refs.dongCodeInput.focus();
        return;
      } else if (this.hoCode == "") {
        alert("호을 입력하세요.");
        this.$refs.hoCodeInput.focus();
        return;
      }

      let apiUrl = this.$serverUrl + "/parcel/uploadParcel";
      this.form = {
        arrivalTime: this.arrivalTime,
        parcelStatus: this.parcelStatus,
        dongCode: this.dongCode,
        hoCode: this.hoCode,
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
              alert("글이 등록되었습니다.");
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
