(()=>{"use strict";const e=(e,t,o,r)=>({x:Math.floor(e/o.width*r.width),y:Math.floor(t/o.height*r.height)}),t=e=>`#${("00"+e.r.toString(16)).slice(-2)}${("00"+e.g.toString(16)).slice(-2)}${("00"+e.b.toString(16)).slice(-2)}`;let o;const r={r:0,g:0,b:0,a:255},a=e=>{const t=(o=e.target.value,(r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(o))?{r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16),a:255}:null);var o,r;n(t.r,t.g,t.b,t.a)},s=()=>r,n=(e,t,o,a)=>{r.r=e,r.g=t,r.b=o,r.a=a},l=(e,t,o,r=255)=>({r:e,g:t,b:o,a:r});let i,c="#FF00FF",h=0,d=[];const m=(e,t)=>{const o=new XMLHttpRequest;o.open("get",e),o.setRequestHeader("Accept","application/json"),o.onload=()=>t(o),o.send()},u=(e,t,o,r)=>{const a=new XMLHttpRequest;a.open("post",e),a.setRequestHeader("Content-type",o),a.setRequestHeader("Accept","application/json"),a.onload=()=>t(a),a.send(r)},g=e=>{switch(e.status){case 204:return Pe("There are no rooms yet!");case 404:Pe("For some reason server braindead... Or its creator is...");break;default:Pe("I dont know what the fork happened here!")}const t=JSON.parse(e.response);Ce(t.rooms)},p=()=>{m("/roomList",g)},f=e=>{const o=JSON.parse(e.response);switch(e.status){case 201:i=o.room.id,c=t(l(255*Math.random(),255*Math.random(),255*Math.random(),255)),h=o.playerId,ve(o.room);break;case 400:case 404:qe(o.message);break;default:qe("I dont know what the fork happened here!")}},y=e=>{switch(e.status){case 204:break;case 400:console.error("The data sent to the server was incorrect!");break;case 404:console.error(obj.message);break;default:console.error("I dont know what the fork happened here!")}},w=e=>{const t=JSON.parse(e.response);switch(e.status){case 200:d=[],d=t.players;break;case 400:console.error("The data sent to the server was incorrect!");break;case 404:console.error(t.message);break;default:console.error("I dont know what the fork happened here!")}},S=e=>{const o=JSON.parse(e.response);switch(e.status){case 200:i=o.room.id,c=t(l(255*Math.random(),255*Math.random(),255*Math.random(),255)),h=o.playerId,ve(o.room);break;case 400:Pe(o.message);break;case 404:Pe("Something has gone wrong real bad");break;default:qe("I dont know what the fork happened here!")}},x=e=>{};let b,k,N,q,v={};const I=(e,t,o)=>{if(e<0||e>=v.width||t<0||t>=v.height)return;let r=R(e,t,v.width);j(r,o,l(q[r],q[r+1],q[r+2],q[r+3])),q[r]=o.r,q[r+1]=o.g,q[r+2]=o.b,q[r+3]=o.a},C=(e,t)=>{e<0||e>=q.length||(q[e]=t.r,q[e+1]=t.g,q[e+2]=t.b,q[e+3]=t.a)},P=(e,t,o,r,a)=>{let s=Math.abs(o-e),n=Math.abs(r-t),l=e<o?1:-1,i=t<r?1:-1,c=s-n;for(;e!==o||t!==r;){I(e,t,a);let o=2*c;o>-n&&(c-=n,e+=l),o<=s&&(c+=s,t+=i)}},$=()=>{k.putImageData(N,0,0)},R=(e,t,o)=>t*(4*o)+4*e;let M,E,F,T,H=[],L=[],O=[],X=0;const j=(e,t,o)=>{F||O.find((t=>t.pixelIndex===e))||(O.push({pixelIndex:e,toColor:{...t},fromColor:{...o}}),L=[],E=!0)},D=()=>{if(H.length<=0)return;let e=H.pop();if(null===e)return;F=!0,L.push(e);let t=e.changes;for(let e=0;e<t.length;e++){let o=t[e];C(o.pixelIndex,o.fromColor)}$(),X--,F=!1,B()},z=()=>{if(L.length<=0)return;let e=L.pop();if(null===e)return;T=!0,H.push(e);let t=e.changes;for(let e=0;e<t.length;e++){let o=t[e];C(o.pixelIndex,o.toColor)}$(),X++,T=!1,B()},B=()=>{for(;M.firstChild;)M.removeChild(M.firstChild);for(let e=0;e<H.length;e++){const t=document.createElement("p");t.innerText=`${H[e].changeNumber}. ${H[e].message}`,e===H.length-1&&(t.style.border="1px solid white"),M.append(t)}M.scrollTop=M.scrollHeight;for(let e=L.length-1;e>=0;e--){const t=document.createElement("p");t.innerText=`${L[e].changeNumber}. ${L[e].message}`,t.style.fontStyle="italic",t.style.color="#aaaaaa",M.append(t)}};let J,Y,A={},G=[];const K=(e,t,o)=>{Y.save(),Y.fillStyle=o,Y.beginPath(),Y.arc(e,t,5,0,2*Math.PI),Y.fill(),Y.restore()};let Q,U,V;const W=(t,o,r,a)=>{if(V="Erased Pixels...",null!=o){let s=e(t.x,t.y,r,a),n=e(o.x,o.y,r,a);P(s.x,s.y,n.x,n.y,l(0,0,0,0)),I(s.x,s.y,l(0,0,0,0))}},Z=(o,r,a,n)=>{if(V=`Penciled Pixels as ${t(s())}...`,null!=r){let t=e(o.x,o.y,a,n),l=e(r.x,r.y,a,n);P(t.x,t.y,l.x,l.y,s()),I(t.x,t.y,s())}},_=(a,s,i,c)=>{let h=e(a.x,a.y,i,c);var d;d=((e,t)=>{if(e<0||e>=v.width||t<0||t>=v.height)return;let o=R(e,t,v.width);return l(q[o],q[o+1],q[o+2],q[o+3])})(h.x,h.y),n(d.r,d.g,d.b,d.a),o.value=t(r)},ee=()=>{U=Q.Eraser},te=()=>{U=Q.Pencil},oe=()=>{U=Q.Dropper};let re,ae,se,ne={width:64,height:64},le={width:600,height:600},ie={x:-1,y:-1},ce=!1,he=.1;const de=e=>{var t,r,s;ne=e,re=document.querySelector("#rawimage"),t=ne.width,r=ne.height,s=re,v.width=t,v.height=r,b=s,b.width=t,b.height=r,k=b.getContext("2d"),(()=>{N=k.createImageData(v.width,v.height),q=N.data;for(let e=0;e<q.length;e+=4)q[e]=0,q[e+1]=0,q[e+2]=0,q[e+3]=0;k.putImageData(N,0,0)})(),ae=document.querySelector("#display"),((e,t,o)=>{window.devicePixelRatio,A.width=e,A.height=t,J=o,J.width=e,J.height=t,Y=J.getContext("2d"),Y.imageSmoothingEnabled=!1,Y.mozImageSmoothingEnabled=!1,Y.webkitImageSmoothingEnabled=!1,Y.msImageSmoothingEnabled=!1})(le.width,le.height,ae),o=document.querySelector("#colorPicker"),o.onchange=a,(()=>{const e=document.querySelector("#historyHolder");M=e.querySelector("#changes");const t=e.querySelector("#undo"),o=e.querySelector("#redo");t.onclick=D,o.onclick=z})(),document.querySelector("#eraser").onclick=ee,document.querySelector("#pencil").onclick=te,document.querySelector("#dropper").onclick=oe,Q={Eraser:W,Pencil:Z,Dropper:_},U=Q.Pencil,ae.onmousedown=ue,document.onmouseup=ge,document.onmousemove=pe,ae.touchstart=ue,document.touchend=ge,document.touchmove=pe,me()},me=()=>{var e;requestAnimationFrame(me),e=b,Y.clearRect(0,0,A.width,A.height),Y.save(),Y.fillStyle="white",Y.fillRect(0,0,A.width,A.height),Y.restore(),Y.drawImage(e,0,0,e.width,e.height,0,0,A.width,A.height),ce&&(((e,t,o,r)=>{U(e,t,o,r)})(ie,se,le,ne),$()),!ce&&E&&(e=>{E=!1;const t={time:Date.now(),changes:O,changeNumber:X+=1,message:e};H.push(t),O=[],H.length>1e3&&H.shift(),(e=>{e.roomId=i,u("/sendChange",x,"application/json",JSON.stringify(e))})({time:t.time,changes:t.changes}),B()})(V),he-=1/60,he<=0&&(he=.1,m(`/getPlayers?roomId=${i}`,w),se.x==ie.x&&se.y==ie.y||(e=>{u("/updatePlayer",y,"application/x-www-form-urlencoded",`roomId=${i}&playerId=${h}&mousePosX=${e.x}&mousePosY=${e.y}&color=${c}`)})(ie)),K(ie.x,ie.y,c),((e,t)=>{G.length!=e.length&&(G=e);for(let o=0;o<e.length;o++)if(e[o].id!=t){let t=parseFloat(G[o].position.mousePosX),r=parseFloat(G[o].position.mousePosY),a=parseFloat(e[o].position.mousePosX),s=parseFloat(e[o].position.mousePosY);t<0&&(t=a),r<0&&(r=s);let n=1/60*5*(a-t),l=1/60*5*(s-r),i=e[o].color;G[o].position.mousePosX=t+n,G[o].position.mousePosY=r+l,K(t+n,r+l,i)}})(d,h),se=ie},ue=e=>{ce=!0},ge=e=>{ce=!1},pe=e=>{const t=ae.getBoundingClientRect();ie={x:e.clientX-t.x,y:e.clientY-t.y}};let fe,ye,we,Se;const xe=()=>{fe.className="left",ye.className="right",we.className="center",Se.className="right"},be=()=>{p();let e=fe.querySelector("#roomList");for(;e.firstChild;)e.removeChild(e.firstChild)},ke=()=>{fe.className="center",we.className="right",we.className="right",Se.className="right"},Ne=()=>{var e,t;fe.className="left",ye.className="center",we.className="left",Se.className="right",e=we.querySelector("#roomName").value,t=we.querySelector("#canvasSize").value,u("/createRoom",f,"application/x-www-form-urlencoded",`roomName=${e}&canvasSize=${t}`)},qe=e=>{fe.className="left",ye.className="right",we.className="center",Se.className="right",we.querySelector("#message").innerText=e},ve=e=>{fe.className="left",ye.className="left",we.className="left",Se.className="center",de({width:parseInt(e.canvasSize),height:parseInt(e.canvasSize)})},Ie=e=>{var t;t=e.target.name,fe.className="left",ye.className="center",we.className="right",we.style.visibility="hidden",Se.className="right",(e=>{m("/joinRoom?id="+e,S)})(t)},Ce=e=>{let t=fe.querySelector("#roomList");for(;t.firstChild;)t.removeChild(t.firstChild);let o=Object.keys(e);if(void 0!==o)if(o.length<=0)console.dir("empty");else for(let r=0;r<o.length;r++)$e(e[o[r]].id,e[o[r]].name,t);else console.dir("null")},Pe=e=>{let t=fe.querySelector("#roomList");for(;t.firstChild;)t.removeChild(t.firstChild);t.innerText=e},$e=(e,t,o)=>{const r=document.createElement("input");r.type="button",r.id=e,r.name=e,r.value=t,r.onclick=Ie,o.append(r)};window.onload=()=>{fe=document.querySelector("#menu"),ye=document.querySelector("#loadingRoom"),we=document.querySelector("#createRoom"),Se=document.querySelector("#paint"),fe.querySelector("#createNewRoomButton").onclick=xe,fe.querySelector("#refreshRoomListButton").onclick=be,we.querySelector("#returnToMenuButton").onclick=ke,we.querySelector("#createRoomButton").onclick=Ne,p()}})();