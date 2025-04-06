const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeBtn = document.getElementById('closeBtn');
const overlay = document.getElementById('overlay');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    overlay.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
    });
});

const sections = document.querySelectorAll('section');
const navButtons = document.querySelectorAll('.nav-button');

window.addEventListener('scroll', () => {
    updateSection();
});

function updateSection() {
    let currentSection = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
            currentSection = section.getAttribute("id");
        }
    });
    navButtons.forEach(button => {
        button.classList.remove("active");
        if (button.querySelector("a").getAttribute("href") === "#" + currentSection) {
            button.classList.add("active");
        }
    });
}

updateSection();



const dropdown = document.getElementById('productDropdown');
const dropdownHeader = document.getElementById('dropdownHeader');
const selectedOption = document.getElementById('selectedOption');
const options = dropdown.querySelectorAll('.dropdown-options li');

dropdownHeader.addEventListener('click', () => {
  dropdown.classList.toggle('active');
});

options.forEach(option => {
  option.addEventListener('click', (e) => {
    const value = e.target.getAttribute('data-value');
    selectedOption.textContent = value;
    dropdown.classList.remove('active');
  });
});

document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove('active');
  }
});