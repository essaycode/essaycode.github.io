---
layout: post
title:  " ios6、7等低端浏览器样式错乱问题"
date:   2018-03-28 20:36:19 +0800
author: "孙印凤"
categories: sunyinfeng
---

在react脚手架中引用了autoprefixer，但是在ios7的手机上出现了样式错乱问题，定位后发现问题主要分为以下两点：

### flex兼容问题

（1）没有加-webkit前缀。

解决方法：保险起见，写法如下：

{% highlight ruby %}
   @mixin flex {
      display: flex;
        display: -webkit-flex;
        justify-content: center;
        -webkit-justify-content: center;
        align-items:center;
        -webkit-align-items: center;
    }
    a {
      flex: 1;
      -webkit-flex: 1;
    }
{% endhighlight %}

### transform兼容问题

（1）注意书写顺序。

解决方法：保险起见，写法如下(注意书写顺序)：

{% highlight ruby %}
   @mixin fix {
      position: fixed;
      top: 50%;
      left: 50%;
      min-width: 2.7rem;
      padding: .28rem .2rem;
      font-size: .17rem;
      letter-spacing: 0;
      text-align: center;
      background: #fff;
      border-radius: .12rem;
        transform: translateX(-50%) translateY(-50%);
        -ms-transform: translateX(-50%) translateY(-50%);
        -moz-transform: translateX(-50%) translateY(-50%);
        -webkit-transform: translateX(-50%) translateY(-50%);
        -o-transform: translateX(-50%) translateY(-50%);
      z-index: 1000;
    }
{% endhighlight %}

