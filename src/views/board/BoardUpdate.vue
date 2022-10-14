<template>
  <div class="board">
    <h1>This is an board edit page</h1>
    <table>
      <colgroup>
        <col style="width: 18.5%" />
        <col style="width: auto" />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">작성자</th>
          <td>{{ author }}</td>
        </tr>
        <tr>
          <th scope="row">제목</th>
          <td>
            <input
              type="text"
              placeholder="제목을 입력하세요."
              ref="titleInput"
              v-model.trim="title"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">내용</th>
          <td>
            <textarea
              rows="10"
              placeholder="내용을 입력하세요."
              ref="contentTextarea"
              v-model.trim="contents"
            ></textarea>
          </td>
        </tr>
        <tr>
          <th scope="row">작성일자</th>
          <td>{{ created_at }}</td>
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

      title: "",
      author: "",
      contents: "",
      created_at: "",
    };
  },
  mounted() {
    this.fnGetView();
  },
  methods: {
    fnGetView() {
      if (this.idx !== undefined) {
        this.axios
          .get(this.$serverUrl + "/vueboard/detail/" + this.idx, {
            params: this.requestBody,
          })
          .then((res) => {
            this.title = res.data.title;
            this.author = res.data.author;
            this.contents = res.data.contents;
            this.created_at = res.data.created_at;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    fnList() {
      delete this.requestBody.idx;
      this.$router.push({
        path: "./list",
        query: this.requestBody,
      });
    },
    fnView(idx) {
      this.requestBody.idx = idx;
      this.$router.push({
        path: "./detail",
        query: this.requestBody,
      });
    },
    fnSave() {
      if (this.title == "") {
        alert("제목을 입력하세요.");
        this.$refs.titleInput.focus();
        return;
      } else if (this.contents == "") {
        alert("내용을 입력하세요.");
        this.$refs.contentsTextarea.focus();
        return;
      }

      let apiUrl = this.$serverUrl + "/vueboard/write";
      this.form = {
        idx: this.idx,
        title: this.title,
        contents: this.contents,
        author: this.author,
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
<style scoped>
/* .board {
  width: 800px;
  margin: 20px auto;
}
.board table {
  width: 100%;
  border-top: 2px solid #1d4281;
  border-spacing: 0;
}
.board table th {
  padding: 8px 10px 10px 10px;
  vertical-align: middle;
  color: #1d4281;
  font-size: 14px;
  border-bottom: 1px solid #ccc;
  background: #f8f8f8;
}
.board table td {
  padding: 7px 20px 9px 20px;
  text-align: left;
  vertical-align: middle;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
  line-height: 150%;
}
.board table td input,
.board table td textarea {
  width: 100%;
  color: #000 !important;
}
.buttons {
  position: relative;
  height: 32px;
  margin-top: 20px;
}
.buttons > div.right {
  position: absolute;
  height: 32px;
  right: 0;
}
.buttons > div > .button {
  overflow: visible;
  cursor: pointer;
  min-width: 125px;
  height: 32px;
  margin: 0 2px;
  padding: 0 15px;
  line-height: 32px;
  font-size: 14px;
  border: 1px solid #dfdfdf;
  background: #fff;
  border-radius: 10px;
}
.buttons > div > .button.blue {
  color: #fff;
  border-color: #0099d2 !important;
  background: #0099d2 !important;
} */
</style>
