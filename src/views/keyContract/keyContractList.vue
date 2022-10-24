<template>
  <div class="board">
    <h2>주요연락처</h2>
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
      <colgroup>
        <col style="width: 15%" />
        <col style="width: *" />
        <col style="width: 15%" />
        <col style="width: *" />
        <col style="width: 15%" />
        <col style="width: *" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">구분</th>
          <td>
            <input
              type="text"
              ref="titleInput"
              placeholder="단지시설/주변상가/공공기관/기타시설 중 하나를 입력하세요"
              v-model.trim="contractFlag"
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
      <button class="w3-button w3-round w3-red" @click="fnDelete">삭제</button>
      <!-- <button class="button" @click="fnList">취소</button> -->
    </div>
  </div>
  <!-- 체크박스 추가 -->
  <div class="text-uppercase text-bold">id selected: {{ selected }}</div>
  <!-- ------------ -->
  <table class="w3-table-all">
    <colgroup>
      <col style="width: 5%" />
      <col style="width: 5%" />
      <col style="width: 20%" />
      <col style="width: 20%" />
      <col style="width: 30%" />
      <col style="width: *" />
      <col style="width: 5%" />
    </colgroup>
    <thead>
      <tr>
        <!-- 체크박스 추가 -->
        <label class="form-checkbox">
          <input type="checkbox" v-model="selectAll" @click="select" />
          <i class="form-icon"></i>
        </label>
        <!-- ------------ -->
        <th>No</th>
        <th>구분</th>
        <th>시설명</th>
        <th>연락처</th>
        <th>등록일시</th>
        <th>수정</th>
      </tr>
    </thead>

    <tbody>
      <!-- <tr
        class="table"
        v-on:click="fnView(`${row.idx}`)"
        v-for="(row, i) in list"
        :key="i"
      ></tr> -->
      <!-- 체크박스 추가 -->
      <tr class="table" v-for="(row, i) in list" :key="i">
        <td>
          <label class="form-checkbox">
            <input type="checkbox" :value="row.idx" v-model="selected" />
            <i class="form-icon"></i>
          </label>
        </td>
        <!-- --------------------------------------------------------------------------- -->
        <td>{{ row.No }}</td>
        <td>{{ row.contractFlag }}</td>
        <td>{{ row.facilityName }}</td>
        <td>{{ row.phoneNum }}</td>
        <!-- <td>{{ row.parcelStatus }}</td> -->
        <td>{{ row.insertDTime }}</td>
        <td>
          <div class="table-button-container">
            <button
              class="w3-button w3-round w3-red"
              v-on:click="fnView(`${row.idx}`)"
            >
              <i class="fa fa-remove"></i> Edit</button
            >&nbsp;&nbsp;
          </div>
        </td>
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
      /** 체크박스 추가 */
      selected: [],
      selectAll: false,
      /************** */
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
      contractFlag: this.$route.query.contractFlag,
      facilityName: this.$route.query.facilityName,
      phoneNum: this.$route.query.phoneNum,
      insertDTime: this.$route.query.insertDTime,

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
    /** 체크박스 추가 */
    select() {
      this.selected = [];
      if (!this.selectAll) {
        for (let i in this.list) {
          this.selected.push(this.list[i].idx);
        }
      }
    },
    /************** */
    fnGetList() {
      this.requestBody = {
        // 데이터 전송
        page: this.page,
        size: this.size,
        contractFlag: this.contractFlag,
        facilityName: this.facilityName,
        phoneNum: this.phoneNum,
        insertDTime: this.insertDTime,
      };

      this.axios
        .get(this.$serverUrl + "/keyContract/getKeyContract", {
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
        path: "./keyContractUpdate",
        query: this.requestBody,
      });
    },
    fnWrite() {
      this.$router.push({
        path: "./keyContractInsert",
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
      this.contractFlag = "";
      this.facilityName = "";
      this.phoneNum = "";
      this.insertDTime = "";

      this.fnGetList();
    },

    fnDelete() {
      var result = confirm("삭제하시겠습니까?");
      console.log("this.selected.length: " + this.selected.length);
      for (let i = 0; i < this.selected.length; ++i) {
        // this.selected.push(this.list[i].idx);
        if (result) {
          this.axios
            .delete(
              this.$serverUrl +
                "/keyContract/deleteKeyContract/" +
                this.list[i].idx,
              {}
            )
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
      }
    },
  },
};
</script>

<style scoped>
/* .table:hover {
  background-color: #87ceeb;
} */
</style>
