var myXml = new XMLHttpRequest();
myXml.onreadystatechange = function() {
  if (myXml.readyState === 4) {
    if (myXml.status == 200) {
      console.log("OK"); //通信成功時
    } else {
      console.log("NO"); //通信失敗時
    }
  }
}
myXml.onload = function(e) {
  console.log("complete"); //通信完了時
  var data = JSON.parse(this.response);
  var dataAry = [];
  for (let key of Object.keys(data)) {//ここがIEだめかも, babelでうまいこと変換できたら
    dataAry.push(data[key]);
  }//json->配列に整形
  var urlParam = location.search.substring(1);
  if (urlParam) {//Paramがあれば下層に
    switchPage(urlParam, dataAry);
  } else {
    makeList(dataAry);
  }
}
myXml.open("GET", "/assets/data/data.json", true);
myXml.send(null);

function makeList(dataAry) {
  var html = "<ul>";
  for (var i = 0; i < dataAry.length; i++) {
    html += '<li><a href="/?newsID=' + i + '">';
    html += "<p>" + dataAry[i].date + "</p>";
    html += "<h3>" + dataAry[i].name + "</h3>";
    html += "</a></li>";
  }
  html += "</ul>";

  var target = document.getElementById("list");
  target.innerHTML = html;
}

function switchPage(urlParam, data) {
  var param = urlParam.split('&');
  var paramArray = [];
  for (var i = 0; i < param.length; i++) {
    var paramItem = param[i].split('=');
    paramArray[paramItem[0]] = paramItem[1];
  }
  var paramID = paramArray.newsID;
  if (data.length > Number(paramID)) {//有効なidかどうかチェック
    var pageData = data[Number(paramID)];
    var html = '<div class="page">'
    html += '<h1>' + pageData.name + '</h1>'
    html += '<p>' + pageData.date + '</p>'
    if (pageData.h2) {
      html += '<h2>' + pageData.h2 + '</h2>'
    }
    html += '<p>' + pageData.text + '</p>'
    if (pageData.h2_2) {
      html += '<h2>' + pageData.h2_2 + '</h2>'
      html += '<p>' + pageData.text2 + '</p>'
    }
    html += '<p><a href="/">← お知らせ一覧に戻る</p>'
    html += '</div>'
    var target = document.getElementById("text");
    target.innerHTML = html;
  }
}