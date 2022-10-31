<template>
  <div class="board">
    <h2>공지사항</h2>
    <div class="common-buttons">
      <button
        type="button"
        class="w3-button w3-round w3-teal"
        v-on:click="fnWrite"
      >
        신규
      </button>
    </div>
    <table>
      <h5 style="color: #2196f3; text-align: left">검색조건 설정</h5>
    </table>
    <table>
      <colgroup>
        <col style="width: 15%" />
        <col style="width: 35%" />
        <col style="width: 15%" />
        <col style="width: *" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">조회기간</th>

          <td style="float: center">
            <input
              type="date"
              style="width: 150px; text-align: center"
              v-model.trim="startTime"
            />
            &emsp;~&emsp;
            <input
              type="date"
              style="width: 150px; text-align: center"
              v-model.trim="endTime"
            />
          </td>
          <th scope="row">공지유형</th>
          <td>
            <select
              v-model="notiType"
              style="width: 150px; height: 25px; text-align: center"
            >
              <option value="전체">전체공지</option>
              <option value="개별">개별공지</option>
            </select>
          </td>
        </tr>
        <tr>
          <th scope="row">알림결과</th>
          <td>
            <select
              v-model="sendResult"
              style="width: 150px; height: 25px; text-align: center"
            >
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
          </td>
          <th scope="row">공지제목</th>
          <td>
            <input
              type="text"
              ref="notiTitleInput"
              v-model.trim="notiTitle"
              @keyup.enter="fnSearch"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
        <colgroup>
          <col style="width: 15%" />
          <col style="width: *" />
        </colgroup>
        <tr>
          <th scope="row">검색단위</th>
          <td colspan="3">
            <input
              type="text"
              ref="sizeInput"
              v-model="size"
              @keyup.enter="fnSearch"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="buttons">
    <div class="right">
      <button class="button blue" @click="fnSearch">검색</button>
      <button class="button" @click="fnList">취소</button>
    </div>
    <!-- <div class="common-buttons">
            <button
              type="button"
              class="w3-button w3-round w3-blue-gray"
              v-on:click="fnSearch"
            >
              검색
            </button> -->
  </div>
  <table class="w3-table-all">
    <colgroup>
      <col style="width: 5%" />
      <col style="width: 10%" />
      <col style="width: * %" />
      <col style="width: 10%" />
      <col style="width: 10%" />
      <col style="width: *" />
      <col style="width: 5%" />
    </colgroup>
    <thead>
      <tr>
        <th>No</th>
        <th>공지유형</th>
        <th>공지제목</th>
        <th>작성자</th>
        <th>게시일자</th>
        <th>만료일자</th>
        <th>알림결과</th>
      </tr>
    </thead>

    <tbody>
      <tr
        class="table"
        v-on:click="fnView(`${row.idx}`)"
        v-for="(row, i) in list"
        :key="i"
      >
        <td>{{ row.No }}</td>
        <td>{{ row.notiType }}</td>
        <td>{{ row.notiTitle }}</td>
        <td>{{ row.notiOwner }}</td>
        <td>{{ row.startDate }}</td>
        <td>{{ row.endDate }}</td>
        <td>{{ row.sendResult }}</td>
      </tr>
    </tbody>
  </table>
  <!-- <br />
        <div class="buttons">
          <div class="right">
            <button class="w3-button w3-round w3-red" v-on:click="fnDelete">
              삭제
            </button>
          </div>
        </div> -->
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
      notiType: this.$route.query.notiType,
      notiTitle: this.$route.query.notiTitle,
      notiOwner: this.$route.query.notiOwner,
      startDate: this.$route.query.startDate,
      endDate: this.$route.query.endDate,
      sendResult: this.$route.query.sendResult,
      dong_itmes: [],
      ho_items: [],
      items: [],

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
        //console.log("pageNumber.length: %d", pageNumber.length);
        return pageNumber;
      },
    };
  },
  mounted() {
    this.fnGetList();
  },
  methods: {
    fnGetList() {
      this.requestBody = {
        // 데이터 전송
        page: this.page,
        size: this.size,
        notiType: this.notiType,
        notiTitle: this.notiTitle,
        notiOwner: this.notiOwner,
        startDate: this.startDate,
        endDate: this.endDate,
        sendResult: this.sendResult,
      };

      this.axios
        .get(this.$serverUrl + "/notice/getNoticeList", {
          params: this.requestBody,
          headers: {},
        })
        .then((res) => {
          //this.list = res.data; //서버에서 데이터를 목록으로 보내므로 바로 할당하여 사용할 수 있다.
          //alert(res.data.resultCode);
          if (res.data.resultCode == "00") {
            this.list = res.data.list;
            this.paging = res.data.paging;
            console.log("-----");
            this.no =
              this.paging.totalCount - (this.paging.page - 1) * this.paging.ipp;
          } else {
            alert("검색에 실패했습니다.(에러: " + res.data.resultCode + ")");
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
    fnView(idx) {
      this.requestBody.idx = idx;
      this.$router.push({
        path: "./noticeListDetail",
        query: this.requestBody,
      });
    },
    fnWrite() {
      this.$router.push({
        path: "./noticeInsert",
      });
    },
    fnSearch() {
      //검색
      this.paging.page = 1;
      this.page = 1;
      console.log(this.paging.page);
      console.log(this.page);

      if (isNaN(this.size)) {
        //alert("검색단위를 숫자로 입력해 주세요.");
        //return;
        this.size = 10;
        this.$refs.sizeInput = this.size;
      }
      this.fnGetList();
    },
    fnPage(n) {
      //console.log(n);
      if (this.page !== n) {
        this.page = n;
        this.fnGetList();
      }
    },
    fnList() {
      this.page = 1;
      this.size = 10;
      this.notiType = "";
      this.notiTitle = "";
      this.notiOwner = "";
      this.startDate = "";
      this.endDate = "";
      this.sendResult = "";

      this.fnGetList();
    },
  },
};
</script>

<style scoped>
.table:hover {
  background-color: #87ceeb;
}
</style>
