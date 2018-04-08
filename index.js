var ZC = require('./ZhihuCrawler')

let zc = new ZC({
    /**
     * searching depth, for example, the maxDepth is 2
     * A is the entry, A -> B -> C, then it stops
     */
    maxDepth: 2
})

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
        'Cookie': 'q_c1=68a4804edebf4027b3ad582b7875bbea|1522637959000|1522637959000; _zap=9a0a2f36-3fcd-4a2a-9dea-1ca84df992f4; r_cap_id="OWI1ODVhYWU1Yjc5NGMzY2I4ZjlmOTQ3YzllNzk2ODI=|1522934448|afb58218f3bb505c76f376e83af211597ee83643"; cap_id="NDcyMmQ3OTI1MWNjNDFkZjk0OTIwZWQzZDU4NTBkZjg=|1522934448|d4716e589e2a25620181bef790538470f19ac821"; l_cap_id="YTNlZjMzZjJiOTQzNDA4ZTgzMGNhNzcxY2MzNzg5ODA=|1522934448|ed9f9080478a2ffd74ba7897123c89aa57344d3b"; __DAYU_PP=EUMjmiYVfVYMrmUjvvENffffffff8266e3bef266; __utma=155987696.1953015715.1523115487.1523115487.1523115487.1; __utmz=155987696.1523115487.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); aliyungf_tc=AQAAAKCTFTxBHQ8An3xY2k4ZEwuh/Wgx; _xsrf=85ad2b14-2e5c-454e-8a60-8a43736531fb; d_c0="AGAgUDxqaQ2PTvhhfQVUosfEL5BdGtmIXWE=|1523192579"; capsion_ticket="2|1:0|10:1523200075|14:capsion_ticket|44:NjRkZjk5YWE5OTg2NDBiNzg3YTU3MzFmY2VjNjc0ZjQ=|777a93fefff25197f1aff53e30b9fd6ec4718557cb1235eedac8e1040ac1985d"; z_c0="2|1:0|10:1523200171|4:z_c0|92:Mi4xTGdXa0NBQUFBQUFBWUNCUVBHcHBEU1lBQUFCZ0FsVk5xMzYzV3dBTDFMMUo5QjRvbXdkOVBiSXdsZXVuVi1rMFBR|7361aeadf57e097f508f35651da2c7b196e4a0ccb5b21ed07445547fc374dfb8"',
        'Authorization': 'Bearer 2|1:0|10:1523200171|4:z_c0|92:Mi4xTGdXa0NBQUFBQUFBWUNCUVBHcHBEU1lBQUFCZ0FsVk5xMzYzV3dBTDFMMUo5QjRvbXdkOVBiSXdsZXVuVi1rMFBR|7361aeadf57e097f508f35651da2c7b196e4a0ccb5b21ed07445547fc374dfb8'
    },
    /**
     * callback function when the whole crawling is over
     */
    finished: () => {
        console.log('THE END')
    }
});

