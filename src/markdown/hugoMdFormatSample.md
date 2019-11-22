+++
date = "2018-09-19"
title = "Internet Basic"
tags = [
  "Network",
  "TCP/IP"
]
categories = [
  "Network Layer",
  "Tech Note"
]
+++
在Vue裡面有許多可以完成template的方法 :

<ol>
<li id="584d" class="fe ff dc bk fg b fh fi fj fk fl fm fn fo fp fq fr fs ft fu">直接撰寫html檔案</li><li id="8bf0" class="fe ff dc bk fg b fh fv fj fw fl fx fn fy fp fz fr fs ft fu">在 instance / component物件裡面撰寫template property</li><li id="a902" class="fe ff dc bk fg b fh fv fj fw fl fx fn fy fp fz fr fs ft fu">vue file裡面的template tag</li><li id="14d1" class="fe ff dc bk fg b fh fv fj fw fl fx fn fy fp fz fr fs ft fu">Render Function</li>
</ol>相信大家對以上提到的方法並不陌生，而多半的情況下，幾乎是使用前三者的選項就可以達成理想的功能或目的，但仍然有些case相對使用Render function是比較理想的，例如 component的內容或許是隨著 input值或者是 slot value所決定時，如以下

<pre><span id="c0ec" class="gi gj dc bk gk b dy gl gm r gn">&lt;text-example content=&quot;yo&quot; :size=&quot;2&quot; /&gt; //使用component</span><span id="c3f3" class="gi gj dc bk gk b dy go gp gq gr gs gm r gn">&lt;template&gt;<br>  &lt;h1 v-if=&quot;size === 1&quot;&gt;{{ content }}&lt;/h1&gt; <br>  &lt;h2 v-else-if=&quot;size === 2&quot;&gt;{{ content }}&lt;/h2&gt;<br>&lt;/template&gt;</span></pre>

若這種狀況運用template的方式程式碼會相對冗長，而透過render function則如以下

<pre><span id="4aed" class="gi gj dc bk gk b dy gl gm r gn">render: function (h) {<br>    return h(<br>      &apos;h&apos; + this.level,  <br>      this.content<br>    )<br>  },</span></pre>

明顯的程式碼簡易許多，但同時也有一個缺點是，閱讀性可能相對沒那麼高，當然這部分也可以套用JSX來解決，端看個人喜好，本篇則著重於vue的寫法，不討論JSX的使用，希望可以讓大家更理解一點vue render function


------
接著我們透過一個簡單的範例來幫助大家理解如何使用render function，件以下template了解我們想要的component

<pre><span id="d422" class="gi gj dc bk gk b dy gl gm r gn">&lt;a-with-size :level=&quot;1&quot; url=&quot;google&quot;&gt;I&apos;m link&lt;/a-with-size&gt;</span><span id="260b" class="gi gj dc bk gk b dy go gp gq gr gs gm r gn">&lt;template&gt;<br> &lt;h1 v-if=&quot;level === 1&gt;&lt;a href=&quot;google&quot;&gt;&lt;slot&gt;&lt;/slot&gt;&lt;/a&gt;&lt;/level&gt;<br> &lt;h2 v-else-if=&quot;level === 1&gt;&lt;a href=&quot;google&quot;&gt;&lt;slot&gt;&lt;/slot&gt;&lt;/a&gt;&lt;/level&gt;<br> &lt;h3 v-else-if=&quot;level === 3&gt;&lt;a href=&quot;google&quot;&gt;&lt;slot&gt;&lt;/slot&gt;&lt;/a&gt;&lt;/level&gt;<br>&lt;template&gt;</span></pre>

轉換為render function

<pre><span id="e5f6" class="gi gj dc bk gk b dy gl gm r gn">Vue.component(&apos;a-with-size&apos;, {<br>  props: {<br>    level: {<br>      type: Number,<br>      required: true<br>    },<br>    url: {<br>      type: String,<br>      required: true<br>    }, <br>    isStyle: false,<br>  },<br>  render(h) {<br>    let self = this<br>    let data = {<br>      &apos;class&apos;: {<br>        &apos;text-color&apos;: this.isStyle,<br>       }<br>    }<br>    return h(&apos;h&apos; + this.level, data, [<br>      h(&apos;a&apos;, {<br>        attrs: {<br>          name: this.url,<br>         href: this.url<br>        },<br>      },<br>      [ this.$slots.default, <br>        h(&apos;span&apos;,&apos;hi this this hint&apos;)<br>      ]<br>      ),<br>    ])<br>  }<br>})</span></pre>

這樣我們就完成這個component，實際上使用產出來的便等同於上面的template tag

<pre><span id="22a5" class="gi gj dc bk gk b dy gl gm r gn">&lt;a-with-size :level=&quot;1&quot; url=&quot;google&quot;&gt;yoyo&lt;/a-with-size&gt;</span><span id="f2a4" class="gi gj dc bk gk b dy go gp gq gr gs gm r gn">產出以下DOM</span><span id="7ed0" class="gi gj dc bk gk b dy go gp gq gr gs gm r gn">&lt;h1 class=&quot;&quot;&gt;<br>  &lt;a name=&quot;google&quot; href=&quot;google&quot;&gt;yoyo<br>    &lt;span&gt;hi this this hint&lt;/span&gt;<br>  &lt;/a&gt;<br>&lt;/h1&gt;</span></pre>

透過render function不僅我們直接透過變數來操控h1、h2、h3的字型大小，在template重複的&lt;a&gt;&lt;slot&gt;&lt;/slot&gt;&lt;/a&gt;的部分也被省略掉了，鄉比起來component沒那麼冗長，接著我們一步一步解釋render function裡面的參數。

首先我們看到<strong class="fg hd">render(h)，</strong>h可為任意命名，在vue裡面的代表的是createElement，這個函式主要是產生紀錄要給virtual Dom的結構，而不是真的指的Dom，所以透過此函式的參數我們一個一個理解。

<ol>
<li id="aeb5" class="fe ff dc bk fg b fh fi fj fk fl fm fn fo fp fq fr fs ft fu"><strong class="fg hd">String </strong>— 只能是唯一的Vnode<br>若這第一個參數塞入兩個Vnode，則會回報error，此參數便是為上面範例的<strong class="fg hd">’h’+this.level，</strong>而這邊也可以直接塞入一個component。</li><li id="c3e2" class="fe ff dc bk fg b fh fv fj fw fl fx fn fy fp fz fr fs ft fu"><strong class="fg hd">Object </strong>— 紀錄此template的屬性，包含dom attr，事件綁定，樣式等等<br>此處紀錄的可以是v-bind的class以及一般staticClass，包含對tag裡面的attr設定，如 href、name、id，等等都可以在此處設定，而特別注意到由於<strong class="fg hd">render function並不支援一般的v-on、v-bind</strong>，所以此處也有一個<strong class="fg hd">on的property提供我們自己撰寫綁定的事件處理</strong>。<br>完整的屬性設定可以參考<a href="https://cn.vuejs.org/v2/guide/render-function.html#%E4%BA%8B%E4%BB%B6-amp-%E6%8C%89%E9%94%AE%E4%BF%AE%E9%A5%B0%E7%AC%A6" class="at cg he hf hg hh" target="_blank" rel="noopener nofollow">Vue官方文件</a></li><li id="f978" class="fe ff dc bk fg b fh fv fj fw fl fx fn fy fp fz fr fs ft fu"><strong class="fg hd">String / Array </strong>—<strong class="fg hd"> </strong>包含在唯一Vnode下的其他節點或內容，,也就是我們範例輸入的<strong class="fg hd">this.$slots.default</strong>，也可以直接輸入字串，或者是在透過<strong class="fg hd">createElement()</strong>，繼續巢狀產生Dom結構。</li>
</ol>透過以上三個參數，我們可以更彈性的去操控component內的變數，讓component更有彈性的運用，並節省冗長重複的code，但如同一開始所說的，多數component的功能透過template tag其實都能很有效率的解決，而少數情況是render function才會是相對比較必要的，尤其得考慮到render funcation component並不支援常見的<strong class="fg hd">v-bind、v-model、v-for</strong>等等需要自己在render函式裡面撰寫javascript去實現，所以雖然相對彈性並更接近底層的寫法，也是得付出一點成本的。

在小弟層級尚未足夠厲害的情況下，目前使用render function的情況多半為建立functional component等純UI component，而最近正研究於使用在high order component的建立上，但願之後有機會再來分享更高階的用法。