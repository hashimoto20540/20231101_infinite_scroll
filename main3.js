function postEl(text) {
  return `<div>${text}</div>`;
}
// console.log(11);

// function btnClick() {
//   let postsElm = document.getElementsByClassName('posts');
//   // let postsElm = document.getElementById('posts');
//   //indexをつけたらいけた
//   postsElm[0].textContent = "こんにちは";
//   console.log(postsElm);
//   // 指定した要素を取得
// let obj = document.getElementById("sample");

// // console.log(obj.textContent) // 要素

// // 変更
// obj.textContent = "変更";
// }

//初期投稿の設定
function setupInitialPosts() {  
  // console.log(Array(100));  //[empty × 100]
  // console.log(...Array(100)); //[undefined, * 100]
  // console.log(...Array(100).keys()); // 0から99
  // console.log(Array(100).keys()); // Array Iterator {}が出てきた
  // console.log(document.getElementsByClassName('.posts').append(postEl("aa")));//エラー
  console.log();

  [...Array(100).keys()].forEach(i => {
    // post0から99までtextに入れる
    const text = `post${i}`
    //改良：おそらく<div>にpost0~99を入れる
    // $('.posts').append(postEl(text));//編集前
    // console.log(document.getElementsByClassName('.posts')); //HTMLCollection []がズラーっと出てくる
    document.getElementsByClassName('posts')[i].append(postEl(text));
    // querySelector('.foo')
    // console.log(document.getElementsByClassName('.posts').append(postEl(text)));  //Uncaught TypeError: document.getElementsByClassName(...).append is not a function　→エラーになってしまう
  });
  //scrollIntoViewは要素の下端が下に来るように表示する。
  // $('.posts')[0].scrollIntoView(false);//編集前
  document.getElementsByClassName('posts')[0].scrollIntoView(false);
}

function loadPrepend() {
  if($(document).scrollTop() > 200) return;
  
  const beforeUpdatingScrollTop = $(document).scrollTop();
  [...Array(50).keys()].forEach(i => {
    const text = `prependPost${prependedCount * 50 + i}`;
    $('.posts').prepend(postEl(text));  
  });
  prependedCount++;

  const elements = $('.posts div');
  const movedScroll = elements[50].offsetTop - elements[0].offsetTop;
  $(document).scrollTop(beforeUpdatingScrollTop + movedScroll);
}

let prependedCount = 0;
let scrollEndTid = null;
function onScroll() {
  clearTimeout(scrollEndTid);
  scrollEndTid = setTimeout(() => {
    loadPrepend();
  }, 200)
}

//編集後 ロード時に実行されるように
window.onload = onLoad;
function onLoad() {
// $(() => {
  setupInitialPosts();
  $(document).scroll(onScroll);
};
// });

