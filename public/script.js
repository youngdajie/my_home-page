document.onkeydown = function (e) {
  if (e.key === "F12") {
    e.preventDefault();
  }
};

document.body.oncontextmenu = function (e) {
  e.preventDefault();
};

function toggleClass(selector, className) {
  var elements = document.querySelectorAll(selector);
  elements.forEach(function (element) {
    element.classList.toggle(className);
  });
}

document.addEventListener("DOMContentLoaded", function () {

  /*夜间自动打开暗色主题
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    if (currentHour >= 18 || currentHour < 6) {
        switchCheckbox.checked = false;
        changeTheme(1);
    }
  */

  // switchCheckbox.addEventListener("change", function () {
  //   if (themeState == "Light") {
  //     changeTheme("Blue");
  //   } else if (themeState == "Dark") {
  //     changeTheme("Light");
  //   } else if (themeState == "Blue") {
  //     changeTheme("Dark");
  //   }
  // });

  var subsiteCards = document.querySelectorAll(".subsite-card");

  function revealVisibleCards() {
    for (var i = 0; i < subsiteCards.length; i++) {
      var subsiteCard = subsiteCards[i];
      var cardTop = subsiteCard.getBoundingClientRect().top;

      if (cardTop < window.innerHeight * 1.05) {
        subsiteCard.classList.add("is-visible");
      }
    }
  }

  window.addEventListener("scroll", revealVisibleCards);
  window.addEventListener("resize", revealVisibleCards);

  revealVisibleCards();

  var pageLoading = document.querySelector("#page-loading");
  var center = document.getElementById("page-loading__spinner");
  setTimeout(function () {
    pageLoading.style.opacity = "0";
    center.style.height = "400px";
    center.style.width = "400px";
    center.style.opacity = "0";
    pageLoading.style.backgroundSize = "200%";
  }, 530);

});
