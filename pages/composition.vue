<template>
  <div>
    <h1>Hello World</h1>
  </div>
</template>

<script>
import {
  ref,
  useContext,
  computed,
  onBeforeMount,
  watch,
} from "@nuxtjs/composition-api";

export default {
  setup() {
    // const { store, $nuxtSocket } = useContext();
    const ctx = useContext();
    onBeforeMount(async () => {
      const socket = ctx.$nuxtSocket({ channel: "/videochat" });
      // console.log("useContext", useContext());
      // console.log("window.$nuxt", window.$nuxt);
      // console.log("nuxtSockett", $nuxtSocket);

      // let socket = $nuxtSocket({ channel: "/videochat" });
    });
  },
};
</script>

<style></style>
