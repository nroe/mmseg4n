MMSeg4N
============

Alpha 内部测试版

MMSeg4N 是 nroe <http://blog.nroed.com> 基于 NODEJS <http://nodejs.org> 在 MMSeg4J <http://code.google.com/p/mmseg4j> 的基础上开发


介绍
------------

mmseg4n 是基于 mmseg4j <http://code.google.com/p/mmseg4j> 的 NODEJS 的一种实现
mmseg4n 将提供基于 HTTP REST 服务的分词，目前提供的分词模式只有 Complex。
在相同的词库下，和 MMSeg4J 分词结果是一致的。

安装和要求
----------------------------
MMSeg4N 需要 NODEJS 0.4.*
操作系统 Darwin (Freebsd、Linux 尚未测试)

1. 下载并解压 mmseg4n 包
2. 进入 nroe-mmseg4n-* 目录执行启动脚本
    在 127.0.0.1 的 8085 上启动分词服务，字典目录位 mmseg4n/data/
    `#./bin/mmseg4n.sh ./data/ 127.0.0.1 8085`