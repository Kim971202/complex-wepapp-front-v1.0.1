<template>
  <h1>Hello, Vue!</h1>
  <TestComponent2 />
  <h3>{{ userId }}님, 안녕하세요.</h3>
</template>

<script>
import TestComponent2 from "./TestComponent2.vue";

export default {
  name: "TestComponent",
  components: {
    TestComponent2,
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
    userNo: {
      type: Number,
      required: false,
      default: 0,
    },
  },
};
</script>

<style>
h1 {
  color: #42b983;
}
</style>
