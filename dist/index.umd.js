(()=>{var _="__toastmynuts__",p="__toastmynuts__wrapper",C="__toastmynuts__toast",L="__toastmynuts__message",A="__toastmynuts__close-btn",y={x:"middle",y:"top"},E=3;function b(){return Math.random().toString(16).slice(2)}var m=class o{static _instance;_toasts;_toastToBeRemoved;static _config;static _toastContainerMouseEnterListener;static _toastContainerMouseLeaveListener;static _toastContainerKeyDownListener;static _toastContainerKeyUpListener;static _mouseLeaveEnterListenerDebouncer;constructor(){this._toasts=[],this._toastToBeRemoved=[]}static getInstance(n){return o._instance||(o._instance=new o,o._config=n),o._instance}async addToast(n,s="neutral"){let t=this._getOrCreateToastContainer(),e=b(),[i,a]=this._createCloseBtn(e),[r,d]=this._createToastElement(e,s),l=document.createElement("div"),c=this._createMessageElement(n),v=setTimeout(()=>{if(o._config&&o._config.ignoreErrors)try{this.removeToast(e)}catch{}else this.removeToast(e)},1e4);l.appendChild(c),l.appendChild(i),r.appendChild(l),t.appendChild(r);let w=r.style.height;r.style.height="auto";let g=r.getBoundingClientRect().height,f=`${g}px`;r.style.height=w,t.style.setProperty("--_front-toast-height",f),r.style.setProperty("--_initial-height",f),r.removeAttribute("data-toast-state"),this._moveToastsDown(g);let T=Date.now();return this._toasts.push({_message:n,_type:s,_controllers:[a],_timeout:v,_duration:1e4,_id:e,_created_on:T,_timeout_created_on:T}),e}removeToast(n){let s,t;for(let d=0;d<this._toasts.length;++d)this._toasts[d]._id===n&&(s=this._toasts[d],t=d);if(!s||t===void 0)throw new Error("[ToastMyNuts] Could not find toast with ID "+n+" virtually");let e=document.getElementById(s._id);if(!e)throw new Error("[ToastMyNuts] Could not find toast with ID "+n+" in the DOM");if(e.getAttribute("data-toast-state")==="closing")return;for(;s._controllers.length!==0;)s._controllers.pop()?.abort();let a=e.getAttribute("data-toast-state")==="hidden";if(s._timeout!==void 0&&clearTimeout(s._timeout),a){this._removeToastPermanently(n,!0),this._toasts.splice(t,1);return}e.setAttribute("data-toast-state","closing");let r=parseFloat(getComputedStyle(e).transitionDuration);this._moveToastsUp(t),this._toastToBeRemoved.push(s),this._toasts.splice(t,1),setTimeout(()=>{this._removeToastPermanently(n,!1)},r*1e3)}_removeToastPermanently(n,s){let t,e;if(s)for(let a=0;a<this._toasts.length;++a)this._toasts[a]._id===n&&(t=this._toasts[a],e=a);else for(let a=0;a<this._toastToBeRemoved.length;++a)this._toastToBeRemoved[a]._id===n&&(t=this._toastToBeRemoved[a],e=a);if(!t)throw new Error("[ToastMyNuts] Could not find toast with ID "+n+" virtually");if(document.getElementById(t._id)?.remove(),!s&&e!==void 0&&this._toastToBeRemoved.splice(e,1),this._toasts.length===0){let a=document.getElementById(p),r=document.getElementById(_);o._toastContainerMouseEnterListener&&r?.removeEventListener("pointerenter",o._toastContainerMouseEnterListener),o._toastContainerMouseLeaveListener&&r?.removeEventListener("pointerleave",o._toastContainerMouseLeaveListener),o._toastContainerKeyDownListener&&window.removeEventListener("keydown",o._toastContainerKeyDownListener),o._toastContainerKeyUpListener&&window.removeEventListener("keyup",o._toastContainerKeyUpListener),a?.remove()}}_removeTimeoutOfToasts(){let n=Date.now();for(let s=0;s<this._toasts.length;++s){let t=this._toasts[s];if(t._timeout){let e=t._duration-(n-t._timeout_created_on);if(e<=0)continue;clearTimeout(t._timeout),t._duration=e,t._timeout=void 0}}}_addTimeoutToToasts(){let n=Date.now();for(let s=0;s<this._toasts.length;++s){let t=this._toasts[s];t._timeout||(t._timeout_created_on=n,t._timeout=setTimeout(()=>{if(o._config&&o._config.ignoreErrors)try{this.removeToast(t._id)}catch{}else this.removeToast(t._id)},t._duration))}}_moveToastsUp(n){let s=o._config?.maxVisibleToasts??E;for(let t=0;t<n;++t){let e=this._toasts[t];if(!e)throw new Error("[ToastMyNuts] Could not find toast with index "+t+" virtually");let i=document.getElementById(e._id);if(!i)throw new Error("[ToastMyNuts] Could not find toast with ID "+e._id+" in the DOM");let a=0;for(let r=t+1;r<this._toasts.length;++r){if(r===n)continue;let d=this._toasts[r],l=document.getElementById(d._id);if(!l)throw new Error("[ToastMyNuts] Could not find toast with ID "+d._id+" in the DOM");let c=parseFloat(l.style.getPropertyValue("--_initial-height"));a+=c}i.style.setProperty("--_height-offset",`${a}px`),i.style.setProperty("--_idx",(this._toasts.length-t-2).toString()),t===this._toasts.length-2&&i.setAttribute("data-front-toast","true"),this._toasts.length-t<=s+1&&i.getAttribute("data-toast-state")==="hidden"&&(i.removeAttribute("data-toast-state"),i.removeAttribute("aria-hidden"))}for(let t=n+1;t<this._toasts.length;++t){let e=this._toasts[t],i=document.getElementById(e._id);if(!i)throw new Error("[ToastMyNuts] Could not find toast with ID "+e._id+" in the DOM");i.style.setProperty("--_z-idx",(t-1).toString())}}_moveToastsDown(n){let s=o._config?.maxVisibleToasts??E;for(let t=0;t<this._toasts.length;++t){let e=this._toasts[t],i=document.getElementById(e._id);if(!i)throw new Error("[ToastMyNuts] Could not find toast with ID "+e._id);let a=n;for(let r=t+1;r<this._toasts.length;++r){let d=this._toasts[r],l=document.getElementById(d._id);if(!l)throw new Error("[ToastMyNuts] Could not find toast with ID "+d._id);let c=parseFloat(l.style.getPropertyValue("--_initial-height"));a+=c}i.style.setProperty("--_height-offset",`${a}px`),i.style.setProperty("--_idx",(this._toasts.length-t).toString()),i.removeAttribute("data-front-toast"),this._toasts.length-t>=s&&i.getAttribute("data-toast-state")!=="closing"&&(i.setAttribute("data-toast-state","hidden"),i.setAttribute("aria-hidden","true"))}}_getOrCreateToastContainer(){let n=document.getElementById(_);if(!n){let s=document.createElement("div");s.id=p,s.setAttribute("aria-label","Notifications (Alt + T)");let t=document.createElement("ol");return t.id=_,t.setAttribute("data-position-x",o._config?.position?.x||y.x),t.setAttribute("data-position-y",o._config?.position?.y||y.y),t.setAttribute("data-expanded","false"),o._config?.stackable===!1&&(o._toastContainerMouseEnterListener=()=>{t.getAttribute("data-did-toggle-expansion")!=="true"&&(o._mouseLeaveEnterListenerDebouncer&&clearTimeout(o._mouseLeaveEnterListenerDebouncer),t.setAttribute("data-expanded","true"),this._removeTimeoutOfToasts())},o._toastContainerMouseLeaveListener=()=>{o._mouseLeaveEnterListenerDebouncer=setTimeout(()=>{t.getAttribute("data-did-toggle-expansion")!=="true"&&(t.setAttribute("data-expanded","false"),this._addTimeoutToToasts())},50)},o._toastContainerKeyDownListener=e=>{if(e.altKey&&e.code==="KeyT"){if(t.getAttribute("data-did-toggle-expansion")==="true")return;o._mouseLeaveEnterListenerDebouncer&&clearTimeout(o._mouseLeaveEnterListenerDebouncer);let i=t.getAttribute("data-expanded")==="false";t.setAttribute("data-expanded",i?"true":"false"),t.setAttribute("data-did-toggle-expansion","true"),i?this._removeTimeoutOfToasts():this._addTimeoutToToasts()}},o._toastContainerKeyUpListener=e=>{e.code==="KeyT"&&t.setAttribute("data-did-toggle-expansion","false")},t.addEventListener("pointerenter",o._toastContainerMouseEnterListener),t.addEventListener("pointerleave",o._toastContainerMouseLeaveListener),window.addEventListener("keydown",o._toastContainerKeyDownListener),window.addEventListener("keyup",o._toastContainerKeyUpListener)),s.appendChild(t),document.body.appendChild(s),t}if(!(n instanceof HTMLOListElement))throw new Error("[ToastMyNuts] Colliding ID "+_+".");return n}_createMessageElement(n){let s=document.createElement("div");return s.textContent=n,s.classList.add(L),s}_createToastElement(n,s){let t=new AbortController,e=document.createElement("li");return e.id=n,e.classList.add(C),e.style.setProperty("--_idx","0"),e.style.setProperty("--_z-idx",this._toasts.length.toString()),e.setAttribute("data-toast-type",s),e.setAttribute("data-toast-state","entering"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.setAttribute("data-front-toast","true"),e.addEventListener("pointerdown",i=>{console.log(i.currentTarget)},{signal:t.signal}),[e,t]}_createCloseBtn(n){let s=new AbortController,t=document.createElement("button");return t.type="button",t.setAttribute("aria-label","Close notification"),t.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" /></svg>',t.classList.add(A),t.addEventListener("click",()=>{if(o._config&&o._config.ignoreErrors)try{this.removeToast(n)}catch{}else this.removeToast(n)},{signal:s.signal}),[t,s]}};function x(){let o=document.querySelector("meta[name='toastmynuts:config']");if(!o)return;let n=o.getAttribute("content");if(n)return JSON.parse(n)}var u=x(),h=m.getInstance(u);function D(o,n){if(u&&u.ignoreErrors)try{h.addToast(o,n)}catch(s){console.error(s)}else h.addToast(o,n)}function M(o){if(u&&u.ignoreErrors)try{h.removeToast(o)}catch{}else h.removeToast(o)}window.ToastMyNuts=Object.freeze({create:D,remove:M});})();
//# sourceMappingURL=index.umd.js.map
