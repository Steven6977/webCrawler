
class Dao {
  constructor(pool) {
    this.pool = pool;
  }

  async execute(sql, ...args) {
    let connection = await this.pool.getConnection();
    let result = null;
    try {
      // execute will internally call prepare and query
      let [rows, fields] = await connection.query(sql, args);
      result = rows;
    } catch (e) {
		  if(e.code != 'ER_DUP_ENTRY') {
			  console.log(e);
		  }
    }
    await connection.release();
    return result;
  }

  /**
   * insert object, tablename is the constructor name
   */
  insertObject(connection, obj) {
    let table = Object.getPrototypeOf(obj).constructor.name;
    let columns = Object.keys(obj);
    let values = Object.values(obj);
    let sql = `insert into ${table}(${columns.join(",")}) values ?`;
    return connection.query(sql, [[values]]);
  }

  /**
   * Nested arrays are turned into grouped lists (for bulk inserts),
   * e.g. [['a', 'b'], ['c', 'd']] turns into ('a', 'b'), ('c', 'd')
   * if one fails, the whole would fail!
   */
  async bulkInserts(data) {
    let count = 0;
    let connection = await this.pool.getConnection();
    try{
      let promises = [];
      for (let e of data) {
        promises.push(this.insertObject(connection, e));
      }
      //console.log('wait Promise all');
      await Promise.all(promises);
      //console.log('end Promise all');
      count = data.length;
    }catch(e) {
      if(e.code != 'ER_DUP_ENTRY') {
        console.log(e);
        console.log('========',data);
      }
    }
    await connection.release();
    return count;
  }

}

module.exports = Dao;
