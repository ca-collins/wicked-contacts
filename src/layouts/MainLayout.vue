<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white text-primary q-pt-sm q-pb-sm">
      <q-toolbar class="q-pl-xl">
        <q-avatar size="lg" square class="q-ml-xl">
          <img src="src/assets/wicked-contacts-logo.png" alt="logo" />
        </q-avatar>
        <q-toolbar-title class="text-h4">
          <span style="font-weight: bold">Wicked</span>Contacts
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainLayout",

  setup() {
    return {};
  },
});
</script>
