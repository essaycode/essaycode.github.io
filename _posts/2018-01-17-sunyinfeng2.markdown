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
在开发过程中使用是没有问题的，但是将页面上传至page之后，问题就来了：用户访问的资源不存在，页面是空白的。
经过排查怀疑是路径的问题，将BrowserRouter 改为 HashRouter之后，问题解决了~

### 问题分析
首先分析下出现此问题的原因：
在React项目中我们经常需要采用React-Router来配置我们的页面路由，React-Router 是建立在 history 之上的，常见的history路由方案有三种形式，分别是：
- hashHistory
- browserHistory
- createMemoryHistory

> hashHistory 使用 URL 中的 hash（#）部分去创建路由，举例来说，用户访问http://www.example.com/，实际会看到的是http://www.example.com/#/。
{% highlight ruby %}
    <HashRouter>
        <div className="container">
            <Route path='/repos' component={Repos} />
            <Route path='/about' component={About} />
        </div>
    </HashRouter>
{% endhighlight %}
上面代码中，用户访问/repos（比如http://localhost:8080/#/repos）时，加载Repos组件；访问/about（http://localhost:8080/#/about）时，加载About组件。
> browserHistory 是使用 React-Router 的应用推荐的 history方案。它使用浏览器中的 History API 用于处理 URL，创建一个像example.com/list/123这样真实的 URL 。

在browserHistory 模式下，URL 是指向真实 URL 的资源路径，当通过真实 URL 访问网站的时候，由于路径是指向服务器的真实路径，但该路径下并没有相关资源，所以用户访问的资源不存在。

> Memory history 不会在地址栏被操作或读取。这就解释了我们是如何实现服务器渲染的。同时它也非常适合测试和其他的渲染环境（像 React Native ）。和另外两种history的一点不同是你必须创建它，这种方式便于测试。
{% highlight ruby %}
const history = createMemoryHistory(location)
{% endhighlight %}
### 解决方法
- 使用 hashHistory；

本地开发时，使用browserHistory是没有问题的，这是因为webpack.config.js中使用 webpack-dev-server 已经做了配置。
{% highlight ruby %}
    webpackConfig.devServer = {
        contentBase: path.resolve(__dirname, 'build'),
        compress: true, //gzip压缩
        historyApiFallback: true,
    };
{% endhighlight %}

- 如果要使用browserHistory的话，服务器需要进行相关路由配置，方法见 [这里](https://www.thinktxt.com/react/2017/02/26/react-router-browserHistory-refresh-404-solution.html)；

##### 参考资料：
1. [https://www.sitepoint.com/react-router-v4-complete-guide/](https://www.sitepoint.com/react-router-v4-complete-guide/)
2. [http://react-guide.github.io/react-router-cn/docs/guides/basics/Histories.html](http://react-guide.github.io/react-router-cn/docs/guides/basics/Histories.html)
3. [https://www.thinktxt.com/react/2017/02/26/react-router-browserHistory-refresh-404-solution.html](https://www.thinktxt.com/react/2017/02/26/react-router-browserHistory-refresh-404-solution.html)
4. [http://echizen.github.io/tech/2016/07-05-webpack-dev-server-react-router-config](http://echizen.github.io/tech/2016/07-05-webpack-dev-server-react-router-config)
5. [https://jaketrent.com/post/pushstate-webpack-dev-server/](https://jaketrent.com/post/pushstate-webpack-dev-server/)
