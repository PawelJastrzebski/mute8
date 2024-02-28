import { DevTools } from "mute8-plugins";
import { newStore } from "mute8-vue";

export const counter = newStore({
  value: {
    name: "Vite + Vue + Mute8",
    count: 0
  },
  actions: {
    setName(name: string) {
      this.name = name
    }
  },
  plugin: DevTools.register("couter")
})

export const selectName = () => counter.vue.select(v => v.name);

setInterval(() => {
  counter.count = counter.count + 1000;
}, 10)