<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <!-- logo -->
        <q-avatar
          size="md"
          square
          class="q-mr-sm"
          style="background-color: #f2f2f2"
        >
          <img
            src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg"
            alt="Quasar Logo"
          />
        </q-avatar>
        <q-toolbar-title>
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
