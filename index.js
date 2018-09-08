var App = require('./app')

let app = new App({
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
     * the max searching depth. According to Six Degrees of Separation, 6 is enough.
     */
    level: 2,
    /**
     * callback function when the whole crawling is over
     */
    finished: () => {
        console.log('THE END')
    },
    /**
     * most http header has been pre-defined, but cookie and authorization need to be filled,
     * log in first, then open debug window for browser, copy these keys.
     * 
     * please change it with your Cookie and Authorization!!!
     */
    httpHeader: {
        'Cookie': '_zap=9a0a2f36-3fcd-4a2a-9dea-1ca84df992f4; __DAYU_PP=EUMjmiYVfVYMrmUjvvENffffffff8266e3bef266; d_c0="AMAl0Wl7sg2PTpPKqVqHG5zXwJu0AkHF2S8=|1528096029"; __utmv=51854390.100--|2=registration_date=20111021=1^3=entry_date=20111021=1; _xsrf=27e6340d-bd45-44c9-8cdb-76a98b6df3fa; q_c1=68a4804edebf4027b3ad582b7875bbea|1534241432000|1522637959000; __utma=51854390.235495985.1530522142.1530522142.1535449156.2; __utmc=51854390; __utmz=51854390.1535449156.2.2.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/people/yangluhao/followers; capsion_ticket="2|1:0|10:1536353918|14:capsion_ticket|44:YTUxNzNlMTcxMDhmNDQ2ZGJiMjQ4NGVjYjkwYWMyZGM=|b94748d7e35314fc45df55c6f81da45127c1ba9b4448b854dc8914e12e7ac7b1"; z_c0="2|1:0|10:1536353931|4:z_c0|92:Mi4xTGdXa0NBQUFBQUFBd0NYUmFYdXlEU1lBQUFCZ0FsVk5pelNBWEFBMFlrZDR0RHFZZm9ad3FFdkVMQ0tSNXlyeHFR|8bad607ea023a67de0018d0ddb3f94cb032b32d0a1a7d318865e7a851751aa5a"; tgw_l7_route=200d77f3369d188920b797ddf09ec8d1'
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

