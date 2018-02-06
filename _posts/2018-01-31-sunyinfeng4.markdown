---
layout: post
title:  " React Router页面传值的三种方法"
date:   2018-01-31 16:56:19 +0800
author: "孙印凤"
categories: sunyinfeng
---
### 传值方法

1、props.params

使用React router定义路由时，我们可以给<Route>指定一个path，然后指定通配符可以携带参数到指定的path：
{% highlight ruby %}
    <Route path='/user/:name' component={UserPage}></Route>
{% endhighlight %}

跳转UserPage页面时，可以这样写：
{% highlight ruby %}
    //link方法
    <Link to="/user/sam">用户</Link>
    //push方法
    this.props.history.push("/user/sam");
{% endhighlight %}

在UserPage页面中通过 this.props.params.name 获取值。

上面的方法可以传递一个或多个值，但是每个值的类型都是字符串，没法传递一个对象,如果要传的话可以将json对象转换为字符串，传递过去之后再将json字符串转换为对象。
{% highlight ruby %}
    let data = {id:3,name:sam,age:36};
    data = JSON.stringify(data);
    let path = '/user/${data}';

    //在页面中获取值时
    let data = JSON.parse(this.props.params.data);
{% endhighlight %}

2、query

query方式可以传递任意类型的值，但是页面的URL也是由query的值拼接的，URL很长且是明文传输。
{% highlight ruby %}
    //定义路由
    <Route path='/user' component={UserPage}></Route>

    //数据定义
    let data = {id:3,name:sam,age:36};
    let path = {
        pathname: '/user',
        query: data,
    }

    //页面跳转
    <Link to={path}>用户</Link>
    this.props.history.push(path);

    //页面取值
    let data = this.props.location.query;
    let {id,name,age} = data;
{% endhighlight %}

3、state

state方式类似于post，依然可以传递任意类型的数据，而且可以不以明文方式传输。
{% highlight ruby %}
    //定义路由
    <Route path='/user' component={UserPage}></Route>

    //数据定义
    let data = {id:3,name:sam,age:36};
    let path = {
        pathname: '/user',
        state: data,
    }

    //页面跳转
    <Link to={path}>用户</Link>
    this.props.history.push(path);

    //页面取值
    let data = this.props.location.state;
    let {id,name,age} = data;
{% endhighlight %}


以上就是React Router页面传值的三种方法（适用于v4）。
