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
// 以上改行\nを<br>に置換する

//以下テキストエリアの高さを調整する
var textarea = document.querySelector("textarea");
textarea.addEventListener("input", function () {
  this.style.height = "1em"; // 初期高さに戻す
  this.style.height = this.scrollHeight + "px"; // スクロール領域の高さに合わせる
});
//以上テキストエリアの高さを調整する


