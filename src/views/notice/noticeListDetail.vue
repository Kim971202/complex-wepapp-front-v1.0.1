<template>
  <div class="board">
    <h1>공지사항 내용</h1>
    <div class="common-buttons"></div>
    <table>
      <colgroup>
        <col style="width: 18.5%" />
        <col style="width: auto" />
        <col style="width: 18.5%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">공지제목</th>
          <td>{{ notiTitle }}</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th scope="row">게시일자</th>
          <td>{{ startDate }}</td>
          <th scope="row">만료일자</th>
          <td><span v-html="endDate"></span></td>
        </tr>
        <tr>
          <th scope="row">알림결과</th>
          <td><span v-html="sendResult"></span></td>
          <th scope="row">공지대상</th>
          <td>{{ notiType }}</td>
        </tr>
      </tbody>
    </table>
    <table>
      <colgroup>
        <col style="width: 18.5%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">공지내용</th>
          <td><span v-html="notiContent"></span></td>
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
  //   name: "noticeView",
  //   components: {},
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
    };
  },
  //   computed: {
  //     isEditable() {
  //       var result = false;
  //       var isLogin = this.$store.getters["loginStore/isLogin"];
  //       if (isLogin) {
  //         const writer = this.$store.state.loginStore.memberId;
  //         if (writer == this.boardItem.writer) {
  //           result = true;
  //         }
  //       }
  //       return result;
  //     },
  //   },
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
          this.notiContent = res.data.notiContent.split("\n").join("<br>"); //개행처리
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
        path: "./noticeList",
        query: this.requestBody,
      });
    },
    fnUpdate() {
      this.$router.push({
        path: "./noticeUpdate",
        query: this.requestBody,
      });
    },
    fnDelete() {
      var result = confirm("삭제하시겠습니까?");
      if (result) {
        this.axios
          .delete(this.$serverUrl + "/notice/deletenotice/" + this.idx, {})
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
