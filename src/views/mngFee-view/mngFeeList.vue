<!-- 
    프로그램명: 관리비 리스트
    최초 작성자: 김동현
    최초 작성일자: 2022년10월21일

    마지막 수정자: 최문준
    마지막 수정일자: 2022년11월14일

                  수정 내용
  NO |              contents                |  Data
   1 | 관리비 검색 년월 추가                  | 2022-11-14
-->

<template>
  <div class="board">
    <h1>관리비</h1>
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
        <col style="width: 35%" />
        <col style="width: 15%" />
        <col style="width: *" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">세대정보</th>
          <td style="float: center">
            &emsp;&emsp;
            <select
              v-model="dongCode"
              @change="onChange($event)"
              style="width: 150px; height: 25px; text-align: center"
            >
              <option value="">---전체---</option>
              <option
                v-for="model in dong_items"
                :key="model.code"
                :value="model.code"
              >
                {{ model.name }}
              </option>
            </select>
            동&emsp;&nbsp;&nbsp;
            <select
              v-model="hoCode"
              style="width: 150px; height: 25px; text-align: center"
            >
              <option value="">---전체---</option>
              <option
                v-for="model in ho_items"
                :key="model.code"
                :value="model.code"
              >
                {{ model.name }}
              </option>
            </select>
            호&emsp;
          </td>
          <th scope="row">면적타입</th>
          <td>
            <select
              v-model="hAreaType"
              style="width: 350px; height: 25px; text-align: center"
            >
              <option value="">----전체----</option>
              <option
                v-for="model in items"
                :key="model.code"
                :value="model.code"
              >
                {{ model.name }}
              </option>
            </select>
          </td>
        </tr>
        <tr>
          <th scope="row">부과년월</th>
          <td style="float: center">
            &emsp;&emsp;
            <select
              v-model="mngYear"
              @change="onChange($event)"
              style="width: 150px; height: 25px; text-align: center"
            >
              <option value="">---전체---</option>
              <option
                v-for="model in dong_items"
                :key="model.code"
                :value="model.code"
              >
                {{ model.name }}
              </option>
            </select>
            년&emsp;&nbsp;&nbsp;
            <select
              v-model="mngMonth"
              style="width: 150px; height: 25px; text-align: center"
            >
              <option value="">---전체---</option>
              <option
                v-for="model in ho_items"
                :key="model.code"
                :value="model.code"
              >
                {{ model.name }}
              </option>
            </select>
            월&emsp;
          </td>
          <th scope="row">검색단위</th>
          <td>
            <input
              type="text"
              style="width: 350px; text-align: center"
              ref="sizeInput"
              v-model="size"
              @keyup.enter="fnSearch"
            />
          </td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="buttons">
    <div class="right">
      <button c class="w3-button w3-round w3-red" @click="fnDelete">
        삭제
      </button>
      <button class="button blue" @click="fnSearch">검색</button>
      <button class="button" @click="fnList">취소</button>
    </div>
  </div>
  <table class="w3-table-all">
    <colgroup>
      <col style="width: 10%" />
      <col style="width: 10%" />
      <col style="width: 10%" />
      <col style="width: 10%" />
      <col style="width: 10%" />
      <col style="width: 10%" />
      <col style="width: 10%" />
    </colgroup>
    <thead>
      <tr>
        <th>No</th>
        <th>동</th>
        <th>호</th>
        <th>평형</th>
        <th>부과년월</th>
        <th>합계</th>
        <th>상세보기</th>
      </tr>
    </thead>
    <tbody>
      <tr class="hi" v-for="(row, i) in list" :key="i">
        <td>{{ row.no }}</td>
        <td>{{ row.dongCode }}</td>
        <td>{{ row.hoCode }}</td>
        <td>{{ row.hAreaType }}</td>
        <td>{{ row.payMonth }}</td>
        <td>{{ "￦" + row.totalMng }}</td>
        <td>
          <div class="table-button-container">
            <button
              class="w3-button w3-round w3-green"
              v-on:click="
                fnView(
                  `${row.dongCode}`,
                  `${row.hoCode}`,
                  `${row.mngYear}`,
                  `${row.mngMonth}`
                )
              "
            >
              <i class="fa fa-remove"></i>상세</button
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
      // selected: [],
      // selectAll: false,
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
      dongCode: this.$route.query.dongCode,
      hoCode: this.$route.query.hoCode,
      hAreaType: this.$route.query.hAreaType,
      dong_items: [],
      ho_items: [],
      mngYear_items: [],
      mngMonth_items: [],
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
        return pageNumber;
      },
    };
  },
  mounted() {
    this.fnGetList();
    this.fnGetDong();
    this.fnGethArea();
  },
  methods: {
    fnGetDong() {
      this.axios
        .get(this.$serverUrl + "/donghoInfo/dongList")
        .then((res) => {
          this.dong_items = res.data.items;
          //alert(JSON.stringify(this.items));
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onChange(event) {
      console.log("event =>" + event.target.value);
      this.fnGetDongho(this.dongCode);
    },
    fnGetDongho(dongCode) {
      this.axios
        .get(this.$serverUrl + "/donghoInfo/donghoList?dongCode=" + dongCode)
        .then((res) => {
          this.ho_items = res.data.items;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fnDelete() {
      var result = confirm("삭제하시겠습니까?");
      if (result) {
        this.axios
          .delete(this.$serverUrl + "/mngFee/deleteMngFeeList/")
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
    fnGethArea() {
      this.axios
        .get(this.$serverUrl + "/donghoInfo/hAreaList")
        .then((res) => {
          this.items = res.data.items;
          //alert(JSON.stringify(this.items));
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fnGetList() {
      this.requestBody = {
        // 데이터 전송
        page: this.page,
        size: this.size,
        dongCode: this.dongCode,
        hoCode: this.hoCode,
        hAreaType: this.hAreaType,
      };

      this.axios
        .get(this.$serverUrl + "/mngFee/getMngFeeList", {
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
    fnView(dongCode, hoCode, mngYear, mngMonth) {
      this.requestBody.dongCode = dongCode;
      this.requestBody.hoCode = hoCode;
      this.requestBody.mngYear = mngYear;
      this.requestBody.mngMonth = mngMonth;
      this.$router.push({
        path: "./detail",
        query: this.requestBody,
      });
    },
    fnWrite() {
      this.$router.push({
        path: "./insert",
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
      this.startDate = "";
      this.dongCode = "";
      this.hoCode = "";

      this.fnGetList();
    },
  },
};
</script>

<style scoped>
.hi:hover {
  background-color: yellow;
}
body {
  padding: 50px;
}
</style>
