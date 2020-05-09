const subtitles = document.querySelectorAll(".subtitle");
const pages = document.querySelectorAll(".page");
const maxPage = pages.length - 1;
const minPage = 0;
let currentPage = 0;
let previosPage;
let ticking = false;
let touchmoved = false;
let startY = 0;
let endY = 0;
let isIllegal = false;
window.onload = () => {
  if (window.innerHeight < 500 || window.innerWidth < 320) {
    isIllegal = true;
    alert("현재 접속 환경은 해당 컨텐츠를 제대로 표시하지 못할 수도 있습니다.");
  }
};
const changePage = (e) => {
  let variation;
  if (e.type === "wheel") variation = e.deltaY > 0 ? 1 : -1;
  if (e.type === "touchend") variation = endY - startY > 0 ? -1 : 1;
  previosPage = currentPage;
  currentPage += variation;
  let isPageOver = false;
  if (currentPage < minPage || currentPage > maxPage) {
    isPageOver = true;
    currentPage -= variation;
  }
  if (!isPageOver && !ticking) {
    switch (currentPage) {
      case minPage:
        requestAnimation(firstPage);
        break;
      case maxPage:
        requestAnimation(lastPage);
        break;
      default:
        requestAnimation(betweenPage);
        break;
    }
  }
};

const betweenPage = () => {
  document.querySelector(":root").style.setProperty("--line-width", "100vw");
  const lineStyle = document.querySelector("#line").style;
  lineStyle.setProperty("left", "0");
  lineStyle.setProperty("right", "0");
};

const firstPage = () => {
  document.querySelector(":root").style.setProperty("--line-width", "50vw");
  const lineStyle = document.querySelector("#line").style;
  lineStyle.setProperty("left", "50vw");
  lineStyle.setProperty("right", "0");
};

const lastPage = () => {
  document.querySelector(":root").style.setProperty("--line-width", "50vw");
  const lineStyle = document.querySelector("#line").style;
  lineStyle.setProperty("left", "0");
  lineStyle.setProperty("right", "50vw");
};

const requestAnimation = (launch) => {
  window.requestAnimationFrame(() => {
    changeShowContent();
    launch();
    ticking = false;
  });
  ticking = true;
};

const changeShowContent = () => {
  subtitles[previosPage].classList.remove("show");
  subtitles[currentPage].classList.add("show");
  pages[previosPage].classList.remove("show");
  pages[currentPage].classList.add("show");
};

if (isIllegal)
  window.addEventListener("scroll", (e) => {
    if (checkCondition()) changePage(e);
  });
else
  window.addEventListener("wheel", (e) => {
    if (checkCondition()) changePage(e);
  });

window.addEventListener("touchstart", (e) => {
  startY = e.touches[0].pageY;
});
window.addEventListener("touchmove", (e) => {
  touchmoved = true;
});
window.addEventListener("touchend", (e) => {
  if (!touchmoved) return;
  endY = e.changedTouches[0].pageY;
  touchmoved = false;
  if (checkCondition()) changePage(e);
});

const checkCondition = () => {
  const fullHeight =
    document.getElementById("sub").offsetHeight +
    document.getElementsByTagName("nav")[0].offsetHeight;
  const currentBottomY = window.innerHeight + window.pageYOffset;
  if (currentBottomY >= fullHeight || window.pageYOffset === 0) return true;
};
