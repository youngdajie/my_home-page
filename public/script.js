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

  var cardObserver = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add("is-visible");
        cardObserver.unobserve(entries[i].target);
      }
    }
  }, { rootMargin: "0px 0px 15% 0px" });

  function observeSubsiteCards() {
    var cards = document.querySelectorAll(".subsite-card");
    for (var i = 0; i < cards.length; i++) {
      if (!cards[i].classList.contains("is-visible")) {
        cardObserver.observe(cards[i]);
      }
    }
  }

  observeSubsiteCards();
  var cardMutationObserver = new MutationObserver(observeSubsiteCards);
  cardMutationObserver.observe(document.body, { childList: true, subtree: true });

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
