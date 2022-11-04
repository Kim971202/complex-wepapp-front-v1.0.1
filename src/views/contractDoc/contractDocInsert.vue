<template>
  <div class="board">
    <h1>계약자료 등록</h1>
    <table>
      <colgroup>
        <col style="width: 18.5%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">제&nbsp;&nbsp;&nbsp;목</th>
          <td colspan="1">
            <textarea
              rows="1"
              placeholder="계약명을 입력하세요."
              ref="contractTitleTextarea"
              v-model.trim="contractTitle"
            ></textarea>
          </td>
        </tr>
        <tr>
          <th scope="row">계약일자</th>
          <td style="float: center">
            <input
              type="date"
              style="width: 150px; text-align: center"
              v-model.trim="contractDate"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">내&nbsp;&nbsp;&nbsp;용</th>
          <td colspan="10">
            <textarea
              rows="10"
              placeholder="내용을 입력하세요"
              ref="contractContentInput"
              v-model.trim="contractContent"
            ></textarea>
          </td>
        </tr>
        <tr>
          <input
            type="file"
            @change="onFileChange"
            charset="UTF-8"
            id="images"
          />
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
      id: "",
      contractTitle: "",
      contractDate: "",
      contractContent: "",
      file: "",
      items: [],
    };
  },

  //   mounted() {
  //     this.fnGetList();
  //   },

  methods: {
    fnList() {
      delete this.requestBody.idx;
      this.$router.push({
        path: "./contractDocList",
        query: this.requestBody,
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
      console.log(fd);
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
      if (this.contractTitle == "") {
        alert("제목을 입력하세요");
        this.$refs.contractTitleInput.focus();
        return;
      } else if (this.contractDate == "") {
        alert("계약일을 입력하세요.");
        this.$refs.contractDateInput.focus();
        return;
      } else if (this.contractContent == "") {
        alert("내용을 입력하세요.");
        this.$refs.contractContentInput.focus();
        return;
      }
      let apiUrl = this.$serverUrl + "/contractDoc/uploadContract";
      this.form = {
        contractTitle: this.contractTitle,
        contractDate: this.contractDate,
        contractContent: this.contractContent,
      };

      var result = confirm("등록하시겠습니까?");

      if (result) {
        //INSERT
        this.axios
          .post(apiUrl, this.form)
          .then((res) => {
            console.log("res.data.resultCode: " + res.data.resultCode);
            if (res.data.resultCode == "00") {
              alert("등록이 완료되었습니다.");
              //alert(JSON.stringify(res.data.resultMsg));
              this.fnList();
            } else {
              alert("등록이 완료되지 않았습니다.");
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
