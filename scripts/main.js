"use strict";const Providers=function(){const e=document.getElementById("provider-results");let t;const n=document.querySelector(".loading-message"),i=document.querySelector(".no-results-message");function r(e){e.hidden=!0,e.removeAttribute("data-transition"),a()}function a(){const e=Array.from(t).filter((e=>!1===e.hidden));i.hidden=e.length>0}return(async()=>{await fetch("https://tchcustomservices.texaschildrens.org/PublicServices/GetWaitTimes.svc/AllProviderWaitTimes").then((e=>e.json())).then((i=>{JSON.parse(i.d).forEach((t=>{const{ProviderID:n,DepartmentID:i,ProviderName:r,DepartmentName:a,WaitTime:o}=t,s=`\n        <li class="provider-result" data-provider-id="${n}" data-department-id="${i}">\n          <div class="boxed-width">\n            <div>\n              <p data-bind-filter-results class="provider-result__name">\n                ${r} (${a}):\n                <br><span style="font-weight: 400">${function(e){let t;return[[0,15],[16,30],[31,45],[46,60]].forEach((n=>{const[i,r]=n;e>=i&&e<=r?t=`Wait Time: ${i}–${r} Minutes`:e>r&&(t="Your wait time is currently unavailable. Please visit the front desk if you are interested in learning more about your wait time.")})),t}(parseInt(o))}</span>\n              </p>\n            </div>\n\n            <div class="provider-result__icon">\n              <img src="images/icons/check.svg" alt=""> \n            </div>\n          </div>\n        </li>\n      `;e.appendChild(document.createRange().createContextualFragment(s))})),e.setAttribute("data-populated",!0),t=document.querySelectorAll(".provider-result"),n.remove()}))})(),{filter:function(n){e.dataset.populated&&t.forEach((e=>{e.querySelector("[data-bind-filter-results]").textContent.toUpperCase().indexOf(n.toUpperCase())>-1?function(e){e.onanimationend=null,e.removeAttribute("data-transition"),e.hidden=!1,a()}(e):"onanimationend"in document.createElement("div")?(e.setAttribute("data-transition","hiding"),e.onanimationend=()=>{r(e)}):r(e)}))}}}();
//# sourceMappingURL=main.js.map
