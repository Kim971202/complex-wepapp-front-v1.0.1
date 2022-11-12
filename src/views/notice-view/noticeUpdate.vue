<template>
  <meta charset="UTF-8" />
  <div class="board">
    <h1>공지사항 수정</h1>
    <table>
      <colgroup>
        <col style="width: 20%" />
        <!-- <col style="width: 80%" />
        <col style="width: 10%" /> -->
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">공지사항 제목</th>
          <td>
            <input
              type="text"
              placeholder="공지사항 제목을 입력하세요."
              ref="notiTitleInput"
              v-model.trim="notiTitle"
            />
          </td>
        </tr>
        <th scope="row">공지사항 내용</th>
        <td>
          <textarea
            type="text"
            placeholder="공지사항 내용을 입력하세요."
            ref="notiContentInput"
            v-model.trim="notiContent"
          />
        </td>

        <tr>
          <th scope="row">게시일자</th>
          <td>{{ startDate.replace("T", " ") }}</td>
        </tr>
        <tr>
          <th scope="row">만료일자</th>
          <td>{{ endDate.replace("T", " ") }}</td>
        </tr>
        <tr>
          <th scope="row">공지대상</th>
          <td>{{ notiType }}</td>
        </tr>
        <tr>
          <th scope="row">파일명</th>
          <td>
            {{ fileName }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <label type="button" class="w3-button w3-round w3-blue-gray">
              <input
                type="file"
                @change="onFileChange"
                charset="UTF-8"
                id="file"
                hidden
              />
              파일 업로드 </label
            >&nbsp;
            <button
              type="button"
              class="w3-button w3-round w3-blue-gray"
              v-on:click="fnFileDelete"
            >
              파일삭제
            </button>
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
        수정</button
      >&nbsp;
      <button
        type="button"
        class="w3-button w3-round w3-gray"
        v-on:click="fnList"
      >
        목록</button
      >&nbsp;
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
      idx: this.$route.query.idx,
      dongCode: "",
      hoCode: [],
      notiTitle: "",
      notiContent: "",
      startDate: "",
      endDate: "",
      notiType: "",
      UserID: this.$store.state.loginStore.memberId,
      fileName: "",
      dong_items: [],
      ho_items: [],
      items: [],
      disabled: 1,
      fileType: 2,
      fd: "",
    };
  },
  mounted() {
    this.fnGetDong();
    this.fnGetView();
  },
  methods: {
    refreshAll() {
      // 새로고침
      this.$router.go();
    },
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
      this.requestBody = {
        fileType: this.fileType,
      };
      this.fd = new FormData();
      this.fd.append("file", this.selectedFile, this.selectedFile.name);
      this.axios
        .post(this.$serverUrl + "/fileUpload/file", this.fd, {
          params: this.requestBody,
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
      this.requestBody = {
        fileType: this.fileType,
      };
      this.axios
        .post(this.$serverUrl + "/fileUpload/file", this.fileName, {
          params: this.requestBody,
        })
        .then((res) => {
          if (!res.data.fileName) {
            alert("등록되었습니다.");
          } else {
            alert("등록되지 않았습니다.");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fnFileDelete() {
      this.requestBody = {
        fileName: this.fileName,
        fileType: this.fileType,
        idx: this.idx,
        fd: this.fd,
      };
      var result = confirm("파일을 삭제하시겠습니까?");
      if (result) {
        this.axios
          .delete(this.$serverUrl + "/fileUpload/deleteFile", {
            params: this.requestBody,
          })
          .then((res) => {
            if (!res.data.fileName) {
              alert("삭제되었습니다.");
            } else {
              alert("삭제되지 않았습니다.");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      this.refreshAll();
    },
    fnSave() {
      let apiUrl = this.$serverUrl + "/notice/updateNotice";
      this.form = {
        dongCode: this.dongCode,
        hoCode: this.hoCode,
        notiType: this.notiType,
        notiTitle: this.notiTitle,
        notiContent: this.notiContent,
        idx: this.idx,
      };

      var result = confirm("수정하시겠습니까?");

      if (result) {
        //INSERT
        this.axios
          .put(apiUrl, this.form)
          .then((res) => {
            console.log("res.data.resultCode: " + res.data.resultCode);
            if (res.data.resultCode == "00") {
              //this.fnList();
              this.refreshAll();
            } else {
              alert("수정되지 않았습니다.");
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
