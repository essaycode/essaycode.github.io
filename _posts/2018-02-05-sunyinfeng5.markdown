---
layout: post
title:  " React中input自动聚焦问题"
date:   2018-02-05 09:56:19 +0800
author: "孙印凤"
categories: sunyinfeng
---
### input自动聚焦问题

在react中可以使用refs解决这个问题，首先看一下refs的使用场景：

（1）处理焦点、文本选择或媒体控制。

（2）触发强制动画。

（3）集成第三方 DOM 库。

使用refs解决input聚焦的问题有两种应用场景：

1、组件内部：

在input内部定义ref，当给 HTML 元素添加 ref 属性时，ref 回调接收了底层的 DOM 元素作为参数。例如，下面的代码使用 ref 回调来存储 DOM 节点的引用。
{% highlight ruby %}
    class CustomTextInput extends React.Component {
      constructor(props) {
        super(props);
        this.focus = this.focus.bind(this);
      }

      focus() {
        // 直接使用原生 API 使 text 输入框获得焦点
        this.textInput.focus();
      }

      render() {
        // 使用 `ref` 的回调将 text 输入框的 DOM 节点存储到 React
        // 实例上（比如 this.textInput）
        return (
          <div>
            <input
              type="text"
              ref={(input) => { this.textInput = input; }} />
            <input
              type="button"
              value="Focus the text input"
              onClick={this.focus}
            />
          </div>
        );
      }
    }
{% endhighlight %}

2、父子组件：

子组件内input定义为：
{% highlight ruby %}
    import React from 'react';

    class Input extends React.Component {
        constructor(props){
            super(props);
        };

        render() {
            return
                <input type="text" ref={this.props.inputRef}/>;
        }
    }

export default Input;
{% endhighlight %}

父组件调用方法：
{% highlight ruby %}
    <Input name="中文姓" id="surname" placeholder="与身份证一致"
    inputRef={el => this.surname = el}/>

    componentDidMount() {
        this.surname.focus();
    }
{% endhighlight %}

以上就是refs在input聚焦中的使用方法。
