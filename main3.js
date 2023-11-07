function postEl(text) {
  return `<div>${text}</div>`;
}

// 最初の投稿の設定
function setupInitialPosts() {  
  [...Array(100).keys()].forEach(i => {
    const text = `post${i}`
    $('.posts').append(postEl(text));
  });
  $('.posts')[0].scrollIntoView(false);
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

$(() => {
  setupInitialPosts();
  $(document).scroll(onScroll);
});