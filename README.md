# webCrawler
web crawler for zhihu.com, searching for user data,based on nodejs   
js爬虫，抓取知乎用户数据


## change log
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
     * searching depth, for example, the maxDepth is 2
     * A is the entry, A -> B -> C, then it stops
     */
    maxDepth: 2

    /**
     * database config, optional
     * if database can be undefined, if you don't want
     */
    ,database: {
        host: "localhost",
        port: 3306,
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
        name: 'test-name', //just for displaying
        /**
         * For example, search user vczh, his homepage is 
         * https://www.zhihu.com/people/excited-vczh/activities
         * so the url_token is excited-vczh
         */
        url_token: 'test-name-47'
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

