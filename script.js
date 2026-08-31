
const header = document.getElementById('header');
const menuBtn = document.getElementById('menu-btn');
const navLinksContainer = document.getElementById('nav-links');
const navLinks = document.querySelectorAll('.nav-links a');

const sections = document.querySelectorAll('section, footer');
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');
const themeToggleBtn = document.getElementById('theme-toggle');

// 2. Optimized Scroll Event Listener
window.addEventListener('scroll', () => {
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    highlightNavOnScroll();
});

// 3. Mobile Menu Toggle Fix
if (menuBtn && navLinksContainer) {
    menuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        if (icon) {
            if (navLinksContainer.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        }
    });
}

// 4. Mobile Menu Link Click Fix
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinksContainer) {
            navLinksContainer.classList.remove('active');
        }
        if (menuBtn) {
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.className = 'fa-solid fa-bars';
            }
        }
    });
});

// 5. Scroll Highlight Engine
function highlightNavOnScroll() {
    if (navLinks.length === 0) return;

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

// 6. Theme Engine Initialization (Local Storage Sync)
let savedTheme = null;
try {
    savedTheme = localStorage.getItem('theme');
} catch (error) {
    console.warn('localStorage is restricted or unavailable:', error);
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

// 7. Theme Click Handler
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLightActive = document.body.classList.contains('light-theme');
        try {
            localStorage.setItem('theme', isLightActive ? 'light' : 'dark');
        } catch (error) {
            console.warn('Unable to persist theme settings:', error);
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

// 8. Secure Async Contact Form Handler with Dashboard View Swap
if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevents Formspree from opening its external website redirection

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const successDashboard = document.getElementById('success-dashboard');

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = 'Transmitting... <i class="fa-solid fa-spinner fa-spin"></i>';
        }

        if (formFeedback) {
            formFeedback.textContent = 'Initializing telemetry payload...';
            formFeedback.className = 'form-feedback';
            formFeedback.style.display = 'block';
        }

        try {
            // Submits payload via Fetch background transaction stream
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`Submission failed with status ${response.status}`);
            }

            // Successfully processed
            contactForm.reset();
            
            if (formFeedback) {
                formFeedback.style.display = 'none'; 
            }
            
            // Layout Viewport State Swap 
            contactForm.style.display = 'none';
            if (successDashboard) {
                successDashboard.style.display = 'block';
                successDashboard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

        } catch (error) {
            console.error('Formspree connection error:', error);
            if (formFeedback) {
                formFeedback.textContent = 'Network Timeout: Transmission dropped. Please try again.';
                formFeedback.className = 'form-feedback error';
            }
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
            }
        }
    });
}

// Interactive Dashboard Toggle Back Button Handler
const backToFormBtn = document.getElementById('back-to-form-btn');
if (backToFormBtn && contactForm) {
    backToFormBtn.addEventListener('click', () => {
        const successDashboard = document.getElementById('success-dashboard');
        if (successDashboard) {
            successDashboard.style.display = 'none';
        }
        contactForm.style.display = 'block';
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
        }
    });
}
