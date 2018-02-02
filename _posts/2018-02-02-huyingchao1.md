---
layout: post
title:  '数组插入多个对象值总是被覆盖为最后一个的问题'
date:   2018-02-02 16:02:00 +0800
author: "胡颖超"
categories: huyingchao
---

### 应用场景

做一项调查问卷，需要将每个选项封装成一个对象，然后将多个对象放在一个数组里进行传递。这时发现，打印每个对象时值没有错，但是打印数组时，每一项都是最后一个对象。

### 问题重现

{% highlight ruby %}
let arr = [];
let obj = {
    questionCode: 'Q0056',
    subjectCode: '110'
}
for (let i = 0; i < 3; i++) {
    let ItemObj = Object.assign(obj, {
        objectCode: 'objectCode' + i,
        objectOrder: 'objectOrder' + i,
        optionCode: 'optionCode' + i
    });
    console.log(`------------ItemObj------------`);
    console.log(ItemObj);
    arr.push(ItemObj);
    console.log(`------------arrList------------`);
    console.log(arr);
}
{% endhighlight%}

错误代码如上所示，乍一看还不知道哪的问题。觉得代码没什么问题呀。

### 症结所在

因为对象是引用类型。而上面代码的obj声明在循环外层，每次去给obj更新值时，其实是指向同一个对象的引用，而非这个对象的父本。

### 解决方案

在每次循环的时候，重新创建一个对象。这样就可以避免每次都是对同一对象进行赋值修改。

{% highlight ruby %}
let arr = [];
for (let i = 0; i < 3; i++) {
    let obj = {
        questionCode: 'Q0056',
        subjectCode: '110'
    }
    let ItemObj = Object.assign(obj, {
        objectCode: 'objectCode' + i,
        objectOrder: 'objectOrder' + i,
        optionCode: 'optionCode' + i
    });
    console.log(`------------ItemObj------------`);
    console.log(ItemObj);
    arr.push(ItemObj);
    console.log(`------------arrList------------`);
    console.log(arr);
}
{% endhighlight%}
