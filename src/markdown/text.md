+++
title: Review Javascript — this 繫結綁定
date: 2019-11-20
tags: [JavaScript,Front End Development,Frontend,]
+++

<img class="cp t u dn ak" src="https://miro.medium.com/max/6706/0*Tn6EoEpiHO0wWmGA" role="presentation"><br/><strong class="gm gy">this</strong> 是自動定義在每個函式 Scope 內的特殊關鍵字，但猶豫本身的命名以及使用方式容易讓人感到混淆，因此在複習 Javascript 順手整理自己關於對 <strong class="gm gy">this</strong> 觀念的釐清以及了解背後原理行為

### <strong class="az">this 定義</strong>

就字面上定義來講，很容易誤認為 this 就是指到目前函式 Scope 的物件，但實際上決定 this 所綁定的物件<strong class="gm gy">並非是函式宣告的時候</strong>所定義，而是在<strong class="gm gy">呼叫函式時的時機</strong>去決定 this 所指向的目標

<img class="cp t u dn ak" src="https://miro.medium.com/max/2488/1*iJobgByhZuQYfdFXNTlyUg.png" role="presentation"><br/>上例子可以明顯看出來 this 並不是宣告時作綁定，而是在呼叫的時候作綁定，因此我們得出

<span style="font-size: 26px; color: #696969; font-style:italic">this 取決於餘函式被呼叫的方式</span>### 呼叫地點

呼叫地點決定了 this 綁地的目標，也因此搞清楚呼叫地點的位置對於 this 的理解佔有很大的幫助，首先我們知道 Javascript Engine 裡面有所謂的 Call-stack 也就是執行至當前階段裡面被呼叫的函式堆疊

<img class="cp t u dn ak" src="https://miro.medium.com/max/4252/1*vrCjWedThbeFYy-WL5Zg7A.png" role="presentation"><br/>上圖中第一個被呼叫地點為 global 第二個則為 firstStack scope 裡面，基本理解呼叫地點之後，接著我們可以整理出理解 this 的幾個規則搭配呼叫地點的檢查來做理解．

四個規則如下

<ol>
<li id="063a" class="gk gl el bk gm b gn go gp gq gr gs gt gu gv gw gx if ig ih">預設繫結 -&gt; 就是字面上的預設，若沒有其他三項規則下，通常 this 就是預設繫結也就是綁定到 global object，如上圖 first &amp; second function 的 this 都屬於 global object</li><li id="47cb" class="gk gl el bk gm b gn ii gp ij gr ik gt il gv im gx if ig ih">隱含繫結 -&gt; 當函式的呼叫是透過物件參考而呼叫的話，this 會被綁定到此物件上，而注意到的是假使是多個物件參考連結，是綁定於最後的物件，而注意到根據函式使用方式，有可能會丟失隱含繫結的綁定</li>
</ol><img class="cp t u dn ak" src="https://miro.medium.com/max/2024/1*OlmYj8YOmFD8oZNRwU-RrA.png" role="presentation"><br/>3. 明確繫結 -&gt; 不同於隱含系結須透過物件參考呼叫函式，所有的 JS 函式都可以透過 <strong class="gm gy">call(..) &amp; apply(..) </strong>來做 this 綁定，細節用法可以看一下小弟以前<a href="https://ithelp.ithome.com.tw/articles/10196608" class="at cg ef eg eh ei" target="_blank" rel="noopener nofollow">鐵人賽的廢文</a>

<img class="cp t u dn ak" src="https://miro.medium.com/max/2000/1*N-6rXagwl_UYJA2OejZrWg.png" role="presentation"><br/>4. 硬繫結 -&gt; 上述的系結方法都有可能遇到預料外的情況如 this 被某個 framework 給覆蓋掉，在 ES5 提供了 bind 來強制綁定，先前寫 react 的大家應該也很常使用到此方法

<img class="cp t u dn ak" src="https://miro.medium.com/max/2672/1*QM8BEeeR5pTWAnoo92iVHA.png" role="presentation"><br/>再來額外會影響到 this 繫結的還有透過 <strong class="gm gy">new</strong> 所創建出來的物件，以一個 new 的行為建立物件會有以下的行為

<ol>
<li id="684b" class="gk gl el bk gm b gn go gp gq gr gs gt gu gv gw gx if ig ih">建立一個全新的物件</li><li id="5275" class="gk gl el bk gm b gn ii gp ij gr ik gt il gv im gx if ig ih">此物件會帶有 constructor function 的 prototype chain</li><li id="4650" class="gk gl el bk gm b gn ii gp ij gr ik gt il gv im gx if ig ih">此物件會被設為 constructor function 中的 this</li><li id="7688" class="gk gl el bk gm b gn ii gp ij gr ik gt il gv im gx if ig ih">除非函式自帶回傳物件，否則 new 會自動回傳新建的物件</li>
</ol>而 this 綁定的優先順序則是從後到頭，也就是 new 物件繫結 &gt; bind &gt; call &amp; apply &gt; obj.function &gt; default

以上就是簡易的 this 觀念整理，可以總結得到如果想要清楚判斷 this 所指定的目標可以參考一下步驟，但前提都基於檢查好函式呼叫的位置後判斷規則

<ol>
<li id="1833" class="gk gl el bk gm b gn go gp gq gr gs gt gu gv gw gx if ig ih">是否為 new 所建立的物件，如果是則以 new 綁定的 this 為主</li><li id="fb08" class="gk gl el bk gm b gn ii gp ij gr ik gt il gv im gx if ig ih">透過 bind 硬繫結強制綁定函式與其對應的物件，注意到在 bind 參數裡面除了第一個為綁定的物件以外，後續的參數會被預設為綁定函式中的標準參數，技術上來說被稱為 currying</li><li id="1e70" class="gk gl el bk gm b gn ii gp ij gr ik gt il gv im gx if ig ih">透過 call &amp; apply 明確指定函式運用的物件</li><li id="1ea9" class="gk gl el bk gm b gn ii gp ij gr ik gt il gv im gx if ig ih">預設情況下的 this 為 global object 或者在嚴格模式執行下為 undefined</li>
</ol>以上就是小小整理大概影響 this 綁定的要素，還有很多細節也歡迎大家自己再去查閱，例如 ES6 箭頭函式的綁定行為，隱含繫結怎麼失去的等等，希望大家會有一點點明白 this 的原理，小弟還不是很擅長白話解釋，也歡迎大家留言告訴小弟看完有沒有哪裡還疑惑的地方或者錯誤的地方再麻煩指教

Reference —

<a href="https://github.com/getify/You-Dont-Know-JS" class="at cg ef eg eh ei" target="_blank" rel="noopener nofollow">You don’t know JS</a>

<a href="https://www.udemy.com/course/understand-javascript/" class="at cg ef eg eh ei" target="_blank" rel="noopener nofollow">Javascript: understand the weird parts</a>

## Review Javascript — this 繫結綁定

