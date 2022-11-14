<template>
  <div class="board">
    <h1>에너지 관리</h1>
    <div class="common-buttons"></div>
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
              v-model.trim="startDate"
            />
            &emsp;~&emsp;
            <input
              type="date"
              style="width: 150px; text-align: center"
              v-bind:disabled="moveOutDtime == ''"
              v-model.trim="endDate"
            />
          </td>
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
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th scope="row">에너지유형</th>
          <td>
            <select
              v-model="energyType"
              style="width: 350px; height: 25px; text-align: center"
            >
              <option value="">----전체----</option>
              <option
                v-for="model in ems_items"
                :key="model.energyType"
                :value="model.engEnergyType"
              >
                {{ model.energyType }}
              </option>
            </select>
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
      <button class="button blue" @click="fnSearch">검색</button>
      <button class="button" @click="fnList">취소</button>
    </div>
  </div>
  <!-- <table class="w3-table-all">
    <colgroup>
      <col style="width: 5%" />
      <col style="width: 10%" />
      <col style="width: 10%" />
      <col style="width: 10%" />
      <col style="width: 10%" />
      <col style="width: 10%" />
      <col style="width: 10%" />
    </colgroup> -->
  <table
    class="table table-bordered"
    id="dataTable"
    width="100%"
    margin="auto"
    cellspacing="0"
    text-align="center"
  >
    <thead>
      <tr>
        <th rowspan="2" text-align="center">No</th>

        <th rowspan="2">월</th>
        <th rowspan="2">세대</th>
        <th colspan="2" scope="colgroup" id="first">전기</th>
        <th colspan="2" scope="colgroup" id="second">가스</th>
        <th colspan="2" scope="colgroup" id="third">수도</th>
        <th colspan="2" scope="colgroup" id="forth">난방</th>
        <th colspan="2" scope="colgroup" id="fifth">온수</th>
        <th colspan="2" scope="colgroup" id="sixth">기타</th>
        <th rowspan="2">상세보기</th>
      </tr>

      <tr>
        <th scope="col" id="meter">검침</th>
        <th scope="col" id="usage">사용</th>
        <th scope="col" id="meter">검침</th>
        <th scope="col" id="usage">사용</th>
        <th scope="col" id="meter">검침</th>
        <th scope="col" id="usage">사용</th>
        <th scope="col" id="meter">검침</th>
        <th scope="col" id="usage">사용</th>
        <th scope="col" id="meter">검침</th>
        <th scope="col" id="usage">사용</th>
        <th scope="col" id="meter">검침</th>
        <th scope="col" id="usage">사용</th>
      </tr>
    </thead>
    <tbody>
      <tr class="hi" v-for="(row, i) in list" :key="i">
        <td>{{ row.No }}</td>
        <td>{{ row.month }}</td>
        <td>{{ row.dongHo }}</td>
        <th headers="first meter mandatory">{{ row.elecMeter }}</th>
        <th headers="first usage mandatory">{{ row.elecUsage }}</th>
        <th headers="second meter mandatory">{{ row.waterMeter }}</th>
        <th headers="second usage mandatory">{{ row.waterUsage }}</th>
        <th headers="third meter mandatory">{{ row.gasMeter }}</th>
        <th headers="third usage mandatory">{{ row.gasUsage }}</th>
        <th headers="forth meter mandatory">{{ row.heatingMeter }}</th>
        <th headers="forth usage mandatory">{{ row.heatingUsage }}</th>
        <th headers="fifth meter mandatory">{{ row.hotWaterMeter }}</th>
        <th headers="fifth usage mandatory">{{ row.hotWaterUsage }}</th>
        <th headers="sixth meter mandatory">{{ row.airconMeter }}</th>
        <th headers="sixth usage mandatory">{{ row.airconUsage }}</th>

        <td>
          <div class="table-button-container">
            <button
              class="w3-button w3-round w3-green"
              v-on:click="fnView(`${row.idx}`)"
            >
              <i class="fa fa-remove"></i>보기</button
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
      selected: [],
      selectAll: false,
      requestBody: {}, //리스트 페이지 데이터전송
      list: {}, //리스트 데이터
      no: "", //게시판 숫자처리
      dong_items: [],
      ho_items: [],
      items: [],
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
      startDate: this.$route.query.startDate,
      endDate: this.$route.query.endDate,
      dongCode: this.$route.query.dongCode,
      hoCode: this.$route.query.hoCode,
      energyType: this.$route.query.energyType,

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
    this.fnGetDong();
    this.fnGetList();
    this.fnGetEnergyType();
  },
  methods: {
    select() {
      this.selected = [];
      if (!this.selectAll) {
        for (let i in this.list) {
          this.selected.push(this.list[i].idx);
        }
      }
    },
    fnGetEnergyType() {
      this.axios
        .get(this.$serverUrl + "/ems/energyList")
        .then((res) => {
          this.ems_items = res.data.items;
        })
        .catch((err) => {
          console.log(err);
        });
    },
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
      //alert(this.dongCode);
      this.fnGetDongho(this.dongCode);
    },
    fnGetDongho(dongCode) {
      this.axios
        .get(this.$serverUrl + "/donghoInfo/donghoList?dongCode=" + dongCode)
        .then((res) => {
          this.ho_items = res.data.items;
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
        startDate: this.startDate,
        endDate: this.endDate,
        dongCode: this.dongCode,
        hoCode: this.hoCode,
        energyType: this.energyType,
      };
      this.axios
        .get(this.$serverUrl + "/ems/getEMS", {
          params: this.requestBody,
          headers: {},
        })
        .then((res) => {
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
      this.endDate = "";
      this.dongCode = "";
      this.hoCode = "";
      this.energyType = "";
      this.fnGetList();
    },
    fnView(date) {
      console.log(this.startDate);
      if (this.startDate === undefined) {
        alert("시작일을 입력하세요.");
        this.$refs.startDateInput.focus();
        return;
      } else if (this.endDate === undefined) {
        alert("종료일을 입력하세요.");
        this.$refs.endDateInput.focus();
        return;
      } else if (this.dongCode === undefined) {
        alert("동 정보를 입력하세요.");
        this.$refs.dongCodeInput.focus();
        return;
      } else if (this.hoCode === undefined) {
        alert("호 정보를 입력하세요.");
        this.$refs.hoCodeInput.focus();
        return;
      } else if (this.energyType === undefined) {
        alert("에너지유형을 입력하세요.");
        this.$refs.endDateInput.focus();
        return;
      }
      this.requestBody.date = date;
      this.$router.push({
        path: "./detail",
        query: this.requestBody,
      });
    },
  },
};
</script>

<style scoped>
.hi:hover {
  background-color: yellow;
}
/* body {
  padding: 50px;
} */
</style>
