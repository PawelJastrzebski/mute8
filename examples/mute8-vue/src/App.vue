<script setup lang="ts">
import Counter from "./examples/Counter.vue"
import Async from "./examples/Async.vue"
import CarStore from "./examples/CarStore.vue"
import { router as routerService } from "./services/router"
import { counter } from "./services/counter"

const selected = routerService.vue.useOne("currentExample")
const count = counter.vue.use()
const router = routerService
</script>

<template>
  <div id='logo'>
    <div></div>
  </div>
  <div id='nav'>
    <button :class="{ active: selected === 'Async' }" @click="router.actions.openExample('Async')">Async</button>
    <button :class="{ active: selected === 'Counter' }" @click="router.actions.openExample('Counter')">Counter</button>
    <button :class="{ active: selected === 'CarStore' }" @click="router.actions.openExample('CarStore')">CarStore</button>
  </div>
  <div class="page" v-if="selected === 'Async'">
    <Async />
  </div>
  <div class="page" v-if="selected === 'CarStore'">
    <CarStore />
  </div>
  <div class="page" v-if="selected === 'Counter'">
    <Counter :msg="count.name" />
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  text-align: center;
}
</style>
