<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style scope>
@import 'bootstrap/dist/css/bootstrap.css';

.router-link-active,
.router-link-exact-active {
   background-color: rgb(27, 27, 27);
   cursor: pointer;
 }
</style>
