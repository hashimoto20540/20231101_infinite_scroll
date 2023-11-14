//自分のIdを定義
const myId = "0001";
  
$.when(
  $.getJSON("mySelfMessageHistory.json"),
  $.getJSON("partnerMessageHistory.json"),
  $.ajax(
    {
      beforeSend: function () {
      // ローディング画像を表示
      $(".loading").removeClass("hide");
  }
    }
  )
)
.then(function(data01, data02) {
  // JSONの取得が完了したら下記を実行
  var data01MassagesArr = data01[0].massages;
  var data02MassagesArr = data02[0].massages;
  // 自分のメッセージデータと相手のメッセージデータをまとめる
  let combinedResults = data01MassagesArr.concat(data02MassagesArr); // データを連結
  
  // 時系列順に配列を並べ替える。timestampの値をDateオブジェクトで日付オブジェクトに変換して並べ替える。
  combinedResults.sort(function(a, b) {
  return new Date(a.timestamp) - new Date(b.timestamp);
  });
  // 合体したJSONの配列の数を求める
  var JSONLength = Object.keys(combinedResults).length;
  //配列の番号を求める
  var sentNumArr = JSONLength - 1;
  searchTextFunc(combinedResults);
  setTimeout(() => {
    let AfterDisplaySentNumArr = scrollFirstDisplay(JSONLength, sentNumArr, combinedResults);
    infiniteScroll(JSONLength, AfterDisplaySentNumArr, combinedResults);
    // ローディング画像を非表示
    $(".loading").addClass("hide");
    canPressButton();
  }, "2000");

})
.fail(function() {
  console.log("error");
});

// .scrollを取得して格納
var scroll = document.querySelectorAll(".scroll");

// 以下スクロール画面（.scroll）内にコンテンツ（画像かテキスト）を表示させる
function scrollFirstDisplay(JSONLength, sentNumArr, combinedResults) {
  //scrollは配列になっているため、ループ処理で記載する（一回しか行わないが）。
  scroll.forEach((elm) => {
    //.scrollの子要素の高さの合計を定義
    var childTotalHeight = 0;
    //childTotalHeightがスクロール画面の高さ（elm.clientHeight、.scrollの高さ）以下の場合、子要素を追加する
    for (var i = 0; childTotalHeight <= elm.clientHeight; i++) {
      // 以下日時を表示
      // span要素を格納
      let timeElm = document.createElement("span");
      postTime(timeElm, combinedResults[sentNumArr].timestamp);
      //以上日時を表示
      
      // 以下JSONにテキストが記載されていた場合テキストを入れる
      if (combinedResults[sentNumArr].text != "") {
        // 日付とテキストを入れるためにラップした要素を作成
        let wrapDivSentText = document.createElement("div");
        // テキストを入れる
        let divSentText = document.createElement("span");
        //作成したdiv要素にJSONから取得したテキストを入れる
        divSentText.textContent = combinedResults[sentNumArr].text;
        // メッセージの送り手がどちらか判断する
        // 送り手のメッセージが自分と同じか？
        if (combinedResults[sentNumArr].senderId == myId) {
          // 自分用のCSSを付与
          wrapDivSentText.classList.add("scroll--output_myself__text");
          //ラップした要素の内側にテキストを入れた要素と日時を入れた要素を入れる
          wrapDivSentText.appendChild(timeElm);
          wrapDivSentText.appendChild(divSentText);
        } else {
          // 相手用のCSSを付与
          wrapDivSentText.classList.add("scroll--output_partner__text");
          wrapDivSentText.appendChild(divSentText);
          wrapDivSentText.appendChild(timeElm);
        }
        elm.prepend(wrapDivSentText);
      }
      // 以下JSONに画像が記載されていた場合画像を入れる
      if (combinedResults[sentNumArr].img != "") {
        let wrapImgSent = document.createElement("div");
        let imgSent = document.createElement("img");
        imgSent.classList.add("scroll--output__img");
        imgSent.src = combinedResults[sentNumArr].img;
        if (combinedResults[sentNumArr].senderId == myId) {
          wrapImgSent.classList.add("scroll--output_myself__wrap_img");
          wrapImgSent.appendChild(timeElm);
          wrapImgSent.appendChild(imgSent);        
        } else {
          wrapImgSent.classList.add("scroll--output_partner__wrap_img");
          wrapImgSent.appendChild(imgSent);
          wrapImgSent.appendChild(timeElm);
        }
        
        elm.prepend(wrapImgSent);
      }
      //子要素の合計の高さを新しく求める（子要素が追加されたため高さが変化する）
      childTotalHeight += elm.children[0].scrollHeight;
      // sentIdを-1する
      sentNumArr = sentNumArr - 1;
    }
    //.scrollの先頭（.scrollの一番下）に自動でスクロールする
    $(".scroll")[0].lastElementChild.scrollIntoView(false);
  });
  return sentNumArr;
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
      // 最後まで表示していないか確認。sentNumArrは配列なので、indexは0が配列の先頭、なので-1だった場合は全て処理したことになるのでreturnする。初期値はJSONデータのmessagesの個数-1。
      if (sentNumArr == -1) {
        // console.log("0になりました");
        return;
      }
      //以下上部までスクロールした際の処理
      //以下日時を表示
      let timeElm = document.createElement("span");
      postTime(timeElm, combinedResults[sentNumArr].timestamp);
      //以上日時を表示

      //未ロードのテキスト・画像がある場合
      // 以下テキストを入れる
      if (combinedResults[sentNumArr].text != "") {
        let wrapDivSentText = document.createElement("div");
        let divSentText = document.createElement("span");
        //作成したdiv要素にテキストを入れる
        divSentText.textContent = combinedResults[sentNumArr].text;
        // メッセージの送り手がどちらか判断する
        if (combinedResults[sentNumArr].senderId == myId) {
          wrapDivSentText.classList.add("scroll--output_myself__text");
          wrapDivSentText.appendChild(timeElm);
          wrapDivSentText.appendChild(divSentText);
        } else {
          wrapDivSentText.classList.add("scroll--output_partner__text");
          wrapDivSentText.appendChild(divSentText);
          wrapDivSentText.appendChild(timeElm);
        }
        this.prepend(wrapDivSentText);
      }

      // 以下画像を入れる
      if (combinedResults[sentNumArr].img != "") {
        let wrapImgSent = document.createElement("div");
        let imgSent = document.createElement("img");
        imgSent.classList.add("scroll--output__img");
        imgSent.src = combinedResults[sentNumArr].img;
        if (combinedResults[sentNumArr].senderId == myId) {
          wrapImgSent.classList.add("scroll--output_myself__wrap_img");
          wrapImgSent.appendChild(timeElm);
          wrapImgSent.appendChild(imgSent);          
        } else {
          wrapImgSent.classList.add("scroll--output_partner__wrap_img");
          wrapImgSent.appendChild(imgSent);
          wrapImgSent.appendChild(timeElm);
        }
        this.prepend(wrapImgSent);
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

// 以下入力してボタンを押すとテキストと日時を表示される
sendbutton.addEventListener("click", function () {
  //以下送信ボタンを押した際に日時を表示
  // span要素を格納
  let timeElm = document.createElement("span");
  postTime(timeElm, new Date());
  //以上送信ボタンを押した際に日時を表示

  // 入力値を取得する
  var inputText = document.getElementById("inputText").value;
  // 改行を<br>に変換するindention()を呼ぶ
  inputText = indention(inputText);
  // inputタグに入力したテキストを削除する（送信ボタンを押すと消えるようにする）
  document.getElementById("inputText").value = "";

  const textareaEls = document.querySelectorAll(".textarea--input__text");

  textareaEls.forEach((textareaEl) => {
    // デフォルト値としてスタイル属性を付与、テキストエリアの高さに応じてスタイルの高さを変更
    textareaEl.style.height = "1em";
  });
  
  // 取得した入力値を表示させるdiv要素を作成
  let wrapOutputText = document.createElement("div");
  var outputText = document.createElement("span");
  // 作成したdiv要素にclassをつける
  wrapOutputText.classList.add("scroll--output_myself__text");
  //.scrollが付いている要素のノードリストを取得する
  scroll.forEach((elm) => {
    // 入力したテキストを、outputText(divタグ)に入れる
    outputText.innerHTML = inputText;
    wrapOutputText.appendChild(timeElm);
    wrapOutputText.appendChild(outputText);
    // .scrollが付いている要素の子要素の先頭に作成したdivタグを入れる
    elm.append(wrapOutputText);
  });
  // テキストを送信した際に一番下（テキストを送信したかわかるように）に移動するようにする
  $(".scroll")[0].lastElementChild.scrollIntoView(false);
});
// 以上入力してボタンを押すとテキストと日時が表示される

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

  // 以下日時を表示
function postTime(timeElm, timestamp) {
  // 送信時刻にクラスを付け加える
  timeElm.classList.add("scroll--output__time");
  // 現在時刻を取得
  let posttime = new Date(timestamp);
  let postYear = posttime.getFullYear();
  let postMonth = ('00' + (posttime.getMonth() + 1)).slice(-2);
  let postDate = ('00' + posttime.getDate()).slice(-2);
  let postHours = ('00' + posttime.getHours()).slice(-2);
  let postMinutes = ('00' + posttime.getMinutes()).slice(-2);
  let postSeconds = ('00' + posttime.getSeconds()).slice(-2);
  // 現在時刻をHTMLに挿入(入力値と一緒にまとめて.scrollの子要素に追加)
  timeElm.innerHTML = postYear + "/" + postMonth + "/" + postDate + " " + postHours + ":" + postMinutes + ":" + postSeconds;
  return timeElm;
}
//以上日時を表示
  
// 以下テキストエリアの高さを調整する
window.addEventListener("DOMContentLoaded", () => {
  // textareaタグを全て取得
  const textareaEls = document.querySelectorAll("textarea");

  textareaEls.forEach((textareaEl) => {
    // inputイベントが発生するたびに関数呼び出し
    textareaEl.addEventListener("input", setTextareaHeight);
  });

  // textareaの高さを計算して指定する関数
  function setTextareaHeight() {
    //ここでのthisは".textarea--input__text"がついている要素
    this.style.height = "1em";
    this.style.height = `${this.scrollHeight}px`;
  }
});
// 以上テキストエリアの高さを調整する

//以下検索
function searchTextFunc(combinedResults) {
  var searchTextElm = document.getElementById("search_text");
  var alreadyExecutedWhitescreen = false;
  searchTextElm.addEventListener("input", function () {
    alreadyExecutedWhitescreen = inputChange(combinedResults, this.value, alreadyExecutedWhitescreen);
  });
}

function inputChange(combinedResults, searchText, alreadyExecutedWhitescreen) {
  // console.log(alreadyExecutedWhitescreen);
  let whitescreen = document.createElement("div");
  if (!alreadyExecutedWhitescreen) {
    scroll[0].remove();
    whitescreen.classList.add("scroll--search__whitescreen");
    document.querySelector(".wrap_scroll").appendChild(whitescreen);
    alreadyExecutedWhitescreen = true;
  }

  for (var i = combinedResults.length - 1; i > 0; i--) {
    if (combinedResults[i].text == "") continue;
    if (searchText == "") continue;
    // console.log(searchText);
    if (combinedResults[i].text.includes(searchText)) {
      console.log("文章に「" + searchText + "」が含まれています。");
      let searchMessage = document.createElement("div");
      searchMessage.textContent = combinedResults[i].text;
      console.log(!searchMessage);
      whitescreen.appendChild(searchMessage);
    } else {
      // if (!searchMessage) continue;
      //   searchMessage.remove();
        console.log("文章に「" + searchText + "」は含まれていません。");
    }
  }
  return alreadyExecutedWhitescreen;

}
//以上検索


// document.addEventListener('DOMContentLoaded', function() {
//     // ここに実行したいコードを書きます
//     // console.log('ページがロードされました！');

//   let combinedResults2 = [{ "text": "テスト1" }, { "text": "テスト2" }, { "text": "テスト3" }, { "text": "テスト4" }, { "text": "テスト5" }, { "text": "テスト6" }, { "text": "テスト7" }, { "text": "テスト8" }, { "text": "テスト9" }, { "text": "テスト10" }, { "text": "テスト11" }, { "text": "テスト12" }, { "text": "テスト13" }, { "text": "テスト14" }, { "text": "テスト15" }, { "text": "テスト16" }, { "text": "テスト17" }, { "text": "テスト18" }, { "text": "テスト19" }, { "text": "テスト20" }];
//   // console.log(combinedResults2.length);
//   searchTextFunc2(combinedResults2);
//   function searchTextFunc2(combinedResults2) {
//     var searchTextElm = document.getElementById("test_textarea");
//     var alreadyExecutedWhitescreen = false;
//     // console.log(11111);
//     searchTextElm.addEventListener("input", function () {
//       alreadyExecutedWhitescreen = inputChange2(combinedResults2, this.value, alreadyExecutedWhitescreen);
//     });
//   }

//   function inputChange2(combinedResults2, searchText, alreadyExecutedWhitescreen) {
//     // console.log(alreadyExecutedWhitescreen);
//     let whitescreen = document.createElement("div");

//     if (!alreadyExecutedWhitescreen) {
//       scroll[0].remove();
//       whitescreen.classList.add("scroll--search__whitescreen");
//       document.querySelector(".test").appendChild(whitescreen);
//       alreadyExecutedWhitescreen = true;
//     }

//     for (var i = combinedResults2.length - 1; i > 0; i--) {
//       if (combinedResults2[i].text == "") continue;
//       if (searchText == "") continue;
//       // console.log(combinedResults2[i].text);
//       if (combinedResults2[i].text.includes(searchText)) {
//         console.log("文章に「" + searchText + "」が含まれています。");
//         let searchMessage = document.createElement("div");
//         searchMessage.textContent = combinedResults2[i].text;
//         console.log(searchMessage);
//         whitescreen.appendChild(searchMessage);
//       } else {
//         // continue;
//           console.log("文章に「" + searchText + "」は含まれていません。");
//       }
//     }
//     return alreadyExecutedWhitescreen;

//   }

// });