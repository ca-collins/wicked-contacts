<template>
  <router-view />
</template>

<script>
import { setupDB } from "./services/db.js";

export default {
  name: "App",
  async created() {
    try {
      await setupDB();
      console.log("Database initialized");
    } catch (error) {
      console.error("Database initialization failed:", error);
    }
  },
};
</script>
