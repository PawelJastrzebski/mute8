import { DevTools } from "mute8-plugins";
import { newStore } from "mute8-vue";

type ExampleId = "Async" | "Counter" | "CarStore"
export const router = newStore({
    value: {
        currentExample: "Async"
    },
    actions: {
        openExample(example: ExampleId) {
            this.currentExample = example
        }
    },
    plugin: DevTools.register("router")
})