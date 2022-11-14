<template>
  <meta charset="UTF-8" />
  <div class="board">
    <h1>공지사항</h1>
    <table>
      <colgroup>
        <col style="width: 15%" />
        <col style="width: 35%" />
        <col style="width: 15%" />
        <col style="width: *" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">공지기간</th>
          <td style="float: center">
            <input
              type="date"
              style="width: 150px; text-align: center"
              ref="startDateInput"
              v-model.trim="startDate"
            />
            &emsp;~&emsp;
            <input
              type="date"
              style="width: 150px; text-align: center"
              ref="endDateInput"
              v-model.trim="endDate"
            />
          </td>
          <th scope="row">공지대상</th>
          <td>
            <select
              v-model="notiType"
              ref="notiTypeInput"
              style="width: 350px; height: 25px; text-align: center"
            >
              <option value="">----선택----</option>
              <option value="Y">전체</option>
              <option value="N">개별</option>
            </select>
          </td>
        </tr>
        <tr>
          <th scope="row">제&emsp;목</th>
          <td colspan="3">
            <input
              type="text"
              placeholder="공지사항 제목을 입력하세요."
              ref="notiTitleInput"
              v-model.trim="notiTitle"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">내&emsp;용</th>
          <td colspan="3">
            <textarea
              type="text"
              placeholder="내용을 입력하세요."
              ref="notiContentInput"
              v-model.trim="notiContent"
            ></textarea>
          </td>
        </tr>
        <tr>
          <th scope="row">첨부파일</th>
          <td colspan="3">
            <input
              type="file"
              @change="onFileChange"
              charset="UTF-8"
              id="images"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">세대정보</th>
          <td style="float: center" colspan="3">
            <select
              v-model="dongCode"
              @change="onChange($event)"
              style="width: 100px; height: 25px; text-align: center"
            >
              <option value="">---선택---</option>
              <option value="ALL" :disabled="validated == 1">전체동</option>
              <button @click="disabled = (disabled + 1) % 2">
                Toggle Enable
              </button>
              <input type="text" :disabled="disabled == 1" />
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
              style="width: 100px; height: 25px; text-align: center"
            >
              <option value="">---선택---</option>
              <option value="ALL">전체호</option>
              <option
                v-for="model in ho_items"
                :key="model.code"
                :value="model.code"
              >
                {{ model.name }}
              </option>
            </select>
            호&emsp;&nbsp;&nbsp;
          </td>
        </tr>
        <tr>
          <th>공지 세대 로그</th>
          <td>{{ dongCode }} - {{ hoCode }}</td>
        </tr>
        <tr>
          <th>개별 공지 알림 세대<br />{{ ho_items.length }}</th>
          <select class="form-control" v-model="color">
            <option :key="i" :value="d.v" v-for="(d, i) in ho_items">
              *개별공지 알림할 세대 선택 {{ ho_items.length }}
            </option>
          </select>
          <table v-if="tableShow">
            <tr :key="i" v-for="(d, i) in ho_items">
              <td>
                <input type="checkbox" :value="d.code" v-model="hoCode" />
              </td>
              <td>{{ d.dongCode }} - {{ d.code }}</td>
              <td></td>
            </tr>
          </table>
        </tr>
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
      name: "subari",
      input: "text",
      tableShow: true,
      requestBody: this.$route.query,
      parcelStatus: "",
      dongCode: "",
      hoCode: [],
      parcelCorp: "",
      parcelBoxNo: "",
      mailBoxNo: "",
      receiver: "",
      delFee: "",
      UserID: this.$store.state.loginStore.memberId,
      file: "",
      dong_items: [],
      ho_items: [],
      items: [],
      disabled: 1,
    };
  },
  mounted() {
    this.fnGetDong();
  },
  methods: {
    changeColor() {
      alert(this.color);
    },
    fnClear() {
      this.dongCode = "";
      this.hoCode = "";
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
      if (this.notiType == "Y") {
        this.dongCode = "ALL";
      }
      if (
        this.dongCode == "ALL" ||
        this.notiType == "Y" ||
        this.hoCode == "ALL"
      ) {
        this.tableShow = false;
      } else {
        this.tableShow = true;
      }
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
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile != null) {
        this.onUpload();
      }
    },
    onUpload() {
      const fd = new FormData();
      fd.append("file", this.selectedFile, this.selectedFile.name);
      this.axios
        .post(this.$serverUrl + "/fileUpload/file", fd, {
          responseType: "blob",
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fnFileUpload() {
      this.axios
        .post(this.$serverUrl + "/fileUpload/file", this.file)
        .then((res) => {
          if (!res.data.file) {
            alert("등록되었습니다.");
          } else {
            alert("등록되지 않았습니다.");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fnSave() {
      if (this.notiTitle == undefined) {
        alert("공지사항 제목을 입력하세요");
        this.$refs.parcelStatusInput.focus();
        return;
      } else if (this.notiContent == undefined) {
        alert("공지사항 내용을 입력하세요");
        this.$refs.parcelCorpTextArea.focus();
        return;
      } else if (this.notiType == undefined) {
        alert("공지대상을 입력하세요");
        this.$refs.notiTypeInput.focus();
        return;
      } else if (this.startDate == undefined) {
        alert("시작일자를 입력하세요");
        this.$refs.startDateInput.focus();
        return;
      } else if (this.endDate == undefined) {
        alert("종료일자를 입력하세요");
        this.$refs.endDateInput.focus();
        return;
      }

      let apiUrl = this.$serverUrl + "/notice/postNotice";
      this.form = {
        dongCode: this.dongCode,
        hoCode: this.hoCode,
        notiType: this.notiType,
        notiTitle: this.notiTitle,
        notiContent: this.notiContent,
        startDate: this.startDate,
        endDate: this.endDate,
        notiOwer: this.notiOwer,
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
<style scoped>
input[type="file"] {
  width: 350px;
  max-width: 100%;
  color: #444;
  padding: 5px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #555;
}

input[type="file"]::file-selector-button {
  margin-right: 20px;
  border: none;
  background: #084cdf;
  padding: 10px 20px;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

input[type="file"]::file-selector-button:hover {
  background: #0d45a5;
}
</style>
