<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <Playground />
  </div>
</template>

<script>
// @ is an alias to /src
import Playground from "@/components/CanvasPlayground.vue";

export default {
  name: "home",
  components: {
    Playground,
  }
};
</script>
