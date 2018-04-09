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

