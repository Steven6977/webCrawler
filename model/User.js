
const domain = 'https://www.zhihu.com'
, followeesURL = url_token => `/api/v4/members/${url_token}/followees`
, followersURL = url_token => `/api/v4/members/${url_token}/followers`
, queryParm = '?include=data%5B*%5D.answer_count%2Carticles_count%2Cgender%2Cfollower_count%2Cis_followed%2Cis_following%2Cbadge%5B%3F(type%3Dbest_answerer)%5D.topics&offset=0&limit=20';


let dataKeys = [
	'id',
	'name',
	'url_token',
	'gender',
	'answer_count',
	'articles_count',
	'follower_count',
	'followee_count'
];

/**
 * pure user data
 */
class User {
    constructor(data) {
        for(let key of dataKeys) {
            this[key] = data[key]
				}
				this._url = {
					followees: domain + followeesURL(data.url_token) + queryParm,
					followers: domain + followersURL(data.url_token) + queryParm
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


module.exports = User;