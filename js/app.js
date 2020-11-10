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
    const sectionsPositions = [];

    for (let section of sections) {
      //   const sectionId = section.id;
      const sectionTopOffset = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      sectionsPositions.push({
        section,
        top: sectionTopOffset,
        bottom: sectionTopOffset + sectionHeight,
        anchor: document.getElementById("nav-link-" + section.id),
      });
    }

    return sectionsPositions;
  }

  const sectionPossitions = getSectionPositionData();

  function handleActiveSection(e) {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const viewBoundary = scrollPosition + windowHeight - 120; //120 is the padding

    for (let section of sectionPossitions) {
      if (section.top <= viewBoundary && section.bottom >= viewBoundary) {
        section.section.classList.add("active");
        section.anchor.classList.add("active");
      } else {
        section.section.classList.remove("active");
        section.anchor.classList.remove("active");
      }
    }
  }

  // Scroll to anchor ID using scrollTO event

  /**
   * End Main Functions
   * Begin Events
   *
   */

  // Build menu

  // Scroll to section on link click

  // Set sections as active
})();
