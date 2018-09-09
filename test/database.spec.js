const
  expect = require('chai').expect,
  User = require("../model/User"),
  Progress = require("../model/Progress"),
  Service = require("../utils/Service"),
  Dao = require("../utils/Dao"),
  { log, connect, unconnect } = require("../utils");

let opts = {
  host: "localhost",
  port: 3306,
  connectionLimit: 10,
  user: "root",
  password: "123456",
  database: "webcrawler"
}

let service = null;

before(async function() {
  let pool = null;
  try {
    pool = await connect(opts);
  } catch(e) {
    console.error(e);
  }
  service = new Service(new Dao(pool));
  console.log('connection built')
});

after(function() {
  unconnect(service.dao.pool);
  console.log('connection shutdown')
});


describe('service testing', function() {
  it('selectNext', async function() {
    let obj = await service.selectNext();
    console.log(obj);
  });
});



