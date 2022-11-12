<template>
  <meta charset="UTF-8" />
  <div class="board">
    <h1>투표 업로드</h1>
    <table>
      <colgroup>
        <col style="width: 20%" />
        <col style="width: 80%" />
        <col style="width: 10%" />
        <col style="width: 10%" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">투표 제목</th>
          <td>
            <input
              type="text"
              placeholder="투표 제목을 입력하세요."
              ref="voteTitleInput"
              v-model.trim="voteTitle"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">투표 내용</th>
          <td>
            <textarea
              type="text"
              placeholder="투표 내용을 입력하세요."
              ref="voteContentInput"
              v-model.trim="voteContent"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">투표 일시</th>
          <td style="float: center">
            <input
              type="date"
              style="width: 150px; text-align: center"
              ref="startDateInput"
              v-model.trim="startDate"
            />
            ~
            <input
              type="date"
              style="width: 150px; text-align: center"
              ref="endDateInput"
              v-model.trim="endDate"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">후보자 등록</th>
          <td>
            <div id="card">
              <div>
                <input id="itemForm" v-on:keypress.enter="addItem" />
                <button @click="addItem">후보 등록</button>
              </div>
              <tr v-for="(item, index) in vItems" :key="index">
                <button @click="deleteItem(index)">X</button>
                {{
                  index + 1 + "번 후보: "
                }}
                {{
                  item.text
                }}
              </tr>
            </div>
          </td>
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
      requestBody: this.$route.query,
      parcelStatus: "",
      dongCode: "",
      hoCode: [],
      file: "",
      dong_items: [],
      ho_items: [],
      title: "투표",
      vItems: [],
    };
  },

  mounted() {
    this.fnGetDong();
  },
  methods: {
    addItem() {
      var input = document.getElementById("itemForm");

      if (input.value !== "") {
        this.vItems.push({
          text: input.value,
        });
        input.value = "";
      }
    },
    deleteItem(index) {
      this.vItems.splice(index, 1);
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
