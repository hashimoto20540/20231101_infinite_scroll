// 以下JSONからデータを取得する。
import sentMessage from "./sentMessageHistory.json" assert { type:"json"};
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
		if (this.scrollTop + this.clientHeight >= this.scrollHeight) {
			//スクロールが末尾に達した
			console.log(this.dataset.lastnum); //data-* 属性の項目 初期値2
			if (parseInt(this.dataset.lastnum) < parseInt(this.dataset.max)) {
				//未ロードの画像がある場合
				this.dataset.lastnum = parseInt(this.dataset.lastnum) + 1;
				// console.log(sentMessage["0001"].img);
				// console.log(this.dataset.lastnum);

				//以下ゼロパディング
				var sentId = ( '0000' + this.dataset.lastnum ).slice( -4 );
				// console.log(sentId);
				//以上ゼロパディング

				// 以下テキストを入れる
				if (sentMessage[sentId].text != "") {
					let div = document.createElement('div');
					// div.textContent = sentMessage["0001"].text;  //作成したdiv要素にテキストを入れる
					div.textContent = sentMessage[sentId].text;
					div.classList.add("scroll--output__text");
					this.appendChild(div);
				}
				// 以上テキストを入れる

				// 以下画像を入れる
				if (sentMessage[sentId].img != "") {
					let img = document.createElement('img');
					img.src = 'img/' + this.dataset.lastnum + '.png';
					//親要素にimg要素を追加
					// console.log(this);
					this.appendChild(img);
					// this.prepend(img);
				}
				// 以上画像を入れる
			}
		}
	};
});
// 以上スクロールした際に表示されていなかったものを表示させる。

// 以下ロード時にスクロール画面内にコンテンツ（画像かテキスト）を表示させる

    window.onload = onLoad;

    function onLoad() {
        var target = document.getElementById("aaa");
        target.innerHTML = "JavaScriptが実行されました。";
		// console.log(sentMessage);
		// var scroll = document.querySelectorAll('.scroll');
		scroll.forEach(elm => {
			//以下ゼロパディング
			// console.log(elm.dataset);
			var sentId = ( '0000' + elm.dataset.lastnum ).slice( -4 );
			// console.log(sentId);
			//以上ゼロパディング


			// console.log("1");
			// console.log(elm.children[0]);// undefined
			// console.log(elm.children[0].scrollHeight);// main.js:73 Uncaught TypeError: Cannot read properties of undefined (reading 'scrollHeight')
			// console.log(elm.clientHeight); //360
			// console.log(elm.scrollHeight); //360
			

			var childHeight = 0;
			// if (elm.children[0].scrollHeight == undefined) {
			// 	childHeight = 0;
			// }
			// console.log(childHeight);

			for (var i = 0; childHeight <= elm.clientHeight; i++) {
				elm.dataset.lastnum = parseInt(elm.dataset.lastnum) + 1;
				// console.log(elm.dataset.lastnum);
				sentId = ('0000' + elm.dataset.lastnum).slice(-4);
				// console.log(sentMessage[sentId].img);

				// 以下テキストを入れる
				console.log(sentMessage[sentId].text);
				if (sentMessage[sentId].text != "") {
					let div = document.createElement('div');
					// div.textContent = sentMessage["0001"].text;  //作成したdiv要素にテキストを入れる
					div.textContent = sentMessage[sentId].text;
					div.classList.add("scroll--output__text");
					elm.appendChild(div);
				}
				// 以上テキストを入れる

				// 以下画像を入れる
				if (sentMessage[sentId].img != "") {
					let img = document.createElement('img');
					// console.log("img");
					img.src = sentMessage[sentId].img;
					//親要素にimg要素を追加
					elm.appendChild(img);
					// elm.prepend(img);
				}
				// 以上画像を入れる

				var arrNum = parseInt(elm.dataset.lastnum) - 1;
				// console.log(arrNum);
				childHeight += elm.children[arrNum].scrollHeight;
				console.log(childHeight);
			}



			// console.log(childHeight);
			// console.log(elm.scrollHeight);
			
			// console.log(elm.dataset.lastnum);
			// if (childHeight <= elm.scrollHeight) {
			// 	elm.dataset.lastnum = parseInt(elm.dataset.lastnum) + 1;
			// 	console.log(elm.dataset.lastnum);
			// 	sentId = ('0000' + elm.dataset.lastnum).slice(-4);
			// 	// console.log(sentMessage[sentId].img);
			// 	if (sentMessage[sentId].img != "") {
			// 		let img = document.createElement('img');
			// 		// console.log("img");
			// 		img.src = sentMessage[sentId].img;
			// 		//親要素にimg要素を追加
			// 		elm.appendChild(img);
			// 		// elm.prepend(img);
			// 	}
			// 	var arrNum = parseInt(elm.dataset.lastnum) - 1;
			// 	console.log(arrNum);
			// 	childHeight += elm.children[arrNum].scrollHeight;

			// 	// console.log(sentId);
			// }

			// console.log(childHeight);
			// childHeight = elm.children[1].scrollHeight;
			// console.log(childHeight);


			// console.log("2");
			// console.log(elm.children[0]);// <img src="img/2.png">x
			// console.log(elm.children[0].scrollHeight);// undefined
			// console.log(elm.clientHeight);
			// console.log(elm.scrollHeight);

			// if (childHeight <= elm.scrollHeight) {
			// 	elm.dataset.lastnum = parseInt(elm.dataset.lastnum) + 1;
			// 	sentId = ('0000' + elm.dataset.lastnum).slice(-4);
			// 	// console.log(sentId);
			// 	// console.log(sentMessage[sentId].img);
			// 	// console.log(sentId);
			// 	if (sentMessage[sentId].img != "") {
			// 		let img = document.createElement('img');
			// 		// console.log("img");
			// 		img.src = sentMessage[sentId].img;
			// 		//親要素にimg要素を追加
			// 		elm.appendChild(img);
			// 		// elm.prepend(img);
			// 	}
			// 	var arrNum = parseInt(elm.dataset.lastnum) - 1;
			// 	childHeight += elm.children[arrNum].scrollHeight;

			// }
			
		});
    }

// 以上ロード時にスクロール画面内にコンテンツ（画像かテキスト）を表示させる
