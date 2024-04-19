---
title: How to install
description: There are two ways to install ToastMyNuts
rank: 2
---

-   Via CDN like Unpkg

```html
<link rel="stylesheet" href="https://unpkg.com/toastmynuts@2.0.0/dist/styles.css" integrity="sha256-7eQ6VAEIduMDO57CXZFgs0BHnl2Yra0kWf189xqn+pM=" crossorigin="anonymous">
<script src="https://unpkg.com/toastmynuts@2.0.0/dist/index.umd.js" integrity="sha256-NE6HCAqAOOVeap80K1HtFztPRJQLtkWLDIWJhxC711Q=" crossorigin="anonymous"></script>
```

-   Via ES Modules

**Note**: This can only be used on the client, so please take note if you are using
server side stuff. Also, there can only be one instance of a toaster, so if you call ```initializeToast``` again, the returned instance will be the same as the one from the very first invocation.

```ts
import { initializeToast } from "toastmynuts";
import "toastmynuts/styles.css";

// The default config
export const toast = initializeToast({
	// maxVisibleToasts: 3,
	// richColors: true,
	// stackable: true,
	// toastDuration: 10_000,
	// dir: "rtl",
	// theme: "system",
	// closeOnSwipe: true,
	// position: { x: "middle", y: "top" }
});
```
