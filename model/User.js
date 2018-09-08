
const domain = 'https://www.zhihu.com', 
queryParm = '?include=data%5B*%5D.answer_count%2Carticles_count%2Cgender%2Cfollower_count%2Cis_followed%2Cis_following%2Cbadge%5B%3F(type%3Dbest_answerer)%5D.topics&offset=0&limit=20';


let dataKeys = [
	'id',
	'name',
	'url_token',
	'gender',
	'answer_count',
	'articles_count',
	'follower_count',
	'headline'
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
	
	getUrl(type) {
		return `${domain}/api/v4/members/${this.url_token}/${type}${queryParm}`
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