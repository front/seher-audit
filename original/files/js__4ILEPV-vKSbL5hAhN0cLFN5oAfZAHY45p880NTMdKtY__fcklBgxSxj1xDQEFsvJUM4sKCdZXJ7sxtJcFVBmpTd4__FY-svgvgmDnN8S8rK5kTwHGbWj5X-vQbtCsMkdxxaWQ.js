if(!this.unispring){this.unispring=function(){var do_dt = true,c="undefined",g="1.6.0",x="test",m="tns-cs.net",d=typeof unispring_ms!=c?unispring_ms:2048,r=typeof unispring_debug!=c?unispring_debug:null,h=encodeURIComponent,q="site",o="s",w={},y=null,l,k,z,v=true;function n(){if("https"==document.location.href.slice(0,5)){return"https://ssl-"}return"http://"}function s(C,e){if(!e){if(C.hasOwnProperty('dt')){delete C.dt;}if(!C){return l}e=C;C={r:document.referrer}}l=[C,e];var B=e[o]?e[o]:C[o];if(!B){B=e[q]?e[q]:(C[q]?C[q]:x)}if(!w[B]){w[B]=[]}w[B].push([C,e]);y=1;return l}function i(B,G){if(!y){s({})}var E,D,F,C,e;for(D in w){if(w.hasOwnProperty(D)){F=w[D];while(F.length>0){C=",",e=[];while(F.length>0){C=C+t(A(F.shift(),e),e);if(C.length>d){break}if(F.length>0){C+="+"}}E=b(B,C+";",D,G)}}}w={};return E}function f(){var e=navigator.userAgent;return/(iPod|iPad|iPhone|Mac OS).*Safari/.test(e)&&!/[Cc]hrome/.test(e);}function b(F,I,J,E,D,C){C=n()+(J?J:x)+"."+m;D=C+"/j0="+I,u=D+"?lt="+(new Date()).getTime().toString(36)+"&x="+screen.width+"x"+screen.height+"x"+screen.colorDepth;if(!this.unispring.nua&&v&&f()){E=3;}var tpp = document.getElementById('spring-tp');var ctp = function(src){var tp = document.createElement('img');tp.id = 'spring-tp';tp.src = src;tp.width = 1;tp.height = 1;return tp;};if(!E || E == 1){if(tpp){tpp.parentNode.replaceChild(ctp(u),tpp);}else{document.body.appendChild(ctp(u));}}else{if(E==2){(new Image()).src=u;}else{if(E==3){var B=n()+"i."+m+"/index.html#"+h(u);var G="spfr";if(k){document.body.removeChild(k);}k=document.createElement("iframe");k.id=G;k.name=G;var H=k.style;H.position="absolute";H.left=H.top="-999px";k.src=B;document.body.appendChild(k)}}}if(F){a(C)}if(r){alert(u)}return D}function a(C,D,B,e){if(!z){D=document;e="script";z=D.createElement(e);z.type="text/java"+e;z.src=C+"/survey.js";B=D.getElementsByTagName(e)[0];B.parentNode.insertBefore(z,B)}else{z.src=C+"/survey.js"}}function t(e,C){for(var B=0;B<C.length;B+=1){if(C[B]==e){return"~"+B}}C.push(e);return e}function A(D,F){var B,E,C,e,G;if(!F){F=[]}switch(typeof D){case"string":return h(D);case"number":return isFinite(D)?String(D):"null";case"boolean":case"null":return String(D);case"object":if(!D){return"null"}B=[];if(typeof D.length==="number"&&!(D.propertyIsEnumerable("length"))){e=D.length;for(E=0;E<e;E+=1){B.push(t(A(D[E],F),F)||"null")}return","+B.join("+")+";"}for(C in D){if(typeof C==="string"){if(C!=q&&C!=o){G=A(D[C],F);if(G){B.push(t(A(C,F)+"="+G,F))}}}}return","+B.join("+")+";"}return""}function j(B,e,C){if (B.hasOwnProperty('cp') && do_dt){B = U(B);}else if (e.hasOwnProperty('cp') && do_dt){e = U(e);}s(B,e);return i(!this.ns,C)}function U(C){var i = 0;var ua = navigator.userAgent;/*if(C.hasOwnProperty('url')){delete C.url;}*/if(C.hasOwnProperty('dt')){C.dt = (C.dt).toLowerCase();if(!(C.dt == 'desktop')){C.cp = C.dt+'/'+C.cp;}}else{if(/Android|Windows|iPad/i.test(ua)){if((/Android/i.test(ua) && /mobile|Opera\sMobi/i.test(ua)) || (/Windows/i.test(ua) && /[Pp]hone|[Mm]obile/.test(ua))){i = 1;}else if(/Android|iPad/i.test(ua)){i = 2;}}else if(!/Macintosh|Solaris|BSD|Linux|PLAYSTATION|Nintendo\sWii|Xbox/i.test(ua)){i = 1;}/*if(/iPhone|Android|Symbian|iPod/i.test(ua) && i === 0){C.url = ua.replace(/\s|;/g, '_');}*/C.cp = i===1?'mobile/'+C.cp:C.cp;/*(i===2?'tablet/'+C.cp:C.cp);*/}return C;}function dt(a){do_dt = a;}function p(){while(unispringq.length>0){var e=unispringq.shift();if(e[1]){s(e[0],e[1])}else{if (e.hasOwnProperty('cp') && do_dt){e = U(e);}s(e,false)}}i(!this.ns,2);setTimeout("unispring.p()",50)}return{a:s,add:s,c:j,commit:j,p:p, dt:dt}}();if(this.unispringq){unispring.p()}};
;/**/
