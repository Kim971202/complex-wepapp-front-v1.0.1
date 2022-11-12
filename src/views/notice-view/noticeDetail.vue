<template>
  <div class="board">
    <h2>공지사항 상세보기</h2>
    <table>
      <colgroup>
        <col style="width: 30%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">공지 제목</th>
          <td>{{ notiTitle }}</td>
        </tr>
        <tr>
          <th scope="row">게시일자</th>
          <td>{{ startDate.replace("T", " ") }}</td>
        </tr>
        <tr>
          <th scope="row">만료일자</th>
          <td>{{ endDate.replace("T", " ") }}</td>
        </tr>
        <tr>
          <th scope="row">월패드알림</th>
          <td>{{ sendResult }}</td>
        </tr>
        <tr>
          <th scope="row">공지대상</th>
          <td>{{ notiType }}</td>
        </tr>
        <tr>
          <th scope="row">첨부파일</th>
          <td>
            {{ fileName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button
              type="button"
              class="w3-button w3-round w3-blue-gray"
              @click="fnDownloadFile"
            >
              다운로드</button
            >&nbsp;
          </td>
        </tr>
        <tr>
          <th scope="row">공지 내용</th>
          <td>{{ notiContent }}</td>
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
      notiTitle: "",
      startDate: "",
      endDate: "",
      sendResult: "",
      notiType: "",
      notiContent: "",
      fileName: "",
      items: [],
    };
  },
  mounted() {
    this.fnGetView();
  },
  methods: {
    fnGetView() {
      this.axios
        .get(this.$serverUrl + "/notice/getDetailedNoticeList/" + this.idx, {
          params: this.requestBody,
        })
        .then((res) => {
          this.notiTitle = res.data.notiTitle;
          this.startDate = res.data.startDate;
          this.endDate = res.data.endDate;
          this.sendResult = res.data.sendResult;
          this.notiType = res.data.notiType;
          this.notiContent = res.data.notiContent;
          this.fileName = res.data.fileName;
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
        path: "./list",
        query: this.requestBody,
      });
    },
    fnUpdate() {
      this.$router.push({
        path: "./update",
        query: this.requestBody,
      });
    },
    fnDownloadFile() {
      const FileDownload = require("js-file-download");
      this.axios
        .get(
          this.$serverUrl + "/fileUpload/download?fileName=" + this.fileName,
          { responseType: "blob" }
        )
        .then((res) => {
          alert("성공적으로 다운로드 하였습니다.");
          FileDownload(res.data, this.fileName);
          console.log(res);
        })
        .catch((err) => {
          alert("현제 접속자가 많아 잠시후에 시도하십시오");
          console.log(err);
        });
    },
    fnDelete() {
      var result = confirm("삭제하시겠습니까?");
      if (result) {
        this.axios
          .delete(this.$serverUrl + "/notice/deleteNotice/" + this.idx, {})
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
