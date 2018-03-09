---
layout: post
title:  '餐厅满意度小坑记录'
date:   2018-03-02 18:22:00 +0800
author: "胡颖超"
categories: huyingchao
---

### 移动端border问题
{% highlight ruby %}
border: 0.01rem solid #eee;
// 此处的0.01rem为0.5px。在oppo和MX4（手边仅有这两个测试机）边框不显示。然后就试了下0.02rem。mx4可以了，oppo还是不可以。
{% endhighlight%}


### forEach诡异表现



### 浮点数精度问题处理
{% highlight ruby %}
0.55*100 // 55.00000000000001
{% endhighlight%}

toFixed

{% highlight ruby %}
(0.55*100).toFixed(2)
{% endhighlight%}

