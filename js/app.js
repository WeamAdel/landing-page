(function () {
  /**
   *
   * Manipulating the DOM exercise.
   * Exercise programmatically builds navigation,
   * scrolls to anchors from navigation,
   * and highlights section in viewport upon scrolling.
   *
   * Dependencies: None
   *
   * JS Version: ES2015/ES6
   *
   * JS Standard: ESlint
   *
   */

  /**
   * Define Global Variables
   *
   */

  const sections = document.querySelectorAll("main > section");
  const navList = document.getElementById("navbar-list");

  /**
   * End Global Variables
   * Start Helper Functions
   *
   */

  /**
   * End Helper Functions
   * Begin Main Functions
   *
   */

  // build the nav
  const navbarFragment = document.createDocumentFragment();

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const dataNav = section.dataset.nav;
    const listItem = generateNavListItem(dataNav, i == 0);
    navbarFragment.appendChild(listItem);
  }

  navList.appendChild(navbarFragment);

  function generateNavListItem(content, isActive) {
    const li = document.createElement("li");
    const a = document.createElement("a");

    if (isActive) a.classList.add("active");
    a.id = "nav-link-" + content;
    a.innerText = content;
    a.setAttribute("href", "#" + content);
    li.appendChild(a);

    return li;
  }

  // Add class 'active' to section when near top of viewport
  window.addEventListener("scroll", handleActiveSection);

  function getSectionPositionData() {
    const sectionsPositions = {};

    for (let section of sections) {
      const sectionTopOffset = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      sectionsPositions[section.id] = {
        elem: section,
        top: sectionTopOffset,
        height: sectionHeight,
        bottom: sectionTopOffset + sectionHeight / 2,
        anchor: document.getElementById("nav-link-" + section.id),
      };
    }

    return sectionsPositions;
  }

  let sectionPositions = getSectionPositionData();

  console.log(sectionPositions);
  let counterH = 0;
  let counterT = 0;
  let timeout = 0;
  function handleActiveSection() {
    // console.log("times h: ", ++counterH);
    // setTimeout(() => {
    //   clearTimeout(timeout);
    // }, 100);
    // timeout = setTimeout(function () {
    //   console.log("times time: ", counterT++);
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    for (let sectionId in sectionPositions) {
      const section = sectionPositions[sectionId];
      const viewBoundary = scrollPosition - 200; //120 is the padding
      console.log("s", scrollPosition);
      console.log("o", window.pageYOffset);
      if (
        section.top <= viewBoundary + windowHeight &&
        section.bottom >= viewBoundary + windowHeight / 2
      ) {
        section.elem.classList.add("active");
        section.anchor.classList.add("active");
      } else {
        section.elem.classList.remove("active");
        section.anchor.classList.remove("active");
      }
    }
    // }, 300);
  }

  //Handle window resizing and recalculate positions, then determin the active section
  window.addEventListener("resize", function () {
    sectionPositions = getSectionPositionData();
    handleActiveSection();
  });

  // Scroll to anchor ID using scrollTO event
  /**
   * End Main Functions
   * Begin Events
   *
   */

  // Build menu
  const toggler = document.getElementById("toggle-menu");

  toggler.addEventListener("click", toggleNavMenu);
  window.addEventListener("resize", closeNavMenu); //close menu on screen resize to large screen

  function toggleNavMenu() {
    navList.classList.toggle("show");
  }

  function closeNavMenu() {
    if (window.innerWidth >= 676) {
      navList.classList.remove("show");
    }
  }

  // Scroll to section on link click
  navList.addEventListener("click", handleNavbarScroll);

  function handleNavbarScroll(e) {
    e.preventDefault();
    const target = e.target;
    if (target.id) {
      const sectionId = target.id.replace("nav-link-", "");

      window.scroll({
        top: sectionPositions[sectionId].top,
        behavior: "smooth",
      });
    }
  }

  // Set sections as active
})();
