$.when(
  $.getJSON("mySelfMessageHistory.json"),
  $.getJSON("partnerMessageHistory.json")
)
.then(function(data01, data02) {
  // JSONが取得が完了したら下記を実行
  var data01Arr = data01[0].massages;
  var data02Arr = data02[0].massages;
  // 配列に８０個のオブジェクトが入っている
  let combinedResults = data01Arr.concat(data02Arr); // データを連結

  // JSONのId（sentId）と同じ値を取得して格納する
  var JSONLength = Object.keys(combinedResults).length;
  // console.log(JSONLength);
  //JSONに記載されているIdの数字を定義(初期値)
  var sentNumArr = JSONLength - 1;
  // console.log(sentNumArr);
  setTimeout(() => {
    // console.log(combinedResults);
    // console.log(sentNumArr);
    scrollFirstDisplay(JSONLength, sentNumArr, combinedResults);
  }, "1998");
  setTimeout(() => {
    infiniteScroll(JSONLength, sentNumArr, combinedResults);
  }, "1999");
  setTimeout(() => {
    // ローディング画像を非表示
    $(".loading").addClass("hide");
    canPressButton();
  }, "2000");
  // 処理
})
.fail(function() {
  console.log("error");
});

// // 以下JSONからデータを取得する。
// var sentMessageJSON;
// $.ajax({
//   url: "mySelfMessageHistory.json",
//   type: "GET",
//   dataType: "json",
//   //リクエストが完了するまで実行。
//   beforeSend: function () {
//     // ローディング画像を表示
//     $(".loading").removeClass("hide");
//   },
//   //成功。
// })
//   .done(function (data) {
//     sentMessageJSON = data;
//     // JSONのId（sentId）と同じ値を取得して格納する
//     var JSONLength = Object.keys(sentMessageJSON).length;
//     //JSONに記載されているIdの数字を定義(初期値)
//     var sentNumArr = Object.keys(sentMessageJSON)[JSONLength - 1];
//     setTimeout(() => {
//       scrollFirstDisplay(sentNumArr);
//     }, "1998");
//     setTimeout(() => {
//       infiniteScroll(sentNumArr);
//     }, "1999");
//     setTimeout(() => {
//       // ローディング画像を非表示
//       $(".loading").addClass("hide");
//       canPressButton();
//     }, "2000");
//   })
//   //失敗。
//   .fail(function () {
//     console.log("error");
//   });
// // 以上JSONからデータを取得する。

// .scrollを取得
var scroll = document.querySelectorAll(".scroll");

// 以下スクロール画面（.scroll）内にコンテンツ（画像かテキスト）を表示させる
function scrollFirstDisplay(JSONLength, sentNumArr, combinedResults) {
  //scrollは配列になっているため、ループ処理で記載する（一回しか行わないが）。
  scroll.forEach((elm) => {
    // console.log(1111);
    //.scrollの子要素の高さの合計を定義
    var childTotalHeight = 0;
    // console.log(childTotalHeight);
    //childTotalHeightがスクロール画面（elm.clientHeight、.scrollの高さ）の高さ以下の場合、子要素を追加する
    for (var i = 0; childTotalHeight <= elm.clientHeight; i++) {
      // console.log(sentNumArr);
      //JSONに記載されているIdをゼロパディングで示す
      // var sentId = ('0000' + sentNumArr).slice(-4);
      // console.log(combinedResults);
    // console.log(combinedResults);

      // 以下JSONにテキストが記載されていた場合テキストを入れる
    // console.log(combinedResults);
    // console.log(combinedResults[sentNumArr]);
    // console.log(combinedResults[sentNumArr].text);
      if (combinedResults[sentNumArr].text != "") {
        let div = document.createElement("div");
        //作成したdiv要素にテキストを入れる
        div.textContent = combinedResults[sentNumArr].text;
        // メッセージの送り手がどちらか判断する
        // console.log(111111);
        if (combinedResults[sentNumArr].whoSend == "myself") {
          div.classList.add("scroll--output_myself__text");
        // console.log(1121111);
        } else if (combinedResults[sentNumArr].whoSend == "partner") {
          div.classList.add("scroll--output_partner__text");
        }
        elm.prepend(div);
      }
      // 以下JSONに画像が記載されていた場合画像を入れる
      if (combinedResults[sentNumArr].img != "") {
        let img = document.createElement("img");
        if (combinedResults[sentNumArr].whoSend == "myself") {
          img.classList.add("scroll--output_myself__img");
        } else if (combinedResults[sentNumArr].whoSend == "partner") {
          img.classList.add("scroll--output_partner__img");
        }
        img.src = combinedResults[sentNumArr].img;
        elm.prepend(img);
      }
      //子要素の合計の高さを求める
      childTotalHeight += elm.children[0].scrollHeight;
      // console.log(childTotalHeight);  
      // sentIdを-1する
      sentNumArr = sentNumArr - 1;
      // console.log(sentNumArr);
    }
    //.scrollの先頭（.scrollの一番下）に自動でスクロールする
    console.log($(".scroll")[0].lastElementChild);
    $(".scroll")[0].lastElementChild.scrollIntoView(false);
  });
}
// 以上スクロール画面（.scroll）内にコンテンツ（画像かテキスト）を表示させる

// 以下無限スクロール（上スクロール）
function infiniteScroll(JSONLength, sentNumArr, combinedResults) {
  //scrollは配列になっているため、ループ処理で記載する（一回しか行わないが）。
  scroll.forEach((elm) => {
    // スクロールされた際に以下の関数を実行
    elm.onscroll = function () {
      // scrollFirstDisplay()内の.scrollIntoView(false)により、最初に元の位置（scrollTopが0）から下にスクロールされているので、上部までスクロールされたことを検知するために200より小さくなったときに処理を行う。
      // console.log(this.scrollTop);
      if (this.scrollTop >= 200) return;
      // 最後まで表示していないか確認。index.htmlの.scrollにJSONデータの表示される番号をsentNumArrと設定。初期値はJSONデータの個数。
      if (sentNumArr == 0) {
        console.log("0になった");
        return;
      }

      //未ロードのテキスト・画像がある場合
      //以下上部までスクロールした際の処理
      // JSONのId（sentId）と同じ値を取得して格納する
      var sentId = ("0000" + sentNumArr).slice(-4);
      // console.log(sentId);
      // 以下テキストを入れる
      if (combinedResults.text != "") {
        let div = document.createElement("div");
        //作成したdiv要素にテキストを入れる
        div.textContent = combinedResults.text;
        if (combinedResults.whoSend == "myself") {
          div.classList.add("scroll--output_myself__text");
        } else if (combinedResults.whoSend == "partner") {
          div.classList.add("scroll--output_partner__text");
        }
        this.prepend(div);
      }

      // 以下画像を入れる
      if (combinedResults.img != "") {
        let img = document.createElement("img");
        if (combinedResults.whoSend == "myself") {
          img.classList.add("scroll--output_myself__img");
        } else if (combinedResults.whoSend == "partner") {
          img.classList.add("scroll--output_partner__img");
        }
        img.src = combinedResults.img;
        this.prepend(img);
      }
      sentNumArr = sentNumArr - 1;
    };
  });
}
// 以上無限スクロール（上スクロール）

const sendbutton = document.getElementById("sendbutton");
// 以下ボタンを押せるようにする
function canPressButton() {
  sendbutton.disabled = null;
}
// 以上ボタンを押せるようにする

// 以下入力してボタンを押すとテキストが表示される
sendbutton.addEventListener("click", function () {
  //以下送信ボタンを押した際に日時を表示
  // span要素を格納
  let timeElm = document.createElement("span");
  // 現在時刻を取得
  let posttime = new Date();
  console.log(posttime);
  let postHours = posttime.getHours() + 1;
  let postMinutes = posttime.getMinutes();
  let postSeconds = posttime.getSeconds();
  // 現在時刻をHTMLに挿入(入力値と一緒にまとめて.scrollの子要素に追加)
  timeElm.innerHTML = postHours + ":" + postMinutes + ":" + postSeconds;
  //以上送信ボタンを押した際に日時を表示

  // 入力値を取得する
  var inputText = document.getElementById("inputText").value;
  // 改行を<br>に変換するindention()を呼ぶ
  inputText = indention(inputText);
  // inputタグに入力したテキストを削除する（送信ボタンを押すと消えるようにする）
  document.getElementById("inputText").value = "";

  // 取得した入力値を表示させるdiv要素を作成
  var outputText = document.createElement("div");
  // 作成したdiv要素にclassをつける
  outputText.classList.add("scroll--output_myself__text");
  //.scrollが付いている要素のノードリストを取得する
  var scroll = document.querySelectorAll(".scroll");
  scroll.forEach((elm) => {
    // 入力したテキストを作成したoutputText(divタグ)に入れる
    outputText.innerHTML = timeElm.innerHTML + "<span>" + inputText + "</span>";
    // .scrollが付いている要素の子要素の先頭に作成したdivタグを入れる
    elm.append(outputText);
  });
  // テキストを送信した際に一番下（テキストを送信したかわかるように）に移動するようにする
  $(".scroll")[0].lastElementChild.scrollIntoView(false);
});
// 以上入力してボタンを押すとテキストが表示される

// 以下改行\nを<br>に置換、エスケープ処理
function indention(a) {
  // 入力された文字
  a = a.replace(/&/g, "&amp;");
  a = a.replace(/</g, "&lt;");
  a = a.replace(/>/g, "&gt;");
  // 改行を置換する
  var b = a.replace(/\n/g, "<br>");
  return b;
}

