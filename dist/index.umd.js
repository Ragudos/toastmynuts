(()=>{var c="__toastmynuts__",E="__toastmynuts__wrapper",b="__toastmynuts__toast",A="__toastmynuts__message",C="__toastmynuts__close-btn",w={x:"middle",y:"top"},v=3;function L(){return Math.random().toString(16).slice(2)}var m=class o{static _instance;_toasts;_toastToBeRemoved;static _config;static _toastContainerMouseEnterListener;static _toastContainerMouseLeaveListener;static _toastContainerKeyDownListener;static _toastContainerKeyUpListener;static _mouseLeaveEnterListenerDebouncer;constructor(){this._toasts=[],this._toastToBeRemoved=[]}static getInstance(i){return o._instance||(o._instance=new o,o._config=i),o._instance}async addToast(i,s="neutral"){let t=this._getOrCreateToastContainer(),e=L(),[r,n]=this._createCloseBtn(e),[a,d]=this._createToastElement(e,s),l=document.createElement("div"),u=this._createMessageElement(i),g=setTimeout(()=>{if(o._config&&o._config.ignoreErrors)try{this.removeToast(e)}catch{}else this.removeToast(e)},1e4);l.appendChild(u),l.appendChild(r),a.appendChild(l),t.appendChild(a);let _=a.style.height;a.style.height="auto";let p=a.getBoundingClientRect().height,T=`${p}px`;a.style.height=_,t.style.setProperty("--_front-toast-height",T),a.style.setProperty("--_initial-height",T),a.removeAttribute("data-toast-state"),this._moveToastsDown(p);let y=Date.now();return this._toasts.push({_message:i,_type:s,_controllers:[n,d],_timeout:g,_duration:1e4,_id:e,_created_on:y,_timeout_created_on:y}),e}removeToast(i){let s,t;for(let d=0;d<this._toasts.length;++d)this._toasts[d]._id===i&&(s=this._toasts[d],t=d);if(!s||t===void 0)throw new Error("[ToastMyNuts] Could not find toast with ID "+i+" virtually");let e=document.getElementById(s._id);if(!e)throw new Error("[ToastMyNuts] Could not find toast with ID "+i+" in the DOM");if(e.getAttribute("data-toast-state")==="closing")return;for(;s._controllers.length!==0;)s._controllers.pop()?.abort();let n=e.getAttribute("data-toast-state")==="hidden";if(s._timeout!==void 0&&clearTimeout(s._timeout),n){this._removeToastPermanently(i,!0),this._toasts.splice(t,1);for(let d=t;d<this._toasts.length;++d){let l=this._toasts[d];if(!l)continue;let u=document.getElementById(l._id);if(!u)throw new Error("[ToastMyNuts] Could not find toast with ID "+l._id+" in the DOM");u.style.setProperty("--_z-idx",d.toString())}return}e.setAttribute("data-toast-state","closing");let a=parseFloat(getComputedStyle(e).transitionDuration);this._moveToastsUp(t),this._toastToBeRemoved.push(s),this._toasts.splice(t,1);for(let d=t;d<this._toasts.length;++d){let l=this._toasts[d];if(!l)continue;let u=document.getElementById(l._id);if(!u)throw new Error("[ToastMyNuts] Could not find toast with ID "+l._id+" in the DOM");u.style.setProperty("--_z-idx",d.toString())}setTimeout(()=>{this._removeToastPermanently(i,!1)},a*1e3)}_removeToastPermanently(i,s){let t,e;if(s)for(let n=0;n<this._toasts.length;++n)this._toasts[n]._id===i&&(t=this._toasts[n],e=n);else for(let n=0;n<this._toastToBeRemoved.length;++n)this._toastToBeRemoved[n]._id===i&&(t=this._toastToBeRemoved[n],e=n);if(!t)throw new Error("[ToastMyNuts] Could not find toast with ID "+i+" virtually");if(document.getElementById(t._id)?.remove(),!s&&e!==void 0&&this._toastToBeRemoved.splice(e,1),this._toasts.length===0){let n=document.getElementById(E),a=document.getElementById(c);o._toastContainerMouseEnterListener&&a?.removeEventListener("pointerenter",o._toastContainerMouseEnterListener),o._toastContainerMouseLeaveListener&&a?.removeEventListener("pointerleave",o._toastContainerMouseLeaveListener),o._toastContainerKeyDownListener&&window.removeEventListener("keydown",o._toastContainerKeyDownListener),o._toastContainerKeyUpListener&&window.removeEventListener("keyup",o._toastContainerKeyUpListener),n?.remove()}}_removeTimeoutOfToasts(){let i=Date.now();for(let s=0;s<this._toasts.length;++s){let t=this._toasts[s];if(t._timeout){let e=t._duration-(i-t._timeout_created_on);if(e<=0)continue;clearTimeout(t._timeout),t._duration=e,t._timeout=void 0}}}_addTimeoutToToasts(){let i=Date.now();for(let s=0;s<this._toasts.length;++s){let t=this._toasts[s];t._timeout||(t._timeout_created_on=i,t._timeout=setTimeout(()=>{if(o._config&&o._config.ignoreErrors)try{this.removeToast(t._id)}catch{}else this.removeToast(t._id)},t._duration))}}_moveToastsUp(i){let s=o._config?.maxVisibleToasts??v;for(let t=0;t<i;++t){let e=this._toasts[t];if(!e)throw new Error("[ToastMyNuts] Could not find toast with index "+t+" virtually");let r=document.getElementById(e._id);if(!r)throw new Error("[ToastMyNuts] Could not find toast with ID "+e._id+" in the DOM");let n=0;for(let a=t+1;a<this._toasts.length;++a){if(a===i)continue;let d=this._toasts[a],l=document.getElementById(d._id);if(!l)throw new Error("[ToastMyNuts] Could not find toast with ID "+d._id+" in the DOM");let u=parseFloat(l.style.getPropertyValue("--_initial-height"));n+=u}r.style.setProperty("--_height-offset",`${n}px`),r.style.setProperty("--_idx",(this._toasts.length-t-2).toString()),t===this._toasts.length-2&&r.setAttribute("data-front-toast","true"),this._toasts.length-t<=s+1&&r.getAttribute("data-toast-state")==="hidden"&&(r.removeAttribute("data-toast-state"),r.removeAttribute("aria-hidden"))}}_moveToastsDown(i){let s=o._config?.maxVisibleToasts??v;for(let t=0;t<this._toasts.length;++t){let e=this._toasts[t],r=document.getElementById(e._id);if(!r)throw new Error("[ToastMyNuts] Could not find toast with ID "+e._id);let n=i;for(let a=t+1;a<this._toasts.length;++a){let d=this._toasts[a],l=document.getElementById(d._id);if(!l)throw new Error("[ToastMyNuts] Could not find toast with ID "+d._id);let u=parseFloat(l.style.getPropertyValue("--_initial-height"));n+=u}r.style.setProperty("--_height-offset",`${n}px`),r.style.setProperty("--_idx",(this._toasts.length-t).toString()),r.removeAttribute("data-front-toast"),this._toasts.length-t>=s&&r.getAttribute("data-toast-state")!=="closing"&&(r.setAttribute("data-toast-state","hidden"),r.setAttribute("aria-hidden","true"))}}_getOrCreateToastContainer(){let i=document.getElementById(c);if(!i){let s=document.createElement("div");s.id=E,s.setAttribute("aria-label","Notifications (Alt + T)");let t=document.createElement("ol");t.id=c;let e=o._config?.stackable===!0||o._config?.stackable===void 0;return t.setAttribute("data-position-x",o._config?.position?.x||w.x),t.setAttribute("data-position-y",o._config?.position?.y||w.y),t.setAttribute("data-stackable",e?"true":"false"),t.setAttribute("data-expanded",e?"false":"true"),e&&(o._toastContainerMouseEnterListener=()=>{t.getAttribute("data-did-toggle-expansion")!=="true"&&(o._mouseLeaveEnterListenerDebouncer&&clearTimeout(o._mouseLeaveEnterListenerDebouncer),t.setAttribute("data-expanded","true"),t.removeAttribute("data-should-stack"),this._removeTimeoutOfToasts())},o._toastContainerMouseLeaveListener=()=>{o._mouseLeaveEnterListenerDebouncer&&clearTimeout(o._mouseLeaveEnterListenerDebouncer),o._mouseLeaveEnterListenerDebouncer=setTimeout(()=>{if(t.getAttribute("data-did-toggle-expansion")==="true")return;let r=t.children;for(let n=0;n<r.length;++n)if(r[n].getAttribute("data-is-swiping")==="true"){t.setAttribute("data-should-stack","true");return}t.setAttribute("data-expanded","false"),this._addTimeoutToToasts()},50)},o._toastContainerKeyDownListener=r=>{if(r.altKey&&r.code==="KeyT"){if(t.getAttribute("data-did-toggle-expansion")==="true")return;o._mouseLeaveEnterListenerDebouncer&&clearTimeout(o._mouseLeaveEnterListenerDebouncer);let n=t.getAttribute("data-expanded")==="false";t.setAttribute("data-expanded",n?"true":"false"),t.setAttribute("data-did-toggle-expansion","true"),n?this._removeTimeoutOfToasts():this._addTimeoutToToasts()}},o._toastContainerKeyUpListener=r=>{r.code==="KeyT"&&t.setAttribute("data-did-toggle-expansion","false")},t.addEventListener("pointerenter",o._toastContainerMouseEnterListener),t.addEventListener("pointerleave",o._toastContainerMouseLeaveListener),window.addEventListener("keydown",o._toastContainerKeyDownListener),window.addEventListener("keyup",o._toastContainerKeyUpListener)),s.appendChild(t),document.body.appendChild(s),t}if(!(i instanceof HTMLOListElement))throw new Error("[ToastMyNuts] Colliding ID "+c+".");return i}_createMessageElement(i){let s=document.createElement("div");return s.textContent=i,s.classList.add(A),s}_createToastElement(i,s){let t=new AbortController,e=document.createElement("li");return e.id=i,e.classList.add(b),e.style.setProperty("--_idx","0"),e.style.setProperty("--_z-idx",this._toasts.length.toString()),e.setAttribute("data-toast-type",s),e.setAttribute("data-toast-state","entering"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("data-front-toast","true"),e.addEventListener("pointerdown",r=>{e.setAttribute("data-is-swiping","true");let n=r.screenY;e.style.setProperty("--_original-position",n.toString())},{signal:t.signal}),window.addEventListener("pointerup",r=>{let n=parseFloat(e.style.getPropertyValue("--_swipe-offset"));e.setAttribute("data-is-swiping","false"),Math.abs(n)>15?(e.setAttribute("data-exit-swipe","true"),this.removeToast(i)):(e.style.setProperty("--_swipe-offset","0px"),e.style.removeProperty("--_original-position"));let a=document.getElementById(c);if(!a){if(o._config?.ignoreErrors)return;throw new Error("[ToastMyNuts] Could not find toast container with ID "+c)}a.getAttribute("data-should-stack")==="true"&&(a.setAttribute("data-should-stack","false"),a.setAttribute("data-expanded","false"),this._addTimeoutToToasts())},{signal:t.signal}),window.addEventListener("pointermove",r=>{if(!(e.getAttribute("data-is-swiping")==="true"))return;let a=document.getElementById(c);if(!a){if(o._config?.ignoreErrors)return;throw new Error("[ToastMyNuts] Could not find toast container with ID "+c)}let d=a.getAttribute("data-position-y"),l=d==="top",u=d==="bottom",_=parseFloat(e.style.getPropertyValue("--_original-position"))-r.screenY;if(!(l&&_<0||u&&_>0)){if(!l&&!u&&!o._config?.ignoreErrors)throw new Error("[ToastMyNuts] Invalid vertical position "+d);e.style.setProperty("--_swipe-offset",`${_}px`)}},{signal:t.signal}),[e,t]}_createCloseBtn(i){let s=new AbortController,t=document.createElement("button");return t.type="button",t.setAttribute("aria-label","Close notification"),t.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" /></svg>',t.classList.add(C),t.addEventListener("click",()=>{if(o._config&&o._config.ignoreErrors)try{this.removeToast(i)}catch{}else this.removeToast(i)},{signal:s.signal}),[t,s]}};function x(){let o=document.querySelector("meta[name='toastmynuts:config']");if(!o)return;let i=o.getAttribute("content");if(i)return JSON.parse(i)}var h=x(),f=m.getInstance(h);function D(o,i){if(h&&h.ignoreErrors)try{f.addToast(o,i)}catch(s){console.error(s)}else f.addToast(o,i)}function M(o){if(h&&h.ignoreErrors)try{f.removeToast(o)}catch{}else f.removeToast(o)}window.ToastMyNuts=Object.freeze({create:D,remove:M});})();
//# sourceMappingURL=index.umd.js.map
