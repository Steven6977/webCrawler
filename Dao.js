const mysql = require("mysql2/promise");

class Dao {
  constructor(options) {
    this.options = options;
  }

  async init() {
    try {
      this.connection = await mysql.createConnection(this.options);
    } catch (e) {
      console.log(e);
      throw "error occurs";
    }
  }

  async execute(sql, ...args) {
    try {
      // execute will internally call prepare and query
      let [rows, fields] = await this.connection.query(sql, args);
      return rows;
    } catch (e) {
      console.log(e);
    }
  }

  async bulkInserts(data) {
    if (!Array.isArray(data)) return;
	if (data.length == 0) return;
	
    
    let obj = data[0];
    let table = Object.getPrototypeOf(obj).constructor.name;
    let columns = Object.keys(obj);
    let values = data.map(e => Object.values(e));
    let sql = `insert into ${table}(${columns.join(",")}) values ?`;

    // console.log(sql)
    // console.log(values)

    try {
      //note: query method can work well with INSERT operation, but execute method can't
      let [rows, fields] = await this.connection.query(sql, [values]);
      return rows;
    } catch (e) {
      console.log(e);
    }
  }

  destory() {
    this.connection.close();
  }
}

module.exports = Dao;
