const fs = require("fs");
const mysql = require("mysql");
const path_dir = "D:\\data\\wwwroot\\xiezhenji.web\\static\\mrw\\";
const connection = mysql.createConnection({
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

files.forEach((file, index) => {
  let old_dir = `${path_dir}${file}`;
  let new_dir = `${path_dir}mrw_${index + 1}`;
  let cover_img_path = `/mrw/mrw_${index + 1}/image_1`;

  //更改文件夹名称
  // fs.renameSync(old_dir, new_dir);
  renameImgs(new_dir);
  // op.insert(["美女", file, Number(files.length), file, cover_img_path, `mrw/mrw_${index + 1}`, `mrw_${index + 1}`]);
});

function renameImgs(dir) {
  //获取图集下图片
  let images = fs.readdirSync(dir, {
    encoding: "utf-8"
  });

  //更下图片名称
  images.forEach((image, cur) => {
    let old_img = `${dir}\\${image}`;
    let new_img = `${dir}\\image_${cur}.jpg`;

    fs.renameSync(old_img, new_img);
  });
}

function insert(arr) {
  let sql = `INSERT INTO photo_album_collect(tags,name,num,intro,cover_img,dir,new_name) VALUES(?,?,?,?,?,?,?)`;
  let sql_params = arr;

  connection.query(sql, sql_params, function(err, result) {
    if (err) {
      console.log("[SELECT ERROR] - ", err.message);
      return;
    }

    console.log("--------------------------SELECT----------------------------");
    console.log(result);
    console.log(
      "------------------------------------------------------------\n\n"
    );
  });
}
