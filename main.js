// 以下JSONからデータを取得する。
var sentMessageJSON;
$.ajax({
  url: 'sentMessageHistory.json',
  type: 'GET',
  dataType: "json",
  //リクエストが完了するまで実行。
  beforeSend: function () {
    // ローディング画像を表示
    $('.loading').removeClass('hide');
  }
  //成功。
}).done(function (data) {
  setTimeout(() => {
    sentMessageJSON = data;
    scrollFirstDisplay();
    infiniteScroll();
  }, "1999");
  setTimeout(() => {
    // ローディング画像を非表示
    $('.loading').addClass('hide');
    canPressButton();
  }, "2000");
//失敗。
}).fail(function(){
  console.log('error');
});
// 以上JSONからデータを取得する。

// .scrollを取得
var scroll = document.querySelectorAll('.scroll');

// 以下スクロール画面（.scroll）内にコンテンツ（画像かテキスト）を表示させる
function scrollFirstDisplay() {
  //scrollは配列になっているため、ループ処理で記載する（一回しか行わないが）。
  scroll.forEach(elm => {
    //JSONに記載されているIdを定義
    var sentId;
    //.scrollの子要素の高さの合計を定義
    var childTotalHeight = 0;
    //childTotalHeightがスクロール画面（elm.clientHeight、.scrollの高さ）の高さ以下の場合、子要素を追加する
    for (var i = 0; childTotalHeight <= elm.clientHeight; i++) {
      // .scrollのlastnumを+1する
      elm.dataset.lastnum = parseInt(elm.dataset.lastnum) + 1;
      // JSONのId（sentId）を+1する
      sentId = ('0000' + elm.dataset.lastnum).slice(-4);
      // 以下JSONにテキストが記載されていた場合テキストを入れる
      if (sentMessageJSON[sentId].text != "") {
        let div = document.createElement('div');
        //作成したdiv要素にテキストを入れる
        div.textContent = sentMessageJSON[sentId].text;
        div.classList.add("scroll--output__text");
        elm.prepend(div);
      }
      // 以下JSONに画像が記載されていた場合画像を入れる
      if (sentMessageJSON[sentId].img != "") {
        let img = document.createElement('img');
        img.src = sentMessageJSON[sentId].img;
        elm.prepend(img);
      }
      //子要素の合計の高さを求める
      childTotalHeight += elm.children[0].scrollHeight;
    }
    //.scrollの先頭（.scrollの一番下）に自動でスクロールする
    $('.scroll')[0].lastElementChild.scrollIntoView(false);
  });
}
// 以下スクロール画面（.scroll）内にコンテンツ（画像かテキスト）を表示させる

// 以下無限スクロール（上スクロール）
function infiniteScroll() {
  //scrollは配列になっているため、ループ処理で記載する（一回しか行わないが）。
  scroll.forEach(elm => {
    // スクロールされた際に以下の関数を実行
    elm.onscroll = function () {
      // .scrollIntoView(false)により、最初に元の位置（scrollTopが0）から下にスクロールされているので、上部までスクロールされたことを検知するために200より小さくなったときに処理を行う。
      // console.log(this.scrollTop);
      if (this.scrollTop >= 200) return;
      // 最後まで表示していないか確認。.scrollにJSONデータの最大値data-maxを設定
      if (parseInt(this.dataset.lastnum) == parseInt(this.dataset.max)) return;
      //未ロードのテキスト・画像がある場合
      //以下上部までスクロールした際の処理
      this.dataset.lastnum = parseInt(this.dataset.lastnum) + 1;
      // JSONのId（sentId）を+1する
      var sentId = ('0000' + this.dataset.lastnum).slice(-4);

      //以上ゼロパディング

      // 以下テキストを入れる
      if (sentMessageJSON[sentId].text != "") {
        let div = document.createElement('div');
        //作成したdiv要素にテキストを入れる
        div.textContent = sentMessageJSON[sentId].text;
        div.classList.add("scroll--output__text");
        this.prepend(div);
      }

      // 以下画像を入れる
      if (sentMessageJSON[sentId].img != "") {
        let img = document.createElement('img');
        img.src = sentMessageJSON[sentId].img;
        this.prepend(img);
      }
    };
  });
};
// 以上無限スクロール（上スクロール）

// 以下ボタンを押せるようにする
function canPressButton() {
  const button = document.getElementById("sendbutton");
  button.disabled = null;
}
// 以上ボタンを押せるようにする


// 以下入力してボタンを押すとテキストが表示される
function buttonclick() {
	// 入力値を取得する
  var inputText = document.getElementById("inputText").value;
  // 改行を<br>に変換するindention()を呼ぶ
	inputText = indention(inputText);
	// inputタグに入力したテキストを削除する（送信ボタンを押すと消えるようにする）
	document.getElementById("inputText").value = "";

	// 取得した入力値を表示させるdiv要素を作成
	var outputText = document.createElement('div');
	// 作成したdiv要素にclassをつける
	outputText.classList.add("scroll--output__text");
	//.scrollが付いている要素のノードリストを取得する
	var scroll = document.querySelectorAll('.scroll');
	scroll.forEach(elm => {
		// .scrollが付いている要素の子要素の先頭に作成したdivタグを入れる
		elm.append(outputText);
    // 入力したテキストを作成したoutputText(divタグ)に入れる
		outputText.innerHTML = inputText;
  });
  // テキストを送信した際に一番下（テキストを送信したかわかるように）に移動するようにする
  $('.scroll')[0].lastElementChild.scrollIntoView(false);
}
// 以上入力してボタンを押すとテキストが表示される

// 以下改行\nを<br>に置換、エスケープ処理
function indention(a) {
    // 入力された文字
    a = a.replace(/&/g, "&amp;");
    a = a.replace(/</g, "&lt;");
    a = a.replace(/>/g, "&gt;");
    // 改行を置換する
    b = a.replace(/\n/g,'<br>')
	return b;
};

//以下テキストエリアの高さを調整する
var textarea = document.querySelector("textarea");
textarea.addEventListener("input", function () {
  this.style.height = "1em"; // 初期高さに戻す
  this.style.height = this.scrollHeight + "px"; // スクロール領域の高さに合わせる
});