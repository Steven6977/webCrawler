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

var App = require('./app')

let app = new App({
    /**
     * the entry point of searching
     */
    entry: {
        /**
         * For example, search user shing, his homepage is 
         * https://www.zhihu.com/people/ghost-shing/activities
         * so the url_token is ghost-shing
         */
        url_token: 'ghost-shing'
    },

    /**
     * the max searching depth. According to Six Degrees of Separation, 6 is enough.
     */
    level: 1,
    /**
     * callback function when the whole crawling is over
     */
    finished: () => {
        console.log('THE END')
    }
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

app.start();


```

## Database

```sql
CREATE TABLE `progress` (
  `url_token` varchar(100) NOT NULL,
  `followers_page` int(11) DEFAULT '0',
  `followees_page` int(11) DEFAULT '0',
  `done` tinyint(1) DEFAULT NULL,
  `level` tinyint(2) DEFAULT '0',
  PRIMARY KEY (`url_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `user` (
  `id` varchar(50) DEFAULT NULL,
  `url_token` varchar(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `gender` tinyint(2) DEFAULT NULL,
  `answer_count` int(11) DEFAULT NULL,
  `articles_count` int(11) DEFAULT NULL,
  `follower_count` int(11) DEFAULT NULL,
  `followee_count` int(11) DEFAULT NULL,
  PRIMARY KEY (`url_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8

```