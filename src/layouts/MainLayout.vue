<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-img src="logo.png" width="80%" />

      <essential-link
        v-for="link in linksList"
        :key="link.title"
        v-bind="link"
      />
    </q-drawer>

    <q-drawer bordered class="q-pa-xs" side="right" v-model="rightDrawerOpen">
      <div id="right-drawer-content" />
    </q-drawer>

    <q-page-container>
      <q-page class="q-py-md q-px-xl">
        <router-view
          @change-right-drawer="rightDrawerOpen = !rightDrawerOpen"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';

defineOptions({
  name: 'MainLayout',
});

const linksList = [
  {
    title: 'Assistant',
    caption: 'Place for think and planning',
    icon: 'smart_toy',
    link: 'Home',
  },
  {
    title: 'Reminders',
    caption: 'Check and manage your reminders',
    icon: 'event',
    link: 'RemindersList',
  },
  {
    title: 'Notes',
    caption: 'Check your notes',
    icon: 'edit_note',
    link: 'NotesList',
  },
  {
    title: 'Tools',
    caption: 'Check your tools',
    icon: 'build',
    link: 'ToolsList',
  },
  {
    title: 'Tools Lab',
    caption: 'Create your own tools',
    icon: 'science',
    link: 'ToolsLab',
  },
  {
    title: 'Settings',
    caption: 'Change your settings',
    icon: 'settings',
    link: 'UserSettings',
  },
];

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
