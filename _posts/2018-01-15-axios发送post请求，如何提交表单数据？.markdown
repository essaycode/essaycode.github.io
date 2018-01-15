---
layout: post
title:  "axios发送post请求，如何提交表单数据？"
date:   2018-01-15 10:14:19 +0800
author: "孙印凤"
categories: sunyinfeng
---

### axios发送post请求，提交表单数据的方式

默认情况下，axios将JavaScript对象序列化为JSON。要以application / x-www-form-urlencoded格式发送数据，可以使用以下选项之一。

1. 浏览器。在浏览器中，您可以使用 URLSearchParams API，如下所示：

```
var params = new URLSearchParams();
params.append('param1', 'value1');
params.append('param2', 'value2');
axios.post('/foo', params);
```
 
请注意，并不是所有浏览器都支持 URLSearchParams（请参阅caniuse.com），但是可以使用polyfill。
或者，可以使用qs库编码数据：

```
var qs = require('qs');
axios.post('/foo', qs.stringify({ 'bar': 123 }));
```

2. Node.js。在node.js中，你可以使用 querystring 模块，如下所示：

```
var querystring = require('querystring');
axios.post('http://something.com/', querystring.stringify({ foo: 'bar' }));
``` 
你也可以使用qs库。

##### 参考资料：
1. [https://www.npmjs.com/package/axios](https://www.npmjs.com/package/axios)
2. [https://stackoverflow.com/questions/29136374/what-the-difference-between-qs-and-querystring](https://stackoverflow.com/questions/29136374/what-the-difference-between-qs-and-querystring)
