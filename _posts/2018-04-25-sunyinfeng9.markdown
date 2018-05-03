---
layout: post
title:  "react-router v4 按需加载的配置方法"
date:   2018-04-25 18:30:19 +0800
author: "孙印凤"
categories: sunyinfeng
---

在react项目开发中，当访问默认页面时会一次性请求所有的js资源，这会大大影响页面的加载速度和用户体验。所以添加按需加载功能是必要的，以下是配置按需加载的方法：

### 安装bundle-loader

{% highlight ruby %}
   npm install --save-dev bundle-loader
{% endhighlight %}

### 定义Bundle.js

{% highlight ruby %}
   import React, { Component } from 'react';
    export default class Bundle extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                // short for "module" but that's a keyword in js, so "mod"
                mod: null
            }
        }

        componentWillMount() {
            this.load(this.props)
        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.load !== this.props.load) {
                this.load(nextProps)
            }
        }

        load(props) {
            this.setState({
                mod: null
            })
            props.load((mod) => {
                this.setState({
                    // handle both es imports and cjs
                    mod: mod.default ? mod.default : mod
                })
            })
        }

        render() {
            if (!this.state.mod)
                return false
            return this.props.children(this.state.mod)
        }
    }
{% endhighlight %}

### app.jsx配置

{% highlight ruby %}
    import React from 'react';
    import ReactDOM from 'react-dom';
    import { HashRouter, Route } from 'react-router-dom';
    import * as routePaths from './js/constants/routePaths';
    import Bundle from './js/constants/Bundle.js';
    //默认打开页面直接引入
    import Index from './js/pages/Index';
    //其他页面异步引入
    import CardContainer from 'bundle-loader?lazy&name=app-[name]!./js/pages/Card';
    import './assets/css/index.scss';

    const Card = () => (
        <Bundle load={CardContainer}>
            {(Card) => <Card />}
        </Bundle>
    )

    ReactDOM.render((
        <HashRouter>
            <div className="container">
                <Route path={routePaths.INDEX} exact component={Index} />
                <Route path='/card' component={Card} />
            </div>
        </HashRouter>
        ),
        document.getElementById('app')
    );
{% endhighlight %}

### webpack.config.js 修改
{% highlight ruby %}
    webpackConfig.output = {
        path: path.resolve(__dirname, 'build/' + config.ftpTarget),
        publicPath: config.publicPath + '/',
        filename: 'js/[name].js',
        chunkFilename: 'js/[id].js'
    }
{% endhighlight %}