<template>
  <div class="board">
    <h1>공지사항 업로드</h1>
    <table>
      <colgroup>
        <col style="width: auto" />
        <col style="width: 20%" />
        <col style="width: 10%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">공지사항 제목</th>
          <td>
            <input
              type="text"
              placeholder="공지사항 제목을 입력하세요."
              ref="titleInput"
              v-model.trim="title"
            />
          </td>
          <th scope="row">공지사항 내용</th>
          <td>
            <textarea
              type="text"
              placeholder="공지사항 내용을 입력하세요."
              ref="titleInput"
              v-model.trim="title"
            />
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <th scope="row">공지대상</th>
          <button
            type="button"
            class="w3-button w3-round w3-blue-gray"
            v-on:click="fnGetList"
          >
            검색
          </button>
          <td>
            <select
              v-model="hnSendFlag"
              style="width: 150px; height: 25px; text-align: center"
            >
              <option value="">----선택----</option>
              <option value="Y">전체</option>
              <option value="N">개별</option>
            </select>
          </td>
          <th scope="row">공지기간</th>
          <td style="float: center">
            <input
              type="date"
              style="width: 150px; text-align: center"
              v-bind:disabled="moveOutDtime == ''"
              v-model.trim="moveOutDtimeStart"
            />
            ~
            <input
              type="date"
              style="width: 150px; text-align: center"
              v-bind:disabled="moveOutDtime == ''"
              v-model.trim="moveOutDtimeEnd"
            />
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <input type="file" @change="onFileSelected" />
          <button @click="onUpload">Upload</button>
        </tr>
        <tr>
          <th scope="row">동호</th>
          <td style="float: center">
            <select
              v-model="dongCode"
              @change="onChange($event)"
              style="width: 100px; height: 25px; text-align: center"
            >
              <option value="">---전체---</option>
              <option value="ALL">전체동</option>
              <option
                v-for="model in dong_items"
                :key="model.code"
                :value="model.code"
              >
                {{ model.name }}
              </option>
            </select>
            동&nbsp;&nbsp;
            <select
              v-model="hoCode"
              style="width: 100px; height: 25px; text-align: center"
            >
              <option value="">---전체---</option>
              <option value="ALL">전체호</option>
              <option
                v-for="model in ho_items"
                :key="model.code"
                :value="model.code"
              >
                {{ model.name }}
              </option>
            </select>
            &nbsp;&nbsp;호
          </td>
        </tr>
      </tbody>
    </table>
    <table class="w3-table-all">
      <colgroup>
        <col style="width: 10%" />
        <col style="width: 15%" />
      </colgroup>
      <thead>
        <tr>
          <th>동</th>
          <th>호</th>
        </tr>
      </thead>
      <tr v-for="(row, i) in list" :key="i">
        <td>{{ row.dongCode }}</td>
        <td>{{ row.hoCode }}</td>
      </tr>
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
        목록</button
      >&nbsp;
      <button
        type="button"
        class="w3-button w3-round w3-blue-gray"
        v-on:click="fnClear"
      >
        초기화</button
      >&nbsp;
    </div>
  </div>
</template>

<script>
export default {
  data() {
    //변수생성
    return {
      requestBody: this.$route.query,
      parcelStatus: "",
      dongCode: this.$route.query.dongCode,
      hoCode: this.$route.query.hoCode,
      parcelCorp: "",
      parcelBoxNo: "",
      mailBoxNo: "",
      receiver: "",
      delFee: "",
      file: "",
      dong_items: [],
      ho_items: [],
      hoArray: [],
      items: [],
    };
  },
  mounted() {
    this.fnGetDong();
    this.fnGetList();
  },
  methods: {
    fnGetList() {
      this.requestBody = {
        // 데이터 전송
        dongCode: this.dongCode,
        hoCode: this.hoCode,
      };

      this.axios
        .get(this.$serverUrl + "/donghoInfo/donghoListTest", {
          params: this.requestBody,
          headers: {},
        })
        .then((res) => {
          //this.list = res.data; //서버에서 데이터를 목록으로 보내므로 바로 할당하여 사용할 수 있다.
          //alert(res.data.resultCode);
          if (res.data.resultCode == "00") {
            this.list = res.data.list;
            console.log("-----");
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
      console.log(
        this.axios.get(this.$serverUrl + "/donghoInfo/donghoListTest", {
          params: this.requestBody,
          headers: {},
        })
      );
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
    },
    onUpload() {
      const fd = new FormData();
      fd.append("file", this.selectedFile, this.selectedFile.name);
      this.axios
        .post(this.$serverUrl + "/fileUpload/file", fd)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fnClear() {
      this.dongCode = "";
      this.hoCode = "";
      this.hoArray = "";
    },
    fnList() {
      delete this.requestBody.idx;
      this.$router.push({
        path: "./list",
        query: this.requestBody,
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
          this.hoArray = res.data.items;
          //alert(JSON.stringify(this.items));
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fnSave() {
      if (this.title == "") {
        alert("수령여부 입력 필요");
        this.$refs.parcelStatusInput.focus();
        return;
      } else if (this.contents == "") {
        alert("택배 회사를 입력 하세요.");
        this.$refs.parcelCorpTextArea.focus();
        return;
      }

      let apiUrl = this.$serverUrl + "/parcel/postParcel";
      this.form = {
        parcelStatus: this.parcelStatus,
        dongCode: this.dongCode,
        hoCode: this.hoCode,
        parcelCorp: this.parcelCorp,
        parcelBoxNo: this.parcelBoxNo,
        mailBoxNo: this.mailBoxNo,
        receiver: this.receiver,
        delFee: this.delFee,
        UserID: this.UserID,
      };

      var result = confirm("등록하시겠습니까?");

      if (result) {
        //INSERT
        this.axios
          .post(apiUrl, this.form)
          .then((res) => {
            console.log("res.data.resultCode: " + res.data.resultCode);
            if (res.data.resultCode == "00") {
              //alert("글이 등록되었습니다.");
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
