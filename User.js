
const domain = 'https://www.zhihu.com'
, followeesURL = url_token => `/api/v4/members/${url_token}/followees`
, followersURL = url_token => `/api/v4/members/${url_token}/followers`
, queryParm = '?include=data%5B*%5D.answer_count%2Carticles_count%2Cgender%2Cfollower_count%2Cis_followed%2Cis_following%2Cbadge%5B%3F(type%3Dbest_answerer)%5D.topics&offset=0&limit=20';


let dataKeys = [
    'name',
    'url_token',
    'gender',
    'answer_count',
    'articles_count',
    'follower_count'
];

/**
 * pure user data
 */
class User {
    constructor(data) {
        for(let key of dataKeys) {
            this[key] = data[key]
        }
    }

    print() {
        let str = '';
        for(let key of dataKeys) {
            str += `${key}: ${this[key]} `
        }
        console.log(str);
    }
}

/**
 * user info and connections
 */
class UserConnection {
    constructor(user) {
        this.user = user;
        this.followers = new Set();
        this.followees = new Set();
        this.url = {
            followees: domain + followeesURL(this.user.url_token) + queryParm,
            followers: domain + followersURL(this.user.url_token) + queryParm
        }
    }


    print() {
        console.log(`==============================${this.user.name}==============================`);
        console.log('关注他的人[followers]: '+ this.followers.size)
        this.printSet(this.followers);
        console.log('他关注的人[followees]: '+ this.followees.size)
        this.printSet(this.followees);
        console.log('======================================================================');
    }


    printSet(set) {
        let str = ''
        for( const[value] of set.entries()) {
            str += `${value.name}, `
        }
        console.log(str)
    }
}

module.exports = {
    User,
    UserConnection
};