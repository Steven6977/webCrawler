# webCrawler
web crawler for zhihu.com, searching for user data,based on nodejs   
js爬虫，抓取知乎用户数据


## change log

2018-09-08: reactor  
2018-09-08: 重构代码

2018-04-15: using pooling connections  
2018-04-15: 使用数据库连接池

2018-04-14: fix bugs, add progress saving  
2018-04-14: 修改bugs，加入进度缓存

2018-04-11: add persistence, using mysql  
2018-04-11: 增加数据存储，使用mysql数据库

2018-04-08: prototype，ouput to console，need to add persistence like databases  
2018-04-08: 原型，结果全部输出到控制台的，后续需要增加持久化，存储文件等


## demonstration

  ![image](https://github.com/Steven6977/image-hosting/blob/master/2.gif)

## usage

install:
`npm install`

start:
`npm start`


index.js:
```javascript
var ZC = require('./ZhihuCrawler')

let zc = new ZC({

    /**
     * the thing is, if the http requests is sending too fast, the server will just reject
     */
    maxConnections: 5,
    /**
     * slow down, maxConnections will be forced to 1 if rateLimit is passed!
     * rateLimit 1000 means sending request at interval of 1 second
     */
    rateLimit: 0,

    /**
     * database config, optional
     * if database can be undefined, if you don't want
     */
    database: {
        host: "localhost",
        port: 3306,
        connectionLimit: 10,
        user: "root",
        password: "123456",
        database: "webcrawler"
    }
});

zc.start({
    /**
     * the entry point of searching
     */
    entry: {
        /**
         * For example, search user vczh, his homepage is 
         * https://www.zhihu.com/people/excited-vczh/activities
         * so the url_token is excited-vczh
         */
        url_token: 'ghost-shing'
    },
    /**
     * most http header has been pre-defined, but cookie and authorization need to be filled,
     * log in first, then open debug window for browser, copy these keys.
     * 
     * please change it with your Cookie and Authorization!!!
     */
    httpHeader: {
        'Cookie': '',
        'Authorization': ''
    },
    /**
     * callback function when the whole crawling is over
     */
    finished: () => {
        console.log('THE END')
    }
});


```

## Database

```sql
CREATE TABLE `progress` (
  `url_token` varchar(100) NOT NULL,
  `followers` int(11) DEFAULT '0',
  `followees` int(11) DEFAULT '0',
  `done` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`url_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `user` (
  `id` varchar(50) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `url_token` varchar(100) NOT NULL,
  `gender` int(11) DEFAULT NULL,
  `answer_count` int(11) DEFAULT NULL,
  `articles_count` int(11) DEFAULT NULL,
  `follower_count` int(11) DEFAULT NULL,
  PRIMARY KEY (`url_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

```