<template>
  <div class="board">
    <h1>주민투표 상세보기</h1>
    <div class="common-buttons"></div>
    <table>
      <colgroup>
        <col style="width: 18.5%" />
        <col style="width: " />
      </colgroup>
      <tbody>
        <tr>
          <th scope="row">투표제목</th>
          <td class="title">{{ voteTitle }}</td>
        </tr>
        <tr>
          <th scope="row">시작일시</th>
          <td>{{ vStartDTime }}</td>
        </tr>
        <tr>
          <th scope="row">마감일시</th>
          <td>{{ vEndDTime }}</td>
        </tr>
        <tr>
          <th scope="row">항목</th>
          <table>
            <tr v-for="(item, index) in voteItems" v-bind:key="index">
              <td>
                <input type="checkbox" value="all" v-model="allSelected" />
              </td>
              <td>{{ item.itemNo }}</td>
              <td>{{ item.itemContent }}</td>
            </tr>
          </table>
        </tr>
      </tbody>
    </table>

    <div class="common-buttons">
      <button
        type="button"
        class="w3-button w3-round w3-blue-gray"
        v-on:click="fnUpdate"
      >
        수정</button
      >&nbsp;
      <button
        type="button"
        class="w3-button w3-round w3-red"
        v-on:click="fnDelete"
      >
        삭제</button
      >&nbsp;
      <button
        type="button"
        class="w3-button w3-round w3-blue"
        v-on:click="fnList"
      >
        투표마감</button
      >&nbsp;
      <button
        type="button"
        class="w3-button w3-round w3-green"
        v-on:click="fnList"
      >
        결과보기
      </button>
      &nbsp;
      <button
        type="button"
        class="w3-button w3-round w3-black"
        v-on:click="fnList"
      >
        종료</button
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
      idx: this.$route.query.idx,
      voteTitle: "",
      vStartDTime: "",
      vEndDTime: "",
      voteItems: [],
    };
  },
  mounted() {
    this.fnGetView();
  },
  methods: {
    fnGetView() {
      this.axios
        .get(this.$serverUrl + "/vote/getDetailedVoteAgenda/", {
          params: this.requestBody,
        })
        .then((res) => {
          this.voteTitle = res.data.voteTitle;
          this.vStartDTime = res.data.vStartDTime;
          this.vEndDTime = res.data.vEndDTime;
          this.voteItems = res.data.voteItems;
        })
        .catch((err) => {
          if (err.message.indexOf("Network Error") > -1) {
            alert("네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.");
          }
        });
    },
    fnList() {
      delete this.requestBody.idx;
      this.$router.push({
        path: "./list",
        query: this.requestBody,
      });
    },
    fnUpdate() {
      this.$router.push({
        path: "./update",
        query: this.requestBody,
      });
    },
    fnDelete() {
      var result = confirm("삭제하시겠습니까?");
      if (result) {
        this.axios
          .delete(this.$serverUrl + "/vote/deleteVoteAgenda/" + this.idx, {})
          .then((res) => {
            console.log("res.data.resultCode: " + res.data.resultCode);
            if (res.data.resultCode == "00") {
              alert("삭제되었습니다.");
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
  },
};
</script>
<style scoped></style>
