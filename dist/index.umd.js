(()=>{var h="__toastmynuts__",y="__toastmynuts__wrapper",v="__toastmynuts__toast",C="__toastmynuts__message",L="__toastmynuts__close-btn",T={x:"middle",y:"top"},E=3;function w(){return Math.random().toString(16).slice(2)}var m=class e{static _instance;_toasts;_toastToBeRemoved;static _config;static _toastContainerMouseEnterListener;static _toastContainerMouseLeaveListener;static _toastContainerKeyDownListener;static _toastContainerKeyUpListener;static _mouseLeaveEnterListenerDebouncer;constructor(){this._toasts=[],this._toastToBeRemoved=[]}static getInstance(o){return e._instance||(e._instance=new e,e._config=o),e._instance}async addToast(o,s="neutral"){let t=this._getOrCreateToastContainer(),n=w(),[a,l]=this._createCloseBtn(n),i=this._createToastElement(n,s),r=document.createElement("div"),c=this._createMessageElement(o),d=setTimeout(()=>{if(e._config&&e._config.ignoreErrors)try{this.removeToast(n)}catch{}else this.removeToast(n)},1e4);r.appendChild(c),r.appendChild(a),i.appendChild(r),t.prepend(i);let _=i.style.height;i.style.height="auto";let f=i.getBoundingClientRect().height,p=`${f}px`;return i.style.height=_,t.style.setProperty("--_front-toast-height",p),i.style.setProperty("--_initial-height",p),i.removeAttribute("data-toast-state"),this._moveToastsDown(f),this._toasts.push({_message:o,_type:s,_controllers:[l],_timeout:d,_duration:1e4,_id:n}),n}removeToast(o){let s,t;for(let i=0;i<this._toasts.length;++i)this._toasts[i]._id===o&&(s=this._toasts[i],t=i);if(!s||t===void 0)throw new Error("[ToastMyNuts] Could not find toast with ID "+o+" virtually");let n=document.getElementById(s._id);if(!n)throw new Error("[ToastMyNuts] Could not find toast with ID "+o+" in the DOM");if(n.getAttribute("data-toast-state")==="closing")return;for(n.setAttribute("data-toast-state","closing");s._controllers.length!==0;)s._controllers.pop()?.abort();let l=parseFloat(getComputedStyle(n).transitionDuration);this._moveToastsUp(t),this._toastToBeRemoved.push(s),s._timeout!==void 0&&clearTimeout(s._timeout),this._toasts.splice(t,1),setTimeout(()=>{let i,r;for(let d=0;d<this._toastToBeRemoved.length;++d)this._toastToBeRemoved[d]._id===o&&(i=this._toastToBeRemoved[d],r=d);if(!i||r===void 0)throw new Error("[ToastMyNuts] Could not find toast with ID "+o+" virtually");if(document.getElementById(i._id)?.remove(),this._toastToBeRemoved.splice(r,1),this._toasts.length===0){let d=document.getElementById(y),_=document.getElementById(h);e._toastContainerMouseEnterListener&&_?.removeEventListener("pointerenter",e._toastContainerMouseEnterListener),e._toastContainerMouseLeaveListener&&_?.removeEventListener("pointerleave",e._toastContainerMouseLeaveListener),e._toastContainerKeyDownListener&&window.removeEventListener("keydown",e._toastContainerKeyDownListener),e._toastContainerKeyUpListener&&window.removeEventListener("keyup",e._toastContainerKeyUpListener),d?.remove()}},l*1e3)}_removeTimeoutOfToasts(){for(let o=0;o<this._toasts.length;++o){let s=this._toasts[o];s._timeout&&(clearTimeout(s._timeout),this._toasts[o]._timeout=void 0)}}_moveToastsUp(o){let s=e._config?.maxVisibleToasts??E;for(let t=0;t<o;++t){let n=this._toasts[t];if(!n)throw new Error("[ToastMyNuts] Could not find toast with index "+t+" virtually");let a=document.getElementById(n._id);if(!a)throw new Error("[ToastMyNuts] Could not find toast with ID "+n._id+" in the DOM");let l=0;for(let i=t+1;i<this._toasts.length;++i){if(i===o)continue;let r=this._toasts[i],c=document.getElementById(r._id);if(!c)throw new Error("[ToastMyNuts] Could not find toast with ID "+r._id+" in the DOM");let d=parseFloat(c.style.getPropertyValue("--_initial-height"));l+=d}a.style.setProperty("--_height-offset",`${l}px`),a.style.setProperty("--_idx",(this._toasts.length-t-2).toString()),t===this._toasts.length-2&&a.setAttribute("data-front-toast","true"),this._toasts.length-t<=s+1&&a.getAttribute("data-toast-state")==="hidden"&&(a.removeAttribute("data-toast-state"),a.removeAttribute("aria-hidden"))}for(let t=o+1;t<this._toasts.length;++t){let n=this._toasts[t],a=document.getElementById(n._id);if(!a)throw new Error("[ToastMyNuts] Could not find toast with ID "+n._id+" in the DOM");a.style.setProperty("--_z-idx",(t-1).toString())}}_moveToastsDown(o){let s=e._config?.maxVisibleToasts??E;for(let t=0;t<this._toasts.length;++t){let n=this._toasts[t],a=document.getElementById(n._id);if(!a)throw new Error("[ToastMyNuts] Could not find toast with ID "+n._id);let l=o;for(let i=t+1;i<this._toasts.length;++i){let r=this._toasts[i],c=document.getElementById(r._id);if(!c)throw new Error("[ToastMyNuts] Could not find toast with ID "+r._id);let d=parseFloat(c.style.getPropertyValue("--_initial-height"));l+=d}a.style.setProperty("--_height-offset",`${l}px`),a.style.setProperty("--_idx",(this._toasts.length-t).toString()),a.removeAttribute("data-front-toast"),this._toasts.length-t>=s&&a.getAttribute("data-toast-state")!=="closing"&&(a.setAttribute("data-toast-state","hidden"),a.setAttribute("aria-hidden","true"))}}_getOrCreateToastContainer(){let o=document.getElementById(h);if(!o){let s=document.createElement("div");s.id=y,s.setAttribute("aria-label","Notifications (Alt + T)");let t=document.createElement("ol");return t.id=h,t.setAttribute("data-position-x",e._config?.position?.x||T.x),t.setAttribute("data-position-y",e._config?.position?.y||T.y),t.setAttribute("data-expanded","false"),e._config?.stackable===!1&&(e._toastContainerMouseEnterListener=()=>{t.getAttribute("data-did-toggle-expansion")!=="true"&&(e._mouseLeaveEnterListenerDebouncer&&clearTimeout(e._mouseLeaveEnterListenerDebouncer),t.setAttribute("data-expanded","true"))},e._toastContainerMouseLeaveListener=()=>{e._mouseLeaveEnterListenerDebouncer=setTimeout(()=>{t.getAttribute("data-did-toggle-expansion")!=="true"&&t.setAttribute("data-expanded","false")},50)},e._toastContainerKeyDownListener=n=>{if(n.altKey&&n.code==="KeyT"){if(t.getAttribute("data-did-toggle-expansion")==="true")return;e._mouseLeaveEnterListenerDebouncer&&clearTimeout(e._mouseLeaveEnterListenerDebouncer),t.setAttribute("data-expanded",t.getAttribute("data-expanded")==="true"?"false":"true"),t.setAttribute("data-did-toggle-expansion","true")}},e._toastContainerKeyUpListener=n=>{n.code==="KeyT"&&t.setAttribute("data-did-toggle-expansion","false")},t.addEventListener("pointerenter",e._toastContainerMouseEnterListener),t.addEventListener("pointerleave",e._toastContainerMouseLeaveListener),window.addEventListener("keydown",e._toastContainerKeyDownListener),window.addEventListener("keyup",e._toastContainerKeyUpListener)),s.appendChild(t),document.body.appendChild(s),t}if(!(o instanceof HTMLOListElement))throw new Error("[ToastMyNuts] Colliding ID "+h+".");return o}_createMessageElement(o){let s=document.createElement("div");return s.textContent=o,s.classList.add(C),s}_createToastElement(o,s){let t=document.createElement("li");return t.id=o,t.classList.add(v),t.style.setProperty("--_idx","0"),t.style.setProperty("--_z-idx",this._toasts.length.toString()),t.setAttribute("data-toast-type",s),t.setAttribute("data-toast-state","entering"),t.setAttribute("aria-live","polite"),t.setAttribute("aria-atomic","true"),t.setAttribute("data-front-toast","true"),t}_createCloseBtn(o){let s=new AbortController,t=document.createElement("button");return t.type="button",t.setAttribute("aria-label","Close notification"),t.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4"><path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" /></svg>',t.classList.add(L),t.addEventListener("click",()=>{if(e._config&&e._config.ignoreErrors)try{this.removeToast(o)}catch{}else this.removeToast(o)},{signal:s.signal}),[t,s]}};function A(){let e=document.querySelector("meta[name='toastmynuts:config']");if(!e)return;let o=e.getAttribute("content");if(o)return JSON.parse(o)}var u=A(),g=m.getInstance(u);function b(e,o){if(u&&u.ignoreErrors)try{g.addToast(e,o)}catch(s){console.error(s)}else g.addToast(e,o)}function x(e){if(u&&u.ignoreErrors)try{g.removeToast(e)}catch{}else g.removeToast(e)}window.ToastMyNuts=Object.freeze({create:b,remove:x});})();
//# sourceMappingURL=index.umd.js.map
