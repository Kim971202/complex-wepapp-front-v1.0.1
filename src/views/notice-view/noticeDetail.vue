<!-- 
    최초 작성자: 김동현
    최초 작성일자: 2022년10월21일

    마지막 수정자: 최문준
    마지막 수정일자: 2022년11월14일

                  수정 내용
  NO |              contents                |  Data
   1 | 공지사항 상세보기 그리드 화면 추가      | 2022-11-14
-->

<template>
  <div class="board">
    <h1>공지사항 상세보기</h1>
    <div class="common-buttons"></div>
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
  </div>
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

  <table class="w3-table-all">
    <colgroup>
      <col style="width: 10%" />
      <col style="width: 15%" />
      <col style="width: 15%" />
      <col style="width: *" />
      <col style="width: 10%" />
    </colgroup>
    <thead>
      <tr>
        <th>No</th>
        <th>동</th>
        <th>호</th>
        <th>알림일시</th>
        <th>월패드 알림</th>
      </tr>
    </thead>
    <tbody>
      <tr class="table" v-for="(row, i) in list" :key="i">
        <td>{{ row.No }}</td>
        <td>{{ row.dongCode }}</td>
        <td>{{ row.hoCode }}</td>
        <td>{{ row.sendTime }}</td>
        <td>{{ row.sendResult }}</td>
      </tr>
    </tbody>
  </table>
  <div
    class="pagination w3-bar w3-padding-16 w3-small"
    v-if="paging.totalCount > 0"
  >
    <span class="pg">
      <a
        href="javascript:;"
        @click="fnPage(1)"
        class="first w3-button w3-bar-item w3-border"
        >&lt;&lt;</a
      >
      <a
        href="javascript:;"
        v-if="paging.start_page > 10"
        @click="fnPage(`${paging.start_page - 1}`)"
        class="prev w3-button w3-bar-item w3-border"
        >&lt;</a
      >
      <template v-for="(n, index) in paginavigation()">
        <template v-if="paging.page == n">
          <strong
            class="w3-button w3-bar-item w3-border w3-green"
            :key="index"
            >{{ n }}</strong
          >
        </template>
        <template v-else>
          <a
            class="w3-button w3-bar-item w3-border"
            href="javascript:;"
            @click="fnPage(`${n}`)"
            :key="index"
            >{{ n }}</a
          >
        </template>
      </template>
      <a
        href="javascript:;"
        v-if="paging.total_page > paging.end_page"
        @click="fnPage(`${paging.end_page + 1}`)"
        class="next w3-button w3-bar-item w3-border"
        >&gt;</a
      >
      <a
        href="javascript:;"
        @click="fnPage(`${paging.total_page}`)"
        class="last w3-button w3-bar-item w3-border"
        >&gt;&gt;</a
      >
    </span>
  </div>
</template>

<script>
export default {
  data() {
    //변수생성
    return {
      requestBody: {}, //리스트 페이지 데이터전송
      idx: this.$route.query.idx,
      notiTitle: "",
      startDate: "",
      endDate: "",
      // sendResult: "",
      notiType: "",
      notiContent: "",
      fileName: "",
      items: [],
      // ************************* 상세 보기 아래 결과 관련 내용 추가 ********************* //
      list: {}, //리스트 데이터
      no: "", //게시판 숫자처리
      paging: {
        totalCount: 0,
        total_page: 0,
        page: 0,
        start_page: 0,
        end_page: 0,
        ipp: 0,
      }, //페이징 데이터
      page: this.$route.query.page ? this.$route.query.page : 1,
      size: this.$route.query.size ? this.$route.query.size : 10,
      dongCode: this.$route.query.dongCode,
      hoCode: this.$route.query.hoCode,
      sendTime: this.$route.query.sendTime,
      sendResult: this.$route.query.sendResult,

      paginavigation: function () {
        //페이징 처리 for문 커스텀
        let pageNumber = []; //;
        let start_page = this.paging.start_page;
        let end_page = this.paging.end_page;
        console.log("start_page: %d", start_page);
        console.log("end_page: %d", end_page);

        for (let i = start_page; i <= end_page; i++) {
          pageNumber.push(i);
        }
        return pageNumber;
      },
    };
  },
  mounted() {
    this.fnGetView();
    this.fnCheckView();
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
    fnCheckView() {
      this.requestBody = {
        // 데이터 전송
        page: this.page,
        size: this.size,
        dongCode: this.dongCode,
        hoCode: this.hoCode,
        sendResult: this.sendResult,
        sendTime: this.sendTime,
      };
      this.axios
        .get(this.$serverUrl + "/notice/getNoticeCheckList/" + this.idx, {
          params: this.requestBody,
        })
        .then((res) => {
          if (res.data.resultCode == "00") {
            this.list = res.data.list;
            // this.paging = res.data.paging;
            console.log("-----");
            this.no = this.No;
            //   this.paging.totalCount - (this.paging.page - 1) * this.paging.ipp;
          } else {
            alert(
              "목록을 불러오지 못했습니다.(에러: " + res.data.resultCode + ")"
            );
          }
        })
        .catch((err) => {
          if (err.message.indexOf("Network Error") > -1) {
            alert("네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.");
          } else {
            alert(err.message);
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
