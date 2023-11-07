function postEl(text) {
  return `<div>${text}</div>`;
}

// 最初の投稿の設定
function setupInitialPosts() {  
  // 配列100個のkeyにdiv要素を追加する
  [...Array(100).keys()].forEach(i => {
    const text = `post${i}`
    //子要素の末尾に追加する
    $('.posts').append(postEl(text));
  });
  $('.posts')[0].scrollIntoView(false);
  // $('.posts')[0].scrollIntoView({behavior: "smooth", block: "end"});
}
// 下で呼ぶ（スクロールした時の）ロード時に先頭に追加
function loadPrepend() {
  // scrollIntoView(false)を使用したことにより初期値が1650となっている
  // 上にスクロールしていき200未満になったら処理を実行するために返している
  if($(document).scrollTop() > 200) return;
  
  const beforeUpdatingScrollTop = $(document).scrollTop();
  console.log(beforeUpdatingScrollTop);
  [...Array(50).keys()].forEach(i => {
    // prependedCountは初期値０、
    const text = `prependPost${prependedCount * 50 + i}`;
    $('.posts').prepend(postEl(text));  
  });
  prependedCount++;
  // .postとdivタグの要素を変数にする。
  const elements = $('.posts div');
  // console.log(elements[50].offsetTop);//1232子要素のoffsetTopは、親要素の、borderを含めない上端から、子要素のborderの上端までの幅
  // console.log(elements[0].offsetTop);//32
  const movedScroll = elements[50].offsetTop - elements[0].offsetTop;
  $(document).scrollTop(beforeUpdatingScrollTop + movedScroll);
  console.log($(document).scrollTop(beforeUpdatingScrollTop + movedScroll)); //init [document, context: document]←何これ？
}

let prependedCount = 0;
let scrollEndTid = null;
function onScroll() {
  clearTimeout(scrollEndTid);
  scrollEndTid = setTimeout(() => {
    loadPrepend();
  }, 200)
  // console.log($(this).scrollTop());
}

$(() => {
  setupInitialPosts();
  $(document).scroll(onScroll);
});