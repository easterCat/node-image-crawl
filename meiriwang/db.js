var mysql = require("mysql");
var fs = require("fs");
var path_dir = "D:\\data\\wwwroot\\xiezhenji.web\\static\\mrw";

var connection = mysql.createConnection({
    host: "192.168.0.164",
    port: "3306",
    user: "xiezhenji",
    password: "iJAuzTbdrDJDswjPN6!*M*6%Ne",
    database: "xiezhenji"
});

connection.connect();

let files = fs.readdirSync(path_dir, {
    encoding: "utf-8"
});

files.forEach(async (file, index) => {
    var photo_files = fs.readdirSync(`${path_dir}\\${file}`, {
        encoding: "utf-8"
    });

    var length = photo_files.length;

    var first_name = photo_files[0];

    var cover_img_path = `/mrw/${file}/${first_name}`;

    var new_name = `mrw_${index + 1}`;

    // var sql = `UPDATE photo_album_collect SET num=?`;
    // var sql_params = [length];

    update([length, new_name]);

    // var sql = `INSERT INTO photo_album_collect(tags,name,num,intro,cover_img,dir) VALUES(?,?,?,?,?,?)`;
    // var sql_params = ["美女", file, Number(photo_files.length), file, cover_img_path, `mrw/${file}`];

    //connection.query(sql, sql_params, function(err, result) {
    // if (err) {
    // console.log("[SELECT ERROR] - ", err.message);
    //     return;
    // }
    // console.log("--------------------------SELECT----------------------------");
    // console.log(result);
    // console.log("------------------------------------------------------------\n\n");
    //});
});

function update(arr) {
    var sql = `UPDATE photo_album_collect SET num = ? WHERE new_name = ?`;
    var sql_params = arr;

    connection.query(sql, sql_params, function(err, result) {
        // if (err) {
        // console.log("[SELECT ERROR] - ", err.message);
        //     return;
        // }
        // console.log("--------------------------SELECT----------------------------");
        // console.log(result);
        // console.log("------------------------------------------------------------\n\n");
    });
}

connection.end();
