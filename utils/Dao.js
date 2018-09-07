const mysql = require("mysql2/promise");

class Dao {
  constructor(options) {
    this.options = options;
  }

  async init() {
    if (this.pool != null) return;

    try {
      this.pool = await mysql.createPool(this.options);
    } catch (e) {
      console.log(e);
    }
  }

  async execute(sql, ...args) {
	await this.init();


    try {
      let connection = await this.pool.getConnection();
      // execute will internally call prepare and query
      let [rows, fields] = await connection.query(sql, args);
	  await connection.release();
	  return rows
    } catch (e) {
		if(e.code != 'ER_DUP_ENTRY') {
			console.log(e);
		}
	}
  }

  /**
   * insert object, tablename is the constructor name
   */
  async insertObject(obj) {
	await this.init();

    let table = Object.getPrototypeOf(obj).constructor.name;
    let columns = Object.keys(obj);
    let values = Object.values(obj);
    let sql = `insert into ${table}(${columns.join(",")}) values ?`;

    try {
      let connection = await this.pool.getConnection();
      // execute will internally call prepare and query
       let [rows, fields] = await connection.query(sql, [[values]]);
	   await connection.release();
	   return rows;
    } catch (e) {
		if(e.code != 'ER_DUP_ENTRY') {
			console.log(e);
		}
	}
  }

  /**
   * Nested arrays are turned into grouped lists (for bulk inserts),
   * e.g. [['a', 'b'], ['c', 'd']] turns into ('a', 'b'), ('c', 'd')
   * if one fails, the whole would fail!
   * So I have to insert manually one by one!
   */
  async bulkInserts(data) {
	await this.init();

    if (!Array.isArray(data)) return;
    if (data.length == 0) return;

	let count = 0;
	try{
		//can not use foreach, use for ... of  or  Promise.all instead!
		for (let ele of data) {
			let rows = await this.insertObject(ele);
			if (rows != null && rows.affectedRows == 1) {
				count++;
			}
		}
	}catch(e) {
		console.log(e)
	}

    return count;
  }

  async destory() {
	await this.init();

    try {
      await this.pool.end();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Dao;
