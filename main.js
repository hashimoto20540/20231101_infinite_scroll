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
  .then(function (data01, data02) {
  // 自分と相手のメッセージデータのJSONをまとめる
  var data01MassagesArr = data01[0].massages;
  var data02MassagesArr = data02[0].massages;
  let combinedResults = data01MassagesArr.concat(data02MassagesArr); // データを連結
  
  // 時系列順に配列を並べ替える。timestampの値をDateオブジェクトで日付オブジェクトに変換して並べ替える。
  combinedResults.sort(function(a, b) {
  return new Date(a.timestamp) - new Date(b.timestamp);
  });
  // 合体したJSONの配列の数を求める
  var JSONLength = Object.keys(combinedResults).length;
  //JSONの配列番号を求める
  var sentNumArr = JSONLength - 1;
  searchTextFunc(combinedResults);

  setTimeout(() => {
    let AfterDisplaySentNumArr = scrollFirstDisplay(sentNumArr, combinedResults);
    infiniteScroll(AfterDisplaySentNumArr, combinedResults);
    // ローディング画像を非表示
    $(".loading").addClass("hide");
    canPressButton();
    canSearch();
  }, "2000");

  })
.fail(function () {
  setTimeout(() => {
    $(".loading").addClass("hide");
    console.log("error");
  }, "2000");
});

// .scrollを取得して格納
var scroll = document.querySelectorAll(".scroll");

// 以下スクロール画面（.scroll）内にコンテンツ（画像かテキスト）を表示させる
function scrollFirstDisplay(sentNumArr, combinedResults) {
  //scrollはquerySelectorAll(".scroll")で取得しているため配列になっているのでループ処理で記載する（一回しか行わないが）。
  scroll.forEach((elm) => {
    //.scrollの子要素の高さの合計を定義
    var childTotalHeight = 0;
    //childTotalHeightがスクロール画面の高さ（elm.clientHeight＝.scrollの高さ）以下の場合に、.scrollに子要素を追加する
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
function infiniteScroll(sentNumArr, combinedResults) {
  //scrollは配列になっているため、ループ処理で記載する（一回しか行わないが）。
  scroll = document.querySelectorAll(".scroll");
  scroll.forEach((elm) => {
    // 一番上までスクロールした場合、スクロールメソッドを実行させるために1px下にずらす
    if (elm.scrollTop == 0) {
      elm.scrollBy(0,1);//1px下にずれる 
    }
    // スクロール時に以下の処理を実行
    elm.onscroll = function () {
      // scrollFirstDisplay()内の.scrollIntoView(false)により、最初に元の位置（scrollTopが0）から下にスクロールされているので、上部までスクロールされたことを検知するために200より小さくなったときに処理を行う。
      if (this.scrollTop >= 200) return;
      // 最後まで表示していないか確認。sentNumArrは配列なので、indexは0が配列の先頭、なので-1だった場合は全て処理したことになるのでreturnする。初期値はJSONデータのmessagesの個数-1。
      if (sentNumArr == -1) {
        // console.log("一番最後までスクロール済み");
        return;
      }
      // 一番上までスクロールした場合、スクロールメソッドを実行させるために1px下にずらす（これを消すと高速でスクロールした場合に表示されなくなってしまう）
      if (elm.scrollTop == 0) {
        elm.scrollBy(0,1);//1px下にずれる 
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
// 以下検索できなくする
const search_text = document.getElementById("search_text");
function canSearch() {
  search_text.disabled = null;
}
// 以上検索できなくする

// 一回だけ処理を実施
var alreadyExecutedWhitescreen = false;
function searchTextFunc(combinedResults) {
  var searchTextElm = document.getElementById("search_text");
  // 検索したときにスクロール上に表示する
  let whitescreen = document.createElement("div");

  searchTextElm.addEventListener("input", function () {
    alreadyExecutedWhitescreen = inputChange(combinedResults, this.value, alreadyExecutedWhitescreen, whitescreen);
  });
}
//以下入力値が変わったとき
function inputChange(combinedResults, searchText, alreadyExecutedWhitescreen, whitescreen) {
  //検索を初回入力した時
  if (!alreadyExecutedWhitescreen) {
    // scroll[0].remove();
    scroll[0].style.display = "none";
    document.querySelector(".wrap_scroll").appendChild(whitescreen);
    whitescreen.classList.add("scroll--search__whitescreen");
    alreadyExecutedWhitescreen = true;
  }
  // inputテキストが変更されたらwhitescreenの子要素を全て削除する。
  while( whitescreen.firstChild ){
    whitescreen.firstChild.remove();
  }
  // 全てのJSONのデータの中にinputテキストが入っているか確認
  for (var i = combinedResults.length - 1; i >= 0; i--) {
    // JSONデータまたは検索テキストが空だったら処理をスキップ
    if (combinedResults[i].text == "") continue;
    if (searchText == "") {
      scroll[0].style.display = "block";
      alreadyExecutedWhitescreen = false;
      whitescreen.remove();
      break;
    }

    // JSONのデータの中にinputテキストが含まれていた場合の処理
    if (combinedResults[i].text.includes(searchText)) {
      // console.log("文章に「" + searchText + "」が含まれています。");
      //div要素を作ってテキストを入れる。
      let searchMessage = document.createElement("div");
      searchMessage.classList.add("search_whitescreen--searchMessage__div");
      searchMessage.textContent = combinedResults[i].text;

      // 以下表示されたテキストをクリックしたときにそこの会話を表示させる（なんでこの関数をfor文の中のif文に記載しないと動かないのか）
      var clickNum = null;
      alreadyExecutedWhitescreen = searchMessage.addEventListener('click', function() {
        whitescreen.remove();
        alreadyExecutedWhitescreen = false;
        //クリックしたテキストが、JSONの配列の何番目かを取得する
        for (var i = combinedResults.length - 1; i > 0; i--) {
          if (combinedResults[i].text == searchMessage.textContent) {
            clickNum = i;
          }
        }
        // console.log(clickNum);
        //元々あるスクロール画面を削除する
        scroll[0].remove();
        // 
        scrollFromStart(combinedResults, clickNum, searchMessage);
        return alreadyExecutedWhitescreen;
      });
      // 以上表示されたテキストをクリックしたときにそこの会話を表示させる
      //whitescreenの子要素に追加する。
      whitescreen.appendChild(searchMessage);
    } else {
      continue;
      // console.log("文章に「" + searchText + "」は含まれていません。");
    }
  }
  return alreadyExecutedWhitescreen;
}

// 以下検索して表示されたテキストをクリックしたときにクリックした画面まで（チャット画面を作成して）移動
function scrollFromStart(combinedResults, clickNum, searchMessage) {
  // scrollクラスの要素を作成し、querySelectorAllで取得する
  let scrollelm = document.createElement("div");
  scrollelm.classList.add("scroll");
  document.querySelector(".wrap_scroll").appendChild(scrollelm);
  var scroll = document.querySelectorAll('.scroll');
  // console.log(scroll);
  scroll.forEach((elm) => {
    var childTotalHeight = 0;
    //以下子要素の高さがscrollの高さより高い場合
    //for文でクリックした番号まで、チャットを表示する。
    for (var i = combinedResults.length - 1; i >= clickNum; i--) {
      // 以下日時を表示
      // span要素を格納
      let timeElm = document.createElement("span");
      postTime(timeElm, combinedResults[i].timestamp);
      // 以上日時を表示

      // 以下JSONにテキストが記載されていた場合テキストを入れる
      if (combinedResults[i].text != "") {
        // 日付とテキストを入れるためにラップした要素を作成
        let wrapDivSentText = document.createElement("div");
        // テキストを入れる
        let divSentText = document.createElement("span");
        //作成したdiv要素にJSONから取得したテキストを入れる
        divSentText.textContent = combinedResults[i].text;
        // メッセージの送り手がどちらか判断する
        // 送り手のメッセージが自分と同じか？
        if (combinedResults[i].senderId == myId) {
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
      if (combinedResults[i].img != "") {
        let wrapImgSent = document.createElement("div");
        let imgSent = document.createElement("img");
        imgSent.classList.add("scroll--output__img");
        imgSent.src = combinedResults[i].img;
        if (combinedResults[i].senderId == myId) {
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
      childTotalHeight += elm.children[0].scrollHeight;
    }
    //以上子要素の高さがscrollの高さより高い場合
    // console.log(childTotalHeight);
    // 以下検索して表示された子要素のテキストをクリックした時に、表示された子要素の全ての高さがscrollクラスの高さ以下の場合、クリックされた箇所以降のスクロール画面内のテキストまたは画像を表示させる
    if (childTotalHeight <= elm.clientHeight) {
      while( elm.firstChild ){
        elm.firstChild.remove();
      }
      console.log("scrollFromStart()の下の部分が実行された");
      var combinedResultsArrIndex = combinedResults.length - 1;
      //childTotalHeightがスクロール画面の高さ（elm.clientHeight＝.scrollの高さ）以下の場合に、.scrollに子要素を追加する
      for (var i = 0; childTotalHeight <= elm.clientHeight; i++) {
        // 以下日時を表示
        // span要素を格納
        let timeElm = document.createElement("span");
        postTime(timeElm, combinedResults[combinedResultsArrIndex].timestamp);
        //以上日時を表示
        
        // 以下JSONにテキストが記載されていた場合テキストを入れる
        if (combinedResults[combinedResultsArrIndex].text != "") {
          // 日付とテキストを入れるためにラップした要素を作成
          let wrapDivSentText = document.createElement("div");
          // テキストを入れる
          let divSentText = document.createElement("span");
          //作成したdiv要素にJSONから取得したテキストを入れる
          divSentText.textContent = combinedResults[combinedResultsArrIndex].text;
          // メッセージの送り手がどちらか判断する
          // 送り手のメッセージが自分と同じか？
          if (combinedResults[combinedResultsArrIndex].senderId == myId) {
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
        if (combinedResults[combinedResultsArrIndex].img != "") {
          let wrapImgSent = document.createElement("div");
          let imgSent = document.createElement("img");
          imgSent.classList.add("scroll--output__img");
          imgSent.src = combinedResults[combinedResultsArrIndex].img;
          if (combinedResults[combinedResultsArrIndex].senderId == myId) {
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
        // combinedResultsArrIndex-1する
        combinedResultsArrIndex = combinedResultsArrIndex - 1;
      }
      clickNum = combinedResultsArrIndex - 1;
      let clickchild = 0;
      for (i = elm.childElementCount - 1; i > 0; i--) {
        if (elm.children[i].textContent.includes(searchMessage.textContent)) {
          clickchild = i;
          console.log(clickchild);
        }
      }
      // 検索して表示されたテキストの中でクリックしたテキストが表示されるようにする。
      elm.children[clickchild].scrollIntoView(false);
    }
    // 以上以下検索して表示された子要素のテキストをクリックした時に、表示された子要素の全ての高さがscrollクラスの高さ以下の場合
  })
  //clickNumの番号の子要素はクリックした際に表示しているため、そのままにする。
  clickNum -= 1;
  // 以下無限スクロールを実行する
  infiniteScroll(clickNum, combinedResults);
};
// 以上検索をクリックしたときにクリックした画面まで移動
//以上検索




// 以下画像を表示させる
// 引数に「選択されたファイルのFileListオブジェクト」、「画像の表示エリアになる要素」、「img要素に付与するクラス名」を受け取るように作成。
function ag2fileToImg(t, a, c) {
  // console.log(a);
  // FileListオブジェクトからFileオブジェクトのリストを取得。
  // console.log(t.files); //FileList {0: File, length: 1}　２個だとFileList {0: File, 1: File, length: 2}
  //  console.log(t.files.length);//1　　２つ選択すると２
  let ag2files = t.files,
      ag2fileNum = t.files.length;
  let ag2reader,ag2img;
  // Fileの数だけ処理を実行。
  for(let i = 0; i < ag2fileNum; i++){
    let thisFile = ag2files[i];
    // console.log(ag2files[i]);
    // console.log(thisFile); //File {name: '顔写真.JPG', lastModified: 1698837915714, lastModifiedDate: Wed Nov 01 2023 20:25:15 GMT+0900 (日本標準時), webkitRelativePath: '', size: 1394571, …}
    let thisFileName = thisFile.name,//ファイル名
        thisFileModi = thisFile.lastModified,//UNIXタイムスタンプをミリ秒 (IE非対応)
        thisFileSize = thisFile.size,//ファイルサイズ（バイト数（１バイト＝半角英数字一文字分の情報量））
        thisFileType = thisFile.type;//MIMEタイプ

    //取得したファイルのMIMEタイプをチェック
    // ファイルのMIMEタイプがimage/で始まるか
    // console.log(thisFileType.startsWith('image/'));
    if(!thisFileType.startsWith('image/')){
      console.log('"'+thisFileName+'" is not a image.');
      return;
    }

    //FileオブジェクトをデータURLに変換
    //  FileReader()は FileReaderオブジェクト
    ag2reader = new FileReader();
    ag2reader.readAsDataURL(thisFile);

    ag2reader.addEventListener('load', function(){
      //imgタグをDOMに挿入
      ag2img = document.createElement('img');
      console.log(ag2img);  //imgタグ、その中にsrc属性ありめっちゃ長いソースが記載されてある。ag2img.src = ag2reader.result;をコメントアウトすると<img class="ag2readerImg">が表示される。
      // console.log(ag2reader.result);  //めちゃくちゃ長い文字列が表示される
      // console.log(ag2img.src);// thisFileと同じ？
      ag2img.src = ag2reader.result;
      // console.log(ag2img.src);
      ag2img.classList.add(c);
      
      // 以下画像を送信するときに日時などをつける
      //以下送信ボタンを押した際に日時を表示
      // span要素を格納
      let timeElm = document.createElement("span");
      postTime(timeElm, new Date());
      //以上送信ボタンを押した際に日時を表示
      
      let wrapOutputImg = document.createElement("div");

      wrapOutputImg.classList.add("scroll--output_myself__wrap_img");
      wrapOutputImg.appendChild(timeElm);
      wrapOutputImg.appendChild(ag2img);
      // console.log(wrapOutputImg);
      // 以上画像を送信するときに日時などをつける

      a.appendChild(wrapOutputImg)
      $(".scroll")[0].lastElementChild.scrollIntoView(false);
    });
    ag2reader.addEventListener('error', function(){
      console.log('reader.error :');
      console.log(ag2reader.error);
    });
  }
  // ファイルの入力値をnullにする
  ag2input.value = null;
}


// console.log(ag2input);
      // console.log(ag2imgArea);
ag2input.addEventListener('change', function () {
  console.log("ag2inputが変更された");
  let ag2input = document.getElementById('ag2input'),//input要素
      ag2imgArea = document.querySelector(".scroll"),//画像の表示エリア
      ag2readerImgClass = 'scroll--output__img';//img要素に付与するクラス名
  // console.log(this);  //	<input id="ag2input" type="file" accept="image/*" multiple="">
  // console.log(ag2input);  //2こ　<input id="ag2input" type="file" accept="image/*" multiple="">
  // console.log(this);// 2こ　<input id="ag2input" type="file" accept="image/*" multiple="">
  ag2fileToImg(this, ag2imgArea, ag2readerImgClass);
});

// 以下削除ボタンを設置する
// const imgDelete = document.getElementById('imgDelete');
//   // 削除ボタンがクリックされた時の処理
//   imgDelete.addEventListener('click', function (event) {
//     if (event.target.tagName === 'LI') {
//       event.target.remove();
//     }
//   });

// 以上削除ボタンを設置する




// 以上画像を表示させる