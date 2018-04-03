---
layout: post
title:  "react中键盘enter事件处理"
date:   2018-03-28 20:50:19 +0800
author: "孙印凤"
categories: sunyinfeng
---

对于常见的搜索需求业务场景，用户输入完成后，点击enter事件请求数据，要求不提交页面，实现数据局部更新，这需要用到react中的表单Forms。

### 处理方法

（1）html书写

form标签中去掉action参数，定义onSubmit方法，如下所示：

{% highlight ruby %}
   <div className="mc2">
      <form onSubmit={(e) => this.getSearchData(e,this.state.searchkey)}>
        <b></b>
        <input name="searchkey" type="text" className="search" placeholder="请输入关键字" value={this.state.searchkey} onChange={(e) => this.change(e.target.name,e.target.value)}/>
      </form>
    </div>
{% endhighlight %}

（2）事件处理

关键的是阻止掉页面默认提交：

{% highlight ruby %}
   getSearchData(event,name) {
      //ajax处理
      event.preventDefault();//阻止页面提交刷新
    }
{% endhighlight %}

以上就是react中form提交表单的使用方法。
