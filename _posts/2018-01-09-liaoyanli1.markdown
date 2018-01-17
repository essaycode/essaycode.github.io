---
layout: post
title:  "windows环境用jekyll搭建博客详细步骤"
date:   2018-01-09 19:21:19 +0800
author: "廖艳丽"
categories: liaoyanli
---

### window环境准备
1. rubyinstaller 下载及安装 [rubyinstaller下载页](https://rubyinstaller.org/downloads/) 记得全部勾选
2. Ruby DevKit 下载devkit压缩包 [devkit下载页](https://rubyinstaller.org/downloads/) 解压该压缩包，进入到该目录
3. 解压该DevKit压缩包，用命令行(cmd)进入到该目录，如：cd /e:/devit 
4. 执行ruby dk.rb init 会看到找到ruby的安装目录，如果看不到请手动修改该目录下confit.yml的ruby安装目录，注意格式 - D:\Ruby23-x64，带有横线
5. 执行ruby dk.rb install
6. 执行gem install jekyll 用jekyll -v检测是否安装成功

### 用jekyll初始化项目并在本地预览
1. jekyll new blog 初始化一个jekyll项目
2. bundler install 安装依赖包
3. bundler update 更新依赖包，选做步骤
4. jekyll serve启动项目 去http://127.0.0.1:4000访问

### 将项目部署到github
1. 新建仓库，名字要与自己的用户名相同
2. 创建完成后，克隆下来到本地
3. 把本地用jekyll初始化的项目放入克隆的项目中
4. 提交项目至master分支


### 效果预览 
- 访问 https://你的用户名/github.io
- 我的博客地址是 [https://shelly0702/github.io](https://shelly0702/github.io)

### 主题，gemfile和_config.yml里的俩主题要对应（todo）

### jekyll相关命令
- jekyll serve 或者bundle exec jekyll serve 启动项目命令
- gem unistall jekyll 卸载jekyll
- gem install jekyll -v 3.1.6


### 相关资料
- [https://github.com/jekyll/jekyll](https://github.com/jekyll/jekyll)
- [https://www.jekyll.com.cn/](https://www.jekyll.com.cn/)

