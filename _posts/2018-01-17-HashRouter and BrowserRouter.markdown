---
layout: post
title:  "react-router HashRouter 和 BrowserRouter的使用"
date:   2018-01-17 20:48:19 +0800
author: "孙印凤"
categories: sunyinfeng
---
### 遇到的问题
项目中控制路由跳转使用的是BrowserRouter，代码如下：
{% highlight ruby %}
ReactDOM.render((
    <BrowserRouter>
        <div className="container">
            <Route path={routePaths.INDEX} exact component={Index} />
            <Route path={routePaths.CARD} component={Card} />
            <Route path={routePaths.BASEINFO} component={BaseInfo} />
            <Route path={routePaths.EDUINFO} component={EduInfo} />
            <Route path={routePaths.FAMILYINFO} component={FamilyInfo} />
            <Route path={routePaths.OTHERINFO} component={OtherInfo} />
            <Route path={routePaths.DETAIL} component={Detail}/>
        </div>
    </BrowserRouter>
    ),
    document.getElementById('app')
);
{% endhighlight %}
在开发过程中使用是没有问题的，但是将页面上传至page之后，问题就来了：页面访问不了，空白的！
经过排查问题怀疑是路径的问题，将BrowserRouter 改为 HashRouter之后，问题解决了~

### 问题分析
首先分析下出现此问题的原因：
在React项目中我们经常需要采用React-Router来配置我们的页面路由，React-Router 是建立在 history 之上的，常见的history路由方案有三种形式，分别是：

### （未完待续...）

##### 参考资料：
1. [https://www.sitepoint.com/react-router-v4-complete-guide/](https://www.sitepoint.com/react-router-v4-complete-guide/)
