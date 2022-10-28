<template>
  <div class="board">
    <h1>민원신청 상세정보</h1>
    <table>
      <colgroup>
        <col style="width: 18.5%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">신청일자</th>
          <td>{{ appDate }}</td>
        </tr>
        <tr>
          <th scope="row">민원유형</th>
          <td>{{ appCategory }}</td>
        </tr>
        <tr>
          <th scope="row">민원내용</th>
          <td><span v-html="appContent"></span></td>
        </tr>
        <tr>
          <th scope="row">신청자</th>
          <td><span v-html="applicant"></span></td>
        </tr>
        <tr>
          <th scope="row">신청방법</th>
          <td>{{ appMethod }}</td>
        </tr>
        <tr>
          <th scope="row">접수일자</th>
          <td>{{ appReceiptDate }}</td>
        </tr>
        <tr>
          <th scope="row">처리일자</th>
          <td>{{ appCompleteDate }}</td>
        </tr>
        <tr>
          <th scope="row">진행상태</th>
          <td>
            <select
              style="width: 50%; text-align: center"
              v-model="progressStatus"
              ref="progressStatusInput"
            >
              <option value="취소">취소</option>
              <option value="신청">신청</option>
              <option value="접수">접수</option>
              <option value="완료">완료</option>
            </select>
          </td>
        </tr>
        <tr>
          <th scope="row">메모</th>
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
      appDate: "",
      appCategory: "",
      appContent: "",
      applicant: "",
      appMethod: "",
      appReceiptDate: "",
      appCompleteDate: "",
      progressStatus: "",
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
            this.$serverUrl +
              "/complaint/getDetailedApplicationList/" +
              this.idx,
            {
              params: this.requestBody,
            }
          )
          .then((res) => {
            this.appDate = res.data.appDate;
            this.appCategory = res.data.appCategory;
            this.appContent = res.data.appContent;
            this.applicant = res.data.applicant;
            this.appMethod = res.data.appMethod;
            this.appReceiptDate = res.data.appReceiptDate;
            this.appCompleteDate = res.data.appCompleteDate;
            this.progressStatus = res.data.progressStatus;
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
        path: "./complaintList",
        query: this.requestBody,
      });
    },
    fnView(idx) {
      this.requestBody.idx = idx;
      this.$router.push({
        path: "./complaintListDetail",
        query: this.requestBody,
      });
    },
    fnSave() {
      if (this.progressStatus == "") {
        alert("접수상태를 입력하세요.");
        this.$refs.progressStatusTextArea.focus();
        return;
      }

      let apiUrl = this.$serverUrl + "/complaint/updateComplaint/" + this.idx;
      this.form = {
        idx: this.idx,
        progressStatus: this.progressStatus,
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
