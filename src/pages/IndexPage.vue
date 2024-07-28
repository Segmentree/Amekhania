<template>
  <q-page class="row q-pa-md">
    <chat-hub />
  </q-page>
</template>

<script setup>
import ChatHub from 'src/components/chat/ChatHub.vue';
defineOptions({
  name: 'IndexPage',
});
</script>
