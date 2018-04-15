const { User, UserConnection } = require("./User"),
  Dao = require("./Dao");

class Service {
  constructor(database) {
    this.dao = new Dao(database);
  }

  async saveUsers(users) {
    //sometimes may insert failed for duplicating, but it's normal.
    // because some peolple just following each other
    this.dao.bulkInserts(users);
  }


  async selectNextUser() {
    let rows = await this.dao.execute("select * from progress where done = 0 limit 1");
    if(rows != null && rows.length > 0){
        return rows[0]
    }
    return null;
  }

  async progressInsert(url_token) {
    await this.dao.execute("insert into progress(url_token) values ?", [[url_token]]);
    
  }

  async progessUpdate(url_token, type, off) {
    await this.dao.execute(
      "update progress set ? where ?",
      {
        [type]: off
      },
      {
        url_token: url_token
      }
    );
    
  }

  async progessDone(url_token) {
    await this.dao.execute(
      "update progress set ? where ?",
      {
        done: 1
      },
      {
        url_token
      }
    );
  }
}

module.exports = Service;
