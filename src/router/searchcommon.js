// fnGetDong() {
//     this.axios
//       .get(this.$serverUrl + "/donghoInfo/dongList")
//       .then((res) => {
//         this.dong_items = res.data.items;
//         //alert(JSON.stringify(this.items));
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   },
//   onChange(event) {
//     console.log("event =>" + event.target.value);
//     //alert(this.dongCode);
//     this.fnGetDongho(this.dongCode);
//   },
//   fnGetDongho(dongCode) {
//     this.axios
//       .get(this.$serverUrl + "/donghoInfo/donghoList?dongCode=" + dongCode)
//       .then((res) => {
//         this.ho_items = res.data.items;
//         //alert(JSON.stringify(this.items));
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   },
