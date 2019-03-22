var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "192.168.0.164",
  port: "3306",
  user: "xiezhenji",
  password: "iJAuzTbdrDJDswjPN6!*M*6%Ne",
  database: "xiezhenji"
});

connection.connect();

init();

async function init() {
  try {
    let all_tag = await selectTag();
    all_tag = all_tag.map(i => i.name);

    let all_collect = await selectCollect();

    all_collect.forEach(element => {
      let name = element.name;
      let arr = [];
      if (name) {
        all_tag.forEach(tag => {
          let reg = new RegExp(`${tag}`);
          if (reg.test(name)) {
            if (arr.length > 5) return;
            arr.push(tag);
          }
        });
        updateCollect([arr.join(","), element.id]);
      }
    });
    connection.end();
  } catch (err) {
    console.log(err);
  }
}

async function selectTag() {
  let sql = "SELECT name FROM photo_tag_list";

  return new Promise((resolve, reject) => {
    connection.query(sql, function(err, result) {
      if (err) {
        reject("[SELECT ERROR] - ", err.message);
      }
      resolve(result);
    });
  });
}

async function selectCollect() {
  let sql = "SELECT id,name FROM photo_album_collect";

  return new Promise((resolve, reject) => {
    connection.query(sql, function(err, result) {
      if (err) {
        reject("[photo_album_collect SELECT ERROR] - ", err.message);
      }
      resolve(result);
    });
  });
}

async function updateCollect(arr) {
  var sql = `UPDATE photo_album_collect SET tags = ? WHERE id = ?`;
  var sql_params = arr;

  connection.query(sql, sql_params, function(err, result) {});
}
