  const header = document.getElementById('header');
        const menuBtn = document.getElementById('menu-btn');
        const navLinksContainer = document.getElementById('nav-links');
        const navLinks = document.querySelectorAll('.nav-links a');

        const sections = document.querySelectorAll('section, footer');
        const contactForm = document.getElementById('contact-form');
        const formFeedback = document.getElementById('form-feedback');
        const themeToggleBtn = document.getElementById('theme-toggle');

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

        if (contactForm) {
            contactForm.querySelectorAll('submit', (e) => {
                e.preventDefault();
                const nameValue = document.getElementById('name').value;
                
                fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                }).then(response => {
                    if (response.ok) {
                        if (formFeedback) {
                            formFeedback.textContent = `
                            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message Sent | Rasheed Ibrahim</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: #080b12;
            color: #f5f7fb;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .thankyou-card {
            background: #111722;
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 40px;
            border-radius: 14px;
            text-align: center;
            max-width: 450px;
            box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }
        .icon {
            font-size: 3.5rem;
            color: #5b8cff;
            margin-bottom: 20px;
        }
        h1 { margin: 0 0 15px 0; font-size: 2rem; font-weight: 800; }
        p { color: #aeb7c7; margin: 0 0 30px 0; font-size: 1rem; line-height: 1.6; }
        .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: #5b8cff;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            transition: 0.3s;
        }
        .back-btn:hover { background: #7aa3ff; transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="thankyou-card">
        <div class="icon"><i class="fa-solid fa-circle-check"></i></div>
        <h1>Message Received!</h1>
        <p>Thank you for reaching out us ${nameValue}!. Your message has successfully passed through my contact gateway. I will review your details and respond shortly.</p>
        <a href="index.html" class="back-btn"><i class="fa-solid fa-arrow-left"></i> Back to Portfolio</a>
    </div>
</body>
</html>
`;
                            formFeedback.className = "form-feedback success";
                            formFeedback.style.display = 'block';
                        }
    
                    } else {
                        alert("Oops! There was a problem submitting your form.");
                    }
                }).catch(error => {
                    console.error("Form error:", error);
                });
            });
        }