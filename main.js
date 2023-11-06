// 以下JSONからデータを取得する。
import sentMessage from "./sentMessageHistory.json" assert { type:"json"};
// 以上JSONからデータを取得する。

// .scrollを取得
var scroll = document.querySelectorAll('.scroll');

// 以下ロード時にスクロール画面（.scroll）内にコンテンツ（画像かテキスト）を表示させる
    window.onload = onLoad;
    function onLoad() {
		scroll.forEach(elm => {
			//以下JSONに記載されているIdをゼロパディング
			// console.log(elm.dataset);　//.scrollに記載されているdataset
			var sentId = ( '0000' + elm.dataset.lastnum ).slice( -4 );
			//以上JSONに記載されているIdをゼロパディング
			
			//.scrollの子要素の高さの合計を定義
			var childTotalHeight = 0;
			//childTotalHeightがスクロール画面（elm.clientHeight、.scrollの高さ）の高さ以下の場合、子要素を追加する
			for (var i = 0; childTotalHeight <= elm.clientHeight; i++) {
				// データセットを+1する
				elm.dataset.lastnum = parseInt(elm.dataset.lastnum) + 1;
				// console.log(elm.dataset.lastnum);
				// sentIdを+1する
				sentId = ('0000' + elm.dataset.lastnum).slice(-4);
				// console.log(sentMessage[sentId].img);

				// 以下JSONにテキストが記載されていた場合テキストを入れる
				if (sentMessage[sentId].text != "") {
					let div = document.createElement('div');
					// div.textContent = sentMessage["0001"].text;  //作成したdiv要素にテキストを入れる
					div.textContent = sentMessage[sentId].text;
					div.classList.add("scroll--output__text");
					elm.appendChild(div);
				}
				
				// 以下JSONに画像が記載されていた場合画像を入れる
				if (sentMessage[sentId].img != "") {
					let img = document.createElement('img');
					// console.log("img");
					img.src = sentMessage[sentId].img;
					//親要素にimg要素を追加
					elm.appendChild(img);
				}

				// .scrollの子要素のindexを求める
				var arrIndex = parseInt(elm.dataset.lastnum) - 1;
				//子要素の合計の高さを求める
				childTotalHeight += elm.children[arrIndex].scrollHeight;
				// console.log(childTotalHeight);
			}
		});
    }
// 以上ロード時にスクロール画面内にコンテンツ（画像かテキスト）を表示させる

// 以下スクロールした際に表示されていなかったものを表示させる。
// ノードリストから各ノードにアクセスする。
scroll.forEach(elm => {
	elm.onscroll = function () {
		// console.log(this); //scrollの要素
		// console.log(this.scrollTop);  // スクロールされたピクセル数
		// console.log(this.clientHeight);  // .scrollの　height + padding
		// console.log(this.scrollHeight);  //すべてのコンテンツの高さ（スクロールされて隠れている箇所も含む）。
		// スクロールしたピクセル数＋.scrollの高さが表示されているコンテンツ以上の場合＝表示されているコンテンツの最下部が見えている場合
		if (this.scrollTop + this.clientHeight >= this.scrollHeight) {
			//スクロールが末尾に達した
			// console.log(this.dataset.lastnum); //data-* 属性の項目＝初期値はスクロールされる前に表示されている画像orテキストの数
			if (parseInt(this.dataset.lastnum) < parseInt(this.dataset.max)) {
				//未ロードの画像がある場合
				this.dataset.lastnum = parseInt(this.dataset.lastnum) + 1;

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

				// 以下画像を入れる
				if (sentMessage[sentId].img != "") {
					let img = document.createElement('img');
					img.src = 'img/' + this.dataset.lastnum + '.png';
					//親要素にimg要素を追加
					// console.log(this);
					this.appendChild(img);
					// this.prepend(img);
				}
			}
		}
	};
});
// 以上スクロールした際に表示されていなかったものを表示させる。


