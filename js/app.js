(function () {
  // Defining Global Variables
  const sections = document.querySelectorAll("main > section");
  const navList = document.getElementById("navbar-list");
  //Used to show navbar on first load/reload
  let initialRender = true;

  // build the nav
  const navbarFragment = document.createDocumentFragment();

  for (let section of sections) {
    const dataNav = section.dataset.nav;
    const listItem = generateNavListItem(dataNav);
    navbarFragment.appendChild(listItem);
  }

  navList.appendChild(navbarFragment);

  function generateNavListItem(content) {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.id = "nav-link-" + content;
    a.innerText = content;
    a.setAttribute("href", "#" + content);
    li.appendChild(a);

    return li;
  }

  // Add class 'active' to section & corresponding nav item when near top of viewport
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
  let activeSectionTimeoutId = null;

  function handleActiveSection() {
    /* 
      - clear previous timeout to delay excessive calculations.
      - wrapped it in another timeout to to see the active section/nav link
        onScrolling not just when the user stops scrolling.
    */

    /* 
      Only clear the timeout if the page is already rendered,
      otherwise the active class will not be added to the section 
      if the page already scrolled and reloaded again
  */
    if (!initialRender) {
      setTimeout(() => {
        clearTimeout(activeSectionTimeoutId);
      }, 100);
    }

    activeSectionTimeoutId = setTimeout(function () {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      for (let sectionId in sectionPositions) {
        const section = sectionPositions[sectionId];
        const viewBoundary = scrollY - 120; //200 is the padding

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
    }, 300);
  }

  //Handle window resizing and recalculate positions, then determin the active section
  window.addEventListener("resize", function () {
    sectionPositions = getSectionPositionData();
    handleActiveSection();
  });

  // Toggle small screen nav menu
  const toggler = document.getElementById("toggle-menu");

  toggler.addEventListener("click", toggleNavMenu);
  window.addEventListener("resize", closeNavMenu); //close menu on screen resize to large screen

  function toggleNavMenu() {
    navList.classList.toggle("show");
  }

  function closeNavMenu() {
    if (window.innerWidth >= 767) {
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

  //scroll to top button
  const scrollTopButton = document.getElementById("scroll-top");
  scrollTopButton.addEventListener("click", scrollToTopHandler);
  function scrollToTopHandler() {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }

  //show and hide scroll to top button when exceeding the header
  window.addEventListener("scroll", toggleScrollTopHandler);
  window.addEventListener("reseize", toggleScrollTopHandler);

  function toggleScrollTopHandler() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    if (scrollY > windowHeight - 60) {
      scrollTopButton.style.display = "block";
    } else {
      scrollTopButton.style.display = "none";
    }
  }

  //hide navbar on scroll
  const navbar = document.querySelector(".main-navbar");

  window.addEventListener("scroll", handleHideNavbar);
  let timeoutId = null;

  function handleHideNavbar() {
    //Always show the nav on first page load/reload
    if (initialRender) {
      initialRender = false;
    } else {
      //always show the nav if the user is near the top of the page
      if (window.scrollY <= 60) {
        navbar.style.display = "block";
      } else {
        navbar.style.display = "none";

        //clearing previous timeout to avoid blinking navbar
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
          navbar.style.display = "block";
        }, 1000);
      }
    }
  }

  //trigger the scroll on page load to handle already scrolled page
  window.scroll();
})();
