const subtitles = document.getElementsByClassName("subtitle");
const pages = document.getElementsByClassName("page");
const maxPage = pages.length - 1;
const minPage = 0;
let currentPage = 0;
let previousPage;
let ticking = false;
let touchmoved = false;
let startY = 0;
let endY = 0;
let isIllegal = false;
let timeOver = true;
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
  previousPage = currentPage;
  currentPage += variation;
  let isPageOver = false;
  if (currentPage < minPage || currentPage > maxPage) {
    isPageOver = true;
    currentPage -= variation;
  }
  if (!isPageOver && !ticking) requestAnimation(betweenPage);
};

const betweenPage = () => {
  timeOver = false;
  const circleClasses = document.querySelector(".circleBound.main").classList;
  const line = document.getElementById("line");
  const computedLine = window.getComputedStyle(line);
  const lineWidth = computedLine.getPropertyValue("width");
  const lineLeft = computedLine.getPropertyValue("left");
  let supportCircleClasses,
    leftPosition = parseInt(lineLeft.substring(0, lineLeft.length - 2));
  const moveDistance =
    parseInt(lineWidth.substring(0, lineWidth.length - 2)) / 5;
  const isLeft = previousPage < currentPage;
  if (isLeft) {
    circleClasses.add("left");
    supportCircleClasses = document.querySelector(".circleBound.after")
      .classList;
    leftPosition -= moveDistance;
  } else {
    circleClasses.add("right");
    supportCircleClasses = document.querySelector(".circleBound.pre").classList;
    leftPosition += moveDistance;
  }
  supportCircleClasses.add("animation");
  line.className = "move";
  line.style.setProperty("left", leftPosition + "px");
  setTimeout(() => {
    line.classList.remove("move");
    if (isLeft) circleClasses.remove("left");
    else circleClasses.remove("right");
    supportCircleClasses.remove("animation");
    timeOver = true;
  }, 1000);
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
  subtitles[previousPage].classList.remove("show");
  subtitles[currentPage].classList.add("show");
  pages[previousPage].classList.remove("show");
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
  if ((currentBottomY >= fullHeight || window.pageYOffset === 0) && timeOver)
    return true;
};
