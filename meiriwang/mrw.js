//爬取每日网图集

const fs = require("fs");
const http = require("http");
//引入库
const cheerio = require("cheerio");
const request = require("request");
const download = require("download");
const iconv = require("iconv-lite");
const html = require("html-parse");

let siteUrl = "https://www.meituri.com/zhongguo/";
let collectUrl = "https://www.meituri.com/a/25396/";
let imageUrl = "https://ii.hywly.com/a/1/25396/40.jpg"; //https://ii.hywly.com/a/1/25373/1.jpg
let all = [];

init(1, 2);

async function init(startPage, endPage) {
  for (let i = startPage; i <= endPage; i++) {
    await getAndSaveImg(i);
  }

  http
    .createServer(function(request, response) {
      response.writeHead(200, { "Content-Type": "html" });
      response.write(
        "<!DOCTYPE html>" +
          "<html>" +
          "<head>" +
          '<meta charset="utf-8" />' +
          "<title>预览图集</title>" +
          "</head>" +
          renderCollectHtml() +
          "</html>"
      );
      response.end();
    })
    .listen(8888);
  console.log("开启localhost:8888");

  for (let index = 0; index < all.length; index++) {
    let childs = all[index].childs;
    let title = all[index].title;

    console.log(title);
    if (childs) {
      let c_length = childs.length;
      for (let c = 0; c < c_length; c++) {
        if (!fs.existsSync(`mrw`)) {
          fs.mkdirSync(`mrw`);
        }

        if (!fs.existsSync(`mrw/${title}`)) {
          fs.mkdirSync(`mrw/${title}`);
        }

        await downloadImg2(childs[c], `mrw/${title}/${title}_image${c}.jpg`);
        console.log(
          "DownloadThumbsImg:",
          title,
          "SavePath:",
          `mrw/${title}/${title} image${c}.jpg`
        );
      }
    }
  }
}

function renderCollectHtml() {
  let dom = all.map(item => {
    return `<div><a>${item.href}</a><span>${item.title}</span><span>${
      item.num
    }</span><span>${item.childs}</span></div>`;
  });

  dom.unshift("<body>");
  dom.push("</body>");

  return dom.join("");
}

async function getAndSaveImg(page) {
  let pageImgSetUrl = ``;

  if (page === 1) {
    pageImgSetUrl = `https://www.meituri.com/zhongguo/`;
  } else {
    pageImgSetUrl = `https://www.meituri.com/zhongguo/${page}.html`;
  }

  let homeBody = await handleRequestByPromise(pageImgSetUrl);
  // homeBody = iconv.decode(homeBody, 'GBK');
  let $ = cheerio.load(homeBody);
  let lis = $(".hezi li");

  for (let i = 0; i < lis.length; i++) {
    let config = {
      href: lis
        .eq(i)
        .find("a")
        .eq(0)
        .attr("href"),
      num: lis
        .eq(i)
        .find(".shuliang")
        .text(),
      title: lis
        .eq(i)
        .find(".biaoti a")
        .text()
        .replace(/\//, "")
    };

    config.childs = [];

    let num = Number(config.num.substr(0, 2));
    for (let j = 1; j <= num; j++) {
      let link = config.href.replace(
        "https://www.meituri.com/a/",
        "https://ii.hywly.com/a/1/"
      );
      let a_link = `${link}${j}.jpg`;
      config.childs.push(a_link);
    }

    all.push(config);
  }
}

async function downloadImg2(url, dest) {
  let res = await handleRequestByPromise2(url);
  fs.writeFileSync(dest, res, {
    encoding: "binary"
  });
}

function handleRequestByPromise2(url, Referer) {
  const promise = new Promise(function(resolve, reject) {
    request(
      {
        url,
        method: "GET",
        encoding: "binary",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
          Referer: "https://www.meituri.com"
        }
      },
      (err, response, body) => {
        if (err) {
          reject(err);
        }
        if (response && response.statusCode === 200) {
          resolve(body);
        } else {
          reject(`请求✿✿✿${url}✿✿✿失败`);
        }
      }
    );
  });

  return promise;
}

function handleRequestByPromise(url, Referer) {
  let headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
    Referer: "https://www.meituri.com"
  };

  const promise = new Promise(function(resolve, reject) {
    request(
      {
        url,
        encoding: null,
        headers
      },
      (err, response, body) => {
        if (err) {
          reject(err);
        }
        if (response && response.statusCode === 200) {
          resolve(body);
        } else {
          reject(`请求✿✿✿${url}✿✿✿失败`);
        }
      }
    );
  });

  return promise;
}
