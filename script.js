

const header = document.getElementById('header');const menuBtn = document.getElementById('menu-btn');const navLinksContainer = document.getElementById('nav-links');const navLinks = document.querySelectorAll('.nav-links a');const sections = document.querySelectorAll('section, footer');const contactForm = document.getElementById('contact-form');const formFeedback = document.getElementById('form-feedback');const themeToggleBtn = document.getElementById('theme-toggle');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    highlightNavOnScroll();
});
if (menuBtn && navLinksContainer) {

    menuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        if (navLinksContainer.classList.contains('active')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinksContainer) {
            navLinksContainer.classList.remove('active');
        }
        if (menuBtn) {
            menuBtn.querySelector('i').className = 'fa-solid fa-bars';
        }

    });
});
function highlightNavOnScroll() {
    let scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        if (section.id && scrollPos >= section.offsetTop && scrollPos < (section.offsetTop + section.offsetHeight)) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}
let savedTheme = null;


try {
    savedTheme = localStorage.getItem('theme');
} catch (error) {
    console.warn('localStorage is restricted or unavailable in this environment:', error);
}
const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    updateThemeIcon('light');
} else if (savedTheme === 'dark') {
    document.body.classList.remove('light-theme');
    updateThemeIcon('dark');
} else if (systemPrefersLight) {
    document.body.classList.add('light-theme');
    updateThemeIcon('light');
} else {
    document.body.classList.remove('light-theme');

    updateThemeIcon('dark');
}
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLightActive = document.body.classList.contains('light-theme');
        
        try {
            localStorage.setItem('theme', isLightActive ? 'light' : 'dark');
        } catch (error) {
            console.warn('Unable to persist theme settings to localStorage:', error);
        }
        
        updateThemeIcon(isLightActive ? 'light' : 'dark');
    });
}
function updateThemeIcon(currentTheme) {

    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
        if (currentTheme === 'light') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }
}
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nameValue = document.getElementById('name').value;
        
        if (formFeedback) {
            formFeedback.textContent = `Thank you, ${nameValue}! Your message has been simulated successfully.`;

            formFeedback.className = "form-feedback success";
            formFeedback.style.display = 'block';
        }
        
        contactForm.reset();
        
        setTimeout(() => {
            if (formFeedback) {
                formFeedback.style.display = 'none';
                formFeedback.className = "form-feedback";
                formFeedback.textContent = "";
            }
        }, 5000);
    });
}


