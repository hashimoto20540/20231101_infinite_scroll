// 以下JSONからデータを取得する。

// 以上JSONからデータを取得する。

// 以下スクロールした際に表示されていなかったものを表示させる。
var scroll = document.querySelectorAll('.scroll');
// ノードリストから各ノードにアクセスする。
scroll.forEach(elm => {
	// console.log(elm);
	elm.onscroll = function () {
		// console.log(this); //scrollの要素
		// console.log(this.scrollTop);  // スクロールされたピクセル数
		// console.log(this.clientHeight);  // CSS height + CSS padding
		// console.log(this.scrollHeight);  //すべてのコンテンツの高さ。
		// console.log(document.querySelectorAll('.scroll').innerHTML);
		if (this.scrollTop + this.clientHeight > this.scrollHeight) {
			//スクロールが末尾に達した
			// console.log(this.dataset.lastnum); //data-* 属性の項目 初期値2
			if (parseInt(this.dataset.lastnum) < parseInt(this.dataset.max)) {
				//未ロードの画像がある場合
				this.dataset.lastnum = parseInt(this.dataset.lastnum) + 1;
				let img = document.createElement('img');
				img.src = 'img/' + this.dataset.lastnum + '.png';
				//親要素にimg要素を追加
				// console.log(this);
				this.appendChild(img);
				// this.prepend(img);
			}
		}
	};
});
// 以上スクロールした際に表示されていなかったものを表示させる。

// 以下改行\nを<br>に置換する
function indention(a) {
    // 入力された文字
    a = a.replace(/&/g, "&amp;");
    a = a.replace(/</g, "&lt;");
    a = a.replace(/>/g, "&gt;");
    // 改行を置換する
    b = a.replace(/\n/g,'<br>')
	return b;
};

// 以下入力してボタンを押すとテキストが表示される
function buttonclick() {
	// 入力値を取得する
	var inputText = document.getElementById("inputText").value;
	inputText = indention(inputText);
	// console.log(inputText);  //inputタグの入力値
	// inputタグに入力したテキストを削除する
	document.getElementById("inputText").value = "";

	// 取得した入力値を表示させるdivタグを作る
	var outputText = document.createElement('div');
	// 作成したdivタグにclassをつける
	outputText.classList.add("scroll--output__text");
	// console.log(outputText); //<div class="scroll--output__text"></div>
	//.scrollが付いている要素のノードリストを取得する
	var scroll = document.querySelectorAll('.scroll');
	scroll.forEach(elm => {
		// .scrollが付いている要素の子要素の末尾に作成したdivタグを入れる
		elm.prepend(outputText);
		// console.log(elm); //scrollの要素
		// console.log(outputText); //.scroll--output__textの要素
		// console.log(inputText); //inputタグの入力値
		outputText.innerHTML = inputText;
	});
}
// 以上入力してボタンを押すとテキストが表示される

//以下テキストエリアの高さを調整する
var textarea = document.querySelector("textarea");
textarea.addEventListener("input", function () {
  this.style.height = "1em"; // 初期高さに戻す
  this.style.height = this.scrollHeight + "px"; // スクロール領域の高さに合わせる
});
//以上テキストエリアの高さを調整する

