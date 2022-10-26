<template>
  <div class="board">
    <h1>계약자료</h1>
    <table>
      <colgroup>
        <col style="width: 18.5%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">제 목</th>
          <td>
            <textarea
              rows="1"
              placeholder="제목을 입력하세요"
              ref="contractTitleInput"
              v-model.trim="contractTitle"
            ></textarea>
          </td>
        </tr>
        <tr>
          <th scope="row">계약일자</th>
          <td>
            <textarea
              rows="1"
              placeholder="계약일자를 입력하세요"
              ref="contractDateInput"
              v-model.trim="contractDate"
            ></textarea>
          </td>
        </tr>
      </tbody>
    </table>
    <br />
    <table>
      <colgroup>
        <col style="width: 18.5%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">내 용</th>
          <td>
            <textarea
              rows="10"
              placeholder="내용을 입력하세요"
              ref="contractContentInput"
              v-model.trim="contractContent"
            ></textarea>
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
        저장</button
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
      idx: this.$route.query.idx,
      contractTitle: "",
      contractDate: "",
      contractContent: "",
      filePath: "",
      fileName: "",
    };
  },
  mounted() {
    this.fnGetView();
  },
  methods: {
    fnGetView() {
      if (this.idx !== undefined) {
        this.axios
          .get(
            this.$serverUrl +
              "/contractDoc/getDetailedContractDocList/" +
              this.idx,
            {
              params: this.requestBody,
            }
          )
          .then((res) => {
            this.contractTitle = res.data.contractTitle;
            this.contractDate = res.data.contractDate;
            this.contractContent = res.data.contractContent;
            this.filePath = res.data.filePath;
            this.fileName = res.data.fileName;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    fnList() {
      delete this.requestBody.idx;
      this.$router.push({
        path: "./contractDocListUpdate",
        query: this.requestBody,
      });
    },
    fnView(idx) {
      this.requestBody.idx = idx;
      this.$router.push({
        path: "./contractDocListDetail",
        query: this.requestBody,
      });
    },
    fnSave() {
      if (this.resvFlag == "") {
        alert("제목을 입력하세요.");
        this.$refs.contractTitleTextArea.focus();
        return;
      }
      if (this.resvFlag == "") {
        alert("계약일자를 입력하세요.");
        this.$refs.contractDateTextArea.focus();
        return;
      }
      if (this.resvFlag == "") {
        alert("내용을 입력하세요.");
        this.$refs.contractContentTextArea.focus();
        return;
      }

      let apiUrl =
        this.$serverUrl + "/contractDoc/updateContractDoc/" + this.idx;
      this.form = {
        idx: this.idx,
        contractTitle: this.contractTitle,
        contractDate: this.contractDate,
        contractContent: this.contractContent,
        filePath: this.filePath,
        fileName: this.fileName,
      };

      var result = confirm("수정하시겠습니까?");
      if (result) {
        //UPDATE
        this.axios
          .patch(apiUrl, this.form)
          .then((res) => {
            console.log("res.data.resultCode: " + res.data.resultCode);
            if (res.data.resultCode == "00") {
              alert("수정되었습니다.");
              //alert(JSON.stringify(res.data.resultMsg));
              this.fnView(res.data.idx);
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
