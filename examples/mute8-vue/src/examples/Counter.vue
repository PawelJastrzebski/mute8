<script setup lang="ts">
import { counter, selectName } from '../services/counter';
defineProps<{ msg: string }>()
const count = counter.vue.useOne("count")
const name = selectName()
</script>

<template>
  <h1>{{ msg == "" ? "Empty Name" : msg }}</h1>
  <div class="card">
    <button type="button" @click="counter.count = counter.count + 1">count is {{ count }}</button>
    <div>App Name (direct update) <br />
      <input :value="name" @input="event => counter.name = (event as any).target.value">
    </div>
    <div>App Name (action) <br />
      <input :value="name" @input="event => counter.actions.setName((event as any).target.value)">
    </div>
  </div>
</template>

<style scoped></style>