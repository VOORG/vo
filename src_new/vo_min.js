(function(b,a){typeof exports==="object"&&typeof module!=="undefined"?module.exports=a():typeof define==="function"&&define.amd?define(a):(b.Vo=a())}(this,function(){var o=1;var v=(function(){var x="";var B=" ";var y="{{";var C="}}";var A="vo-";var z=A+"model";var w=A+"on:";return{EMPTY_STRING:x,ONE_CHAR_STRING:B,LEFT_DELIMITER:y,RIGHT_DELIMITER:C,ATTR_PREFIX:A,EVENT_ATTR_PREFIX:w,MODEL_ATTR:z}})();var p=(function(){var af={};var z=Object.prototype.toString;var E=Object.prototype.hasOwnProperty;var X=Array.prototype.concat;var N=Array.prototype.slice;var U=Array.prototype.splice;var ai=Array.prototype.push;var ad=Array.prototype.pop;function al(){}function Z(aw){return aw==null?"":typeof aw==="object"?JSON.stringify(aw,null,2):String(aw)}function aj(aw){var ax=parseFloat(aw,10);return(ax||ax===0)?ax:aw}function H(ax){if(!ag(ax)){return ax}var aA=arguments.length;if(aA===0){return blantObject}if(aA===1){return ax}var aw=arguments[0],aB,az,ay=0;for(ay=1;ay<aA;ay++){aB=arguments[ay];for(az in aB){if(ag(aB[az])){H(aw,aB[az])}else{aw[az]=aB[az]}}}return aw}function D(aw,ax){return ag(aw)&&E.call(aw,ax)}function O(aw){return !ah(aw)&&!P(aw)&&z.call(aw)==="[object Function]"}function ag(aw){return !P(aw)&&typeof aw==="object"}function aq(aw){return aw&&z.call(aw)==="[object Object]"}function ae(ax){var aw;for(aw in ax){return false}return true}function R(aw){return z.call(aw)==="[object Regex]"}function T(aw){return z.call(aw)==="[object Array]"}function ar(aw){return !ah(aw)&&!P(aw)&&z.call(aw)==="[object Number]"}function at(aw){return ar(aw)&&aw!==+aw}function ah(aw){return aw===null}function P(aw){return aw===void (0)}function L(aw){return !ah(object)&&P(object)&&z.call(object)==="[object Blooean]"}function B(aw){if(typeof console!=="undefined"){console.log(aw)}}function W(aw){if(typeof console!=="undefined"){console.error(aw)}}function I(aw){if(typeof console!=="undefined"){console.warn(aw)}}function J(ay){var aw={};function ax(az,aA){if(aA){aw[az]=aA}else{return aw[az]}}return ax}function ak(aw){var az=arguments.length;if(az){var ax;if(az>1){ax=N.call(arguments,0,az-1)}var ay;if(ax){ay=new Function(ax,arguments[az-1])}else{ay=new Function(arguments[az-1])}return ay}}function K(ax,aw){function ay(){if(1<arguments.length){return ax.apply(aw,arguments)}else{return arguments.length?ax.call(aw,arguments[0]):ax.call(aw)}}return ay}function Q(az,ax,ay,aw){if(!aw){aw={}}Object.defineProperty(az,ax,{enumerable:aw.enumerable||true,configurable:aw.configurable||true,value:aw.value||ay})}function an(ax){if(typeof ax==="string"){var aw=ax;ax=document.querySelector(ax);if(!ax){I("Cannot find element: "+aw);return document.createElement("div")}}return ax}function aa(aw){return document.createElement(aw)}var G={svg:"http://www.w3.org/2000/svg",math:"http://www.w3.org/1998/Math/MathML",xhtml:"http://www.w3.org/1999/xhtml"};function V(ax,aw){return document.createElementNS(G[ax],aw)}function S(aw){return document.createTextNode(aw)}function ao(aw){return document.createComment(aw)}function am(aw,ay,ax){aw.insertBefore(ay,ax)}function C(aw,ax){aw.removeChild(ax)}function x(aw,ax){aw.appendChild(ax)}function F(aw){return aw.parentNode}function av(aw){return aw.nextSibling}function M(aw){return aw.tagName}function A(aw,ax){aw.textContent=ax}function ac(ax,aw){return ax.getAttribute(aw)}function y(ax,aw,ay){ax.setAttribute(aw,ay)}function w(ax,aw){ax.removeAttribute(aw)}function ab(aw){return aw.outerHTML}function Y(aw){return(-1!==aw.indexOf(v.ATTR_PREFIX))}function ap(aw){return(aw===v.MODEL_ATTR)}function au(aw){return(-1!==aw.indexOf(v.EVENT_ATTR_PREFIX))}return{isVoDirective:Y,isVoModelDirective:ap,isVoEventDirectivePrefix:au,blankObject:af,toString:z,hasOwnProperty:E,concat:X,slice:N,splice:U,push:ai,pop:ad,noop:al,_toString:Z,toNumber:aj,extend:H,hasOwn:D,isFunction:O,isObject:ag,isPlainObject:aq,isEmptyObject:ae,isRegex:R,isArray:T,isNumber:ar,isNaN:at,isNull:ah,isUndefined:P,isBlooean:L,log:B,warn:I,error:W,cache:J,makeFunction:ak,$bind:K,defProperty:Q,query:an,createElement:aa,createElementNS:V,createTextNode:S,createComment:ao,insertBefore:am,removeChild:C,appendChild:x,parentNode:F,nextSibling:av,tagName:M,setTextContent:A,setAttribute:y,removeAttribute:w,getOuterHTML:ab}})();var k=p.cache();var t=(function(){var w=typeof window!=="undefined";return{inBrowser:w}})();var n=(function(){var y=1;function w(A,C,B){if(!(this instanceof w)){return new w(C,monitor)}this.uuid=y++;this.vo=A;this.subName=C;this.monitor=new z(A,B)}w.prototype.registMonitor=function(A){if(!(A instanceof z)){return}this.monitor=A};w.prototype.removeMonitor=function(){this.monitor=null};w.prototype.notify=function(A){this.monitor.update(A,this.subName)};function z(A,B){if(!(this instanceof z)){return new z(A,B)}this.uuid=y++;this.vo=A;this.monitorFn=B}z.prototype.update=function(A,B){if(p.isFunction(this.monitorFn)){this.monitorFn.call(A,A.$responseGetterProxy(B))}};function x(A,C){if(!(this instanceof x)){return new x(A,C)}this.uuid=y++;this.vo=A;var B=[];
if(C){B.push(C)}this.subs=B}x.prototype.addSub=function(A){if(!(A instanceof w)){return}this.subs.push(A)};x.prototype.removeSub=function(D){if(D){var C=this.subs;for(var B=0,A=C.length;B<A;B++){if(D===C[B]["uuid"]){C.splice(B,1);break}}}else{this.subs=[]}};x.prototype.publish=function(B,F){if(F){var D=p.slice.call(this.subs);for(var C=0,A=D.length;C<A;C++){if(F===D[C]["uuid"]){var E=D[C];E.notify(B);break}}}else{var D=uitls.slice.call(this.subs);var E;for(var C=0,A=D.length;C<A;C++){var E=D[C];E.notify(B)}}};return{Monitor:z,Subject:w,Observer:x}})();var j=(function(){function F(U,Y,T){var W;if(T){W=[];var X;for(var V=0,S=T.length;V<S;V++){X=T[V];x(U,Y,X,W)}}return W}function x(S,X,W,V){var U=W.nodeName;var T={attrName:U,attrValue:W.nodeValue,nodeName:X,nodeType:W.nodeType,operation:0};w(S,X,W,T);T.templateFn=l.parse(S,X,W.nodeValue);V.push(T)}function w(S,V,U,T){}function E(S){S.$elem=p.query(S.elem);if(!S.$cache(S.elem)){var T=p.getOuterHTML(S.$elem);S.$cache(S.elem,T)}}function R(V,Z,Y,T,U,W,S,X){if(!(this instanceof R)){return new R(V,Z,Y,T,U,W,S,X)}this.vo=V;this.elemRef=Z;this.nodeName=Y;this.nodeType=T;this.attributeMap=F(V,Y,U);this.templateFn=l.parse(V,Y,W);this.data=W;this.parentNode=S;this.childNodes=X;this.dirty=false;this.operation=0}function y(V){var T;if(V){var S=V.childNodes.slice();var U=V.attributeMap;if(U){U=V.attributeMap.slice()}T=new R(V.vo,V.elemRef,V.nodeName,V.nodeType,U,V.data,V.parentNode,childNodes)}return T}function Q(T){var S;if(T){S={attrName:T.attrName,attrValue:T.nodeValue,nodeName:T.nodeName,nodeType:T.nodeType,operation:T.operation}}return S}function M(S){S.$vRootNode=new R(S,S.$elem,S.$elem.nodeName,S.$elem.nodeType,S.$elem.attributes,S.$elem.data,null,[]);S._vRootNode=new R(S,S.$elem,S.$elem.nodeName,S.$elem.nodeType,S.$elem.attributes,S.$elem.data,null,[]);G(S,S.$vRootNode,S.$elem.childNodes);G(S,S._vRootNode,S.$elem.childNodes)}function G(S,T,aa){var X=T;for(var W=0,U=aa.length;W<U;W++){var Z=aa[W];if(Z.nodeType===1||Z.nodeType===3){var Y=Z.attributes;var V=new R(S,Z,Z.nodeName,Z.nodeType,Y,Z.data,X,[]);X.childNodes.push(V);G(S,V,Z.childNodes)}}}function D(S){p.log(S.$vRootNode)}function B(T,S,U){K(T,S,U)}function K(U,T,V){var S=(T.nodeType===V.nodeType)?T.nodeType:0;switch(S){case 1:A(U,T,V);H(U,T,V);break;case 2:break;case 3:L(U,T,V);break;default:break}}function I(T,S){p.setTextContent(T,S)}function L(T,S,V){if(p.isFunction(V.templateFn)){var U=V.templateFn(T);if(S.data!==U){S.data=U;S.templateFn=l.parse(T,V.nodeName,V.data);I(S.elemRef,U)}}}function H(T,S,U){var V=S.childNodes;var W=U.childNodes;N(T,S.elemRef,V,W)}function P(S,T){p.removeChild(utls.parentNode(T),T)}function J(T,W,Z,X,V){var Y;if(W){p.appendChild(W,Y)}X=X||[];var U,S;for(U=0,S=X.length;U<S;U++){p.setAttribute(Y,X[U]["attrName"],X[U]["attrValue"])}for(U=0,S=V.length;U<S;U++){J(T,Y,V[U]["nodeName"],V[U]["attributeMap"],V[U]["childNodes"])}}function C(S,T,V){var U=p.createTextNode(V);p.appendChild(T,U)}function N(T,Z,X,Y){var V;var U=0,S=Y.length;while(U<S){V=Y[U];switch(V["operation"]){case 1:var W=y(V);W.parentNode=y.templateFn=l.parse(T,newVNode.nodeName,newVNode.data);X.splice(U,1,W);if(W.nodeType===1){J(T,W.parentNode.elemRef,W.nodeName,W.attributeMap,W.childNodes)}else{if(W.nodeType===3){C(T,W.parentNode.elemRef,W.data)}}break;case -1:X.splice(U,1);Y.splice(U,1);S--;P(Y[U]["elemRef"]);break;case 0:K(T,X[U],Y[U]);break;default:break}V["operation"]=0;U++}}function z(V,T,U,S){if(S===-1){p.removeAttribute(V,T)}else{p.setAttribute(V,T,U)}}function O(T,S,X,Y){var Z=X.length-Y.length;var ab=Z<0?1:Z===0?0:-1;switch(ab){case 1:var U=Y.slice(Y.length+Z);var aa;for(var W=0,V=U.length;W<V;W++){aa=U[W]["templateFn"];if(p.isFunction(aa)){U[W]["attrValue"]=aa(T);z(S,U[W]["attrName"],U[W]["attrValue"])}}X=X.concat(U);break;case -1:for(var W=Z,V=X.length;W<V;W++){p.removeAttribute(S,X[W]["attrName"])}X=X.slice(0,X.length+Z);break;default:break}}function A(S,Z,aa){var X=Z.attributeMap;var Y=aa.attributeMap;if(!X&&!Y){return}if((!X&&Y)||(X&&!Y)){O(S,Z.elemRef,(X||[]),(Y||[]));return}var W;var V=0,U=Y.length;while(V<U){W=Y[V];switch(W["operation"]){case 1:var T=Q(W);T.templateFn=l.parse(S,T.nodeName,T.attrValue);X.splice(V,1,T);z(Z.elemRef,T.attrName,T.attrValue,1);break;case -1:X.splice(V,1);Y.splice(V,1);U--;z(Z.elemRef,T.attrName,T.attrValue,-1);break;case 0:var ab=Y[V].templateFn(S);if(p.isVoDirective(Y[V]["attrName"])){if(p.isVoModelDirective(Y[V]["attrName"])){if(Y[V]["nodeName"]==="INPUT"){Z.elemRef.value=S.$responseGetterProxy(ab)}}}else{if(ab!==X[V]["attrValue"]){X[V]["attrValue"]=ab;X[V]["templateFn"]=l.parse(S,Z.nodeName,W.attrValue);z(Z.elemRef,W.attrName,ab,0)}}break;default:break}W["operation"]=0;V++}O(S,Z.elemRef,X,Y)}return{beforeCreateVDOM:E,createVDOM$1:M,afterCreateVDOM:D,VNode:R,genVDOMTree:G,patch:B}})();var u=(function(){function J(L){l.compile$1(L)}function H(L){J(L);var M=G(L);D(L,M);B(L)}function G(M){var L=M.$vRootNode;var N=F(M,void (0),L);E(M,N,L);return N}function F(L,T,N){var Q=N.nodeType;
var R;switch(Q){case 1:R=p.createElement(N.nodeName);var P=N.attributeMap;for(var S=0,O=P.length;S<O;S++){z(L,R,P[S]["attrName"],P[S]["attrValue"])}if(T){p.appendChild(T,R)}N.elemRef=R;break;case 3:var M=p.createTextNode(N.data);p.appendChild(T,M);N.elemRef=M;R=T;break;default:R=T;break}return R}function E(N,L,P){var Q=P.childNodes;var R;for(var O=0,M=Q.length;O<M;O++){R=F(N,L,Q[O]);E(N,R,Q[O])}}function D(N,O){var L=p.query(N.elem);var M=L.parentNode;if(M){p.insertBefore(M,O,L);p.removeChild(M,L)}}function B(L){}function A(L,O,M,N){O.addEventListener(M,L.$methods[N])}function K(L,O,M,N){O.addEventListener(M,N)}function I(L){return L.substring(v.EVENT_ATTR_PREFIX.length)}function z(L,O,M,N){if(p.isVoDirective(M)){C(L,O,M,N)}else{p.setAttribute(O,M,N)}}function y(N,L){var M=document.createEvent("HTMLEvents");M.initEvent(L,true,true);N.dispatchEvent(M)}function C(L,O,M,N){if(p.isVoModelDirective(M)){x(L,O,M,N)}else{if(p.isVoEventDirectivePrefix(M)){w(L,O,M,N)}}}function x(L,P,M,O){P.value=L.$responseGetterProxy(O);if(P.nodeName==="INPUT"){var N=p.$bind(function(Q){this[Q]=P.value},L);K(L,P,"input",function(){N(O)})}}function w(L,P,N,O){var M=I(N);A(L,P,M,O)}return{renderDOM$1:H}})();var e=(function(){var x=1;function w(){if(!(this instanceof w)){return new w()}this.events={}}w.prototype.on=function(z,y){var A=this.events[z]||(this.events[z]=[]);A.push(y)};w.prototype.off=function(C,B){if(!(C||B)){this.events={};return}var z=this.events[C];if(z){if(B){for(var A=0,y=z.length;A<y;A++){if(z[A]===B){z.splice(A,1);break}}}else{this.events[C]=[]}}};w.prototype.emit=function(C){var z=this.events[C];if(z){var A=uitls.slice.call(arguments,1);var D=slice.call(z);for(var B=0,y=D.length;B<y;B++){D[B](A)}}};return{EventBus:w}})();var l=(function(){var D=/^(\s*).*/gm;var A=/.*\s*$/gm;function E(G,H){G=G.substring(H);return G}function z(I,L,J){var H=[];F(I,L,J,H);var G=w(H);var K=p.makeFunction("vo",G);return K}function w(H){var G='""';if(H&&H.length){G=H.join(" + ").trim()}G="with(vo) { return "+G+";}";return G}function x(J,L,K,H){var G=K.exec(L);if(G&&G[1]){var I=G[1];H.push('_ts("'+I.trim()+'")');L=E(L,I.length)}}function F(G,M,O,L){var I=-1;var P=-1;var J=v.LEFT_DELIMITER;var K=v.RIGHT_DELIMITER;while(O){I=O.indexOf(J);P=O.indexOf(K);if(I!==-1&&P!==-1){var H=O.substring(0,I).replace(/\r/g,v.ONE_CHAR_STRING).replace(/\n/g,v.ONE_CHAR_STRING).replace(/\t/g,v.ONE_CHAR_STRING);L.push('_ts("'+H+'")');O=E(O,I);I=O.indexOf(J);P=O.indexOf(K);var N=O.substring(J.length,P).trim();if(/\s+/.test(N)){throw new Error("\n[vo error] failed to compile template: \n"+G.$cache(G.elem)+"\n- invalid expression: \n"+O.substring(0,P+K.length))}if(!p.hasOwn(G,N)){throw new Error("\n[vo error] Property or method `"+N+"` is not defined on the instance but referenced during render. \n"+"Make sure to declare reactive data properties in the data option.")}L.push("_ts("+N+")");O=E(O,P+K.length)}else{O=O.replace(/\r/g,v.ONE_CHAR_STRING).replace(/\n/g,v.ONE_CHAR_STRING).replace(/\t/g,v.ONE_CHAR_STRING);L.push('_ts("'+O+'")');O=E(O,O.length)}I=P=-1}}function C(G){B(G,G.$vRootNode)}function B(H,J){var G=J.nodeType;if(G===1||G===2||G===3){y(H,J);var K=J.childNodes;for(var I=0,L=K.length;I<L;I++){B(H,K[I])}}}function y(J,L){var I=L.attributeMap;if(I){var G;for(var K=0,H=I.length;K<H;K++){G=I[K];G.attrValue=G.templateFn(J)}}else{L.data=L.templateFn(J)}}return{parse:z,compile$1:C,compile$2:B}})();function r(B,y,A,z){var x=Object.getOwnPropertyDescriptor(B,y);var w=x&&x.get;var C=x&&x.set;Object.defineProperty(B,y,{enumerable:true,configurable:true,get:function(){var D=w?w.call(B):A;return D},set:function(E){var D=w?w.call(B):A;if(E===D||(E!==E&&D!==D)){return}if(C){C.call(B,E)}else{A=E}B.$observer.publish(B,z.$sub.uuid);j.patch(vo,vo.$vRootNode,vo._vRootNode)}})}function i(x,y){var w=this;if(!y){y=w[x]}w[x]=y;j.patch(w,w.$vRootNode,w._vRootNode)}function f(x){var w=this;return w[x]}function s(w){if(!(this instanceof s)){p.warn("please use `new` keyword to create Vo object.");return new s(w)}this.init$1(w)}g();function d(w){w.$cache=k;j.beforeCreateVDOM(w);j.createVDOM$1(w);j.afterCreateVDOM(w);u.renderDOM$1(w)}function m(x){if(p.isNull(x)||p.isUndefined(x)||!p.isObject(x)||p.isEmptyObject(x)){return}if(!p.hasOwn(x,"elem")||!x.elem){p.warn("Vo must has elem.");return}var w=this;c(w,x);d(w)}function c(x,w){a(x,w)}function a(x,w){q(x,w);h(x,w);b(x,w);p.extend(x,w)}function q(x,w){p.defProperty(x,"$monitors",{});p.extend(x.$monitors,w.monitors);w.monitors=null}function h(x,w){p.extend(x,w.data);x.$observer=new n.Observer(x);if(w.data&&p.isObject(w.data)){var y;for(y in w.data){var z=new n.Subject(x,p._toString(y),x.$monitors[y]);x.$observer.addSub(z);r(x,y,w.data[y],{$sub:z})}}w.data=null}function b(x,w){p.defProperty(x,"$methods",{});var y;for(y in w.methods){p.defProperty(x.$methods,y,p.$bind(w.methods[y],x))}w.methods=null}function g(){p.extend(s.prototype,{version:"1.0.0",init$1:m,_ts:p._toString,$responseSetterProxy:i,$responseGetterProxy:f});s.prototype.utils=p
}return s}));