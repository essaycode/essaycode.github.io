---
layout: post
title:  "react-router(v4) 路由跳转后返回页面顶部问题"
date:   2018-01-25 16:56:19 +0800
author: "孙印凤"
categories: sunyinfeng
---
### 遇到的问题
由A页面跳转到B页面，B页面停留在A页面的位置，没有返回到顶部。

### 问题分析
首先分析下出现此问题的原因：
在项目中使用的是 hashHistory，它是建立在 history 之上的，当路由发生变化时会记住原路由的状态，跳转新页面后默认停留在原页面的位置。

### 解决方法
- 使用 withRouter；

withRouter可以包装任何自定义组件，将react-router 的 history,location,match 三个对象传入.无需一级级传递react-router 的属性，当需要用的router 属性的时候，将组件包一层withRouter，就可以拿到需要的路由信息。

1、定义ScrollToTop组件，代码如下：
{% highlight ruby %}
    import React, { Component } from 'react';
    import { Route, withRouter } from 'react-router-dom';

    class ScrollToTop extends Component {
        componentDidUpdate(prevProps) {
            if (this.props.location !== prevProps.location) {
              window.scrollTo(0, 0)
            }
        }
        render() {
            return this.props.children
        }
    }
    export default withRouter(ScrollToTop);
{% endhighlight %}

2、在定义路由处引用该组件，代码如下：
{% highlight ruby %}
    ReactDOM.render((
        <HashRouter>
            <ScrollToTop>
                <div className="container">
                    <Route path={routePaths.INDEX} exact component={Index} />
                    <Route path={routePaths.CARD} component={Card} />
                    <Route path={routePaths.BASEINFO} component={BaseInfo} />
                    <Route path={routePaths.EDUINFO} component={EduInfo} />
                    <Route path={routePaths.FAMILYINFO} component={FamilyInfo} />
                    <Route path={routePaths.OTHERINFO} component={OtherInfo} />
                    <Route path={routePaths.DETAIL} component={Detail}/>
                </div>
            </ScrollToTop>
        </HashRouter>
        ),
        document.getElementById('app')
    );
{% endhighlight %}

这样就可以实现路由跳转后返回页面顶部，问题解决！
