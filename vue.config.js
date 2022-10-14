const target = "http://127.0.0.1:9000";
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
});
module.exports = {
  devServer: {
    proxy: "http://localhost:8080",
  },
};
