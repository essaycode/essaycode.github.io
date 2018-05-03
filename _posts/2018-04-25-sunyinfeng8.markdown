---
layout: post
title:  "ie下th、td高度问题"
date:   2018-04-25 18:18:18 +0800
author: "孙印凤"
categories: sunyinfeng
---

在ie浏览器下table中的th、td高度不可控，出现以下问题：

![进坑了](/assets/img/table.png)

### 处理方法

检查代码发现css里面定义了table的高度，当数据比较少时会自适应填满table。当时定义height是为了当高度高于给定值时出现滚动条，所以可以将height改为max-height。

