---
sidebar_position: 4
---

# DevTools

Under construction 🚧

# Installation

Install mute8 plugins

```sh
npm i mute8-plugins
```

# Usage 

Import
```ts
import { DevTools } from 'mute8-plugins'
```

Register store
```ts
const router = newStore({
  value: { ... },
  actions: { ... },
  plugin: DevTools.register("router")
})
```

# How to enable?

- Async import

>If your build target supports top-level await, you can simply call `await DevTools.import()` at the top of the index file.

```ts
import { DevTools } from 'mute8-plugins'
await DevTools.import()
```

- Load script through bundler.
```ts
import "https://paweljastrzebski.github.io/mute8/devtools/v1.mjs"
```

- Insert the script into the HTML head.
```html
<script type="module" src="https://paweljastrzebski.github.io/mute8/devtools/v1.mjs" ></script>
```

# How to open?
Press [Ctrl + Shift + 8] in your application window to open the DevTools dialog.

![DevTools Preview](/img/mute8-devtools.png)