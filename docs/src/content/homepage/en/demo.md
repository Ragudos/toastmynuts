---
title: Demo
description: Test out all the available toasts and options
rank: 4
---

All the available toasts

<div class="flex gap-2 flex-wrap">
    <button data-render-toast="neutral">
        Default
    </button>
    <button data-render-toast="info">
        📗 Info
    </button>
    <button data-render-toast="warning">
       ⚠️ Warning
    </button>
    <button data-render-toast="error">
        🚫 Error
    </button>
    <button data-render-toast="success">
        🎉 Success
    </button>
    <button data-render-toast="promise">
        Promise
    </button>
</div>

All the options. Note that some options can only be changed if the initiated toaster is empty. For example, the ```stackable``` property cannot have its value changed until all toasts in a toaster are gone. This is because, behind the scenes, event listeners are attached to the toast container when the first toast is added to handle the expansion of stackable toasts.

<div class="flex flex-wrap gap-2">
    <button data-render-toast="no-swipe">
        Disable swipe
    </button>
    <button data-render-toast="disable-stack">
        Don't stack
    </button>
    <button data-render-toast="enable-stack">
        Stack
    </button>
</div>

Rich colors

<div class="flex flex-wrap gap-2">
    <button data-render-toast="info" data-rich-color="true">
        📗 Rich Info
    </button>
    <button data-render-toast="warning" data-rich-color="true">
       ⚠️ Rich Warning
    </button>
    <button data-render-toast="error" data-rich-color="true">
        🚫 Rich Error
    </button>
    <button data-render-toast="success" data-rich-color="true">
        🎉 Rich Success
    </button>
    <button data-render-toast="promise" data-rich-color="true">
        Rich Promise
    </button>
</div>

Theme to adjust to light or dark themes. If you want to check for how the default rich colors look like for either themes, you can toggle the page to either ```light``` or ```dark``` via the header.

<div class="flex flex-wrap gap-2">
    <button data-render-toast="neutral" data-theme="light">
        Light
    </button>
    <button data-render-toast="neutral" data-theme="dark">
        Dark
    </button>
    <button data-render-toast="neutral"
    data-theme="system">
        System
    </button>
</div>

Various locations for the toast.

<div class="flex flex-wrap gap-2">
    <button data-render-toast="neutral" data-change-position-x="left" data-change-position-y="top">
        Top Left
    </button>
    <button data-render-toast="neutral" data-change-position-x="middle" data-change-position-y="top">
        Top Middle
    </button>
    <button data-render-toast="neutral" data-change-position-x="right" data-change-position-y="top">
        Top Right
    </button>
    <button data-render-toast="neutral" data-change-position-x="left" data-change-position-y="bottom">
        Bottom Left
    </button>
    <button data-render-toast="neutral" data-change-position-x="middle" data-change-position-y="bottom">
        Bottom Middle
    </button>
    <button data-render-toast="neutral" data-change-position-x="right" data-change-position-y="bottom">
        Bottom Right
    </button>
</button>