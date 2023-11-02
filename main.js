var scroll = document.querySelectorAll('.scroll');
// いくつもある場合があるためforEachを使用
scroll.forEach(elm => {
	console.log(elm);
	elm.onscroll = function () {
		// console.log(this.scrollTop);  // スクロールされたピクセル数
		// console.log(this.clientHeight);  // CSS height + CSS padding
		// console.log(this.scrollHeight);  //垂直スクロールバーを使用せずにすべてのコンテンツをビューポート内に収めるために要素に必要な最小の高さ。
		if (this.scrollTop + this.clientHeight >= this.scrollHeight) {
		// if (this.scrollBottom + this.clientHeight >= this.scrollHeight) {
			//スクロールが末尾に達した
			// console.log(this.dataset.lastnum); //data-* 属性の項目 初期値2
			if (parseInt(this.dataset.lastnum) < parseInt(this.dataset.max)) {
				//未ロードの画像がある場合
				this.dataset.lastnum = parseInt(this.dataset.lastnum) + 1;
				let img = document.createElement('img');
				img.src = this.dataset.lastnum + '.png';
				//親要素にimg要素を追加
				// this.appendChild(img);
				this.prepend(img);
			}
		}
	};
});


// 以下送信ボタンをクリックするとgetElementById("mybtn")が表示非表示
function btnclick(event) {
	var divelement = document.getElementById("mydiv");
	if (divelement.style.display == "none") {
		divelement.style.display = "";
	} else {
		divelement.style.display = "none";
	}
}
window.addEventListener("load",
function() {
	var btndiv = document.getElementById("mybtn");
	btndiv.addEventListener("click", btnclick, false);
},
false);
// 以上送信ボタンをクリックすると表示非表示

// 以下入力してくださいボタンを押すとテキストが表示される
function buttonclick() {
	var input_text = document.getElementById("input_text").value;
	document.getElementById("input_text").value = "";
	document.getElementById("output_text").innerHTML = input_text;
}
// 以上入力してくださいボタンを押すとテキストが表示される