document.addEventListener('DOMContentLoaded', () => {
    // Materialize Sidenav Initialization
    const elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);

    // Data for dynamic content
    let appData = {};

    // Function to fetch data (projects, showreels)
    async function fetchData() {
        console.log('sketched2: fetchData called');
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) {
                console.error(`sketched2: fetchData: HTTP error! status: ${response.status} for data/projects.json`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            appData = await response.json();
            console.log('sketched2: App Data Loaded:', appData);
        } catch (error) {
            console.error("sketched2: fetchData: Could not fetch app data: ", error);
            // Fallback or display error message
        }
    }

    // Function to fetch HTML partials
    async function fetchPartial(pageName) {
        console.log('sketched2: fetchPartial called for:', pageName);
        try {
            const response = await fetch(`templates/${pageName}.html`);
            if (!response.ok) {
                console.error(`sketched2: fetchPartial: HTTP error! status: ${response.status} for templates/${pageName}.html`);
                if (response.status === 404) {
                    console.log(`sketched2: fetchPartial: Loading 404 for ${pageName}`);
                    return fetchPartial('404'); // Load 404 page if partial not found
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log(`sketched2: fetchPartial: Loaded ${pageName}.html`);
            return await response.text();
        } catch (error) {
            console.error(`sketched2: fetchPartial: Could not fetch partial ${pageName}.html: `, error);
            return fetchPartial('404'); // Fallback to 404 on network error or other issues
        }
    }

    // Function to render page content dynamically
    async function renderPage(pageName, params = {}) {
        console.log('sketched2: renderPage called for:', pageName, 'with params:', params); // Add log
        const mainContentDiv = document.getElementById('main-content');
        if (!mainContentDiv) {
            console.error('sketched2: main-content div not found!');
            return;
        }

        let contentHtml = await fetchPartial(pageName);
        let pageTitle = "Sketched Media"; // Default title

        // Dynamic content generation based on pageName
        if (pageName === 'trophycase') {
            pageTitle = "TrophyCase | Sketched Media";
            // Render showreels
            const showreelsHtml = appData.showreels.map((reel, index) => `
                <div class="col s12 l10 offset-l1 fade-in-element" style="margin-bottom: 4rem;">
                    <h3 class="center-align">${reel.title}</h3>
                    <p class="flow-text light grey-text text-lighten-1 center-align" style="margin-bottom: 2rem;">${reel.description}</p>
                    <div class="video-container z-depth-1">
                        <iframe 
                            src="https://www.youtube.com/embed/${reel.video_id}?rel=0" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                </div>
            `).join('');
            contentHtml = contentHtml.replace('<!-- Dynamic content goes here -->', showreelsHtml);
        } else if (pageName === 'project-detail') {
            const projectId = params.id;
            const project = appData.projects[projectId];
            if (project) {
                pageTitle = `${project.title} | Sketched Media`;
                let creditsHtml = '';
                for (const role in project.credits) {
                    creditsHtml += `
                        <li class="collection-item transparent" style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <strong class="amber-text">${role}:</strong>
                            <span>${project.credits[role]}</span>
                        </li>
                    `;
                }

                const projectDetailHtml = `
                    <div class="row project-detail fade-in-element">
                        <div class="col s12 center-align">
                            <h1>${project.title}</h1>
                            <h5 class="light grey-text text-lighten-3">${project.tagline}</h5>
                        </div>
                        <div class="col s12" style="margin-top: 2rem; margin-bottom: 3rem;">
                            <div class="video-container z-depth-1">
                                <iframe 
                                    src="https://www.youtube.com/embed/${project.video_id}?rel=0" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen>
                                </iframe>
                            </div>
                        </div>
                        <div class="col s12 m8">
                            <h2>About the Project</h2>
                            <p class="light flow-text">${project.description.replace(/\n/g, '<br>')}</p>
                        </div>
                        <div class="col s12 m4">
                            <div class="card transparent z-depth-0" style="border: 1px solid #222;">
                                <div class="card-content white-text">
                                    <span class="card-title amber-text">Credits</span>
                                    <ul class="collection transparent" style="border: none;">
                                        ${creditsHtml}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12 center-align">
                            <a href="#trophycase" class="waves-effect waves-light btn-large cta-button" style="margin-top: 1rem;">Back to TrophyCase</a>
                        </div>
                    </div>
                `;
                contentHtml = contentHtml.replace('<!-- Dynamic content goes here -->', projectDetailHtml).replace('<div id="project-not-found" class="row" style="display: none;">', '<div id="project-not-found" class="row" style="display: none;">');
            } else {
                // If project not found, display 404 content
                contentHtml = await fetchPartial('404');
                pageTitle = "404 Page Not Found";
            }
        } else if (pageName === 'contact') {
            pageTitle = "Contact Us | Sketched Media";
        } else if (pageName === 'about') {
            pageTitle = "About Us | Sketched Media";
        } else if (pageName === 'home') {
            pageTitle = "Sketched Media - We Bring Stories to Life";
        }

        document.title = pageTitle;
        mainContentDiv.innerHTML = contentHtml;

        // Re-initialize Materialize components that might be in the new content
        M.AutoInit();
        // Re-initialize scroll animations for new content
        initScrollAnimations();
        console.log('sketched2: renderPage completed for:', pageName); // Add log
    }

    // Hash-based Router
    async function router() {
        console.log('sketched2: router called. Current hash:', window.location.hash); // Add log
        const hash = window.location.hash.slice(1); // Get hash without '#'
        let pageName = 'home';
        let params = {};

        if (hash) {
            const parts = hash.split('?');
            pageName = parts[0] || 'home';
            if (parts.length > 1) {
                params = Object.fromEntries(new URLSearchParams(parts[1]));
            }
        }
        
        // Default page if hash is empty
        if (!pageName) {
            pageName = 'home';
        }

        // Handle direct project detail links from trophycase
        if (pageName === 'project-detail' && !params.id) {
            // This might happen if someone types #project-detail directly without an ID
            pageName = '404'; // Or redirect to trophycase
        }

        // Check if the requested partial exists before rendering
        const validPartials = ['home', 'about', 'trophycase', 'project-detail', 'contact', '404'];
        if (!validPartials.includes(pageName)) {
            pageName = '404';
        }

        await renderPage(pageName, params);
        console.log('sketched2: router completed for:', pageName); // Add log

        // Highlight active nav link
        document.querySelectorAll('.sidenav a, .right a').forEach(link => {
            link.classList.remove('active');
            const linkPageName = link.getAttribute('href').split('#')[1].split('?')[0];
            if (linkPageName === pageName) {
                link.classList.add('active');
            }
        });
        
        // Close sidenav on route change
        const sidenavInstance = M.Sidenav.getInstance(document.querySelector('.sidenav'));
        if (sidenavInstance && sidenavInstance.isOpen) {
            sidenavInstance.close();
        }
    }

    // Scroll Animation Initialization
    function initScrollAnimations() {
        console.log('sketched2: initScrollAnimations called'); // Add log
        const fadeInElements = document.querySelectorAll('.fade-in-element');

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target); // Stop observing once visible
                    }
                });
            }, {
                threshold: 0.1 // Trigger when 10% of the element is visible
            });

            fadeInElements.forEach(element => {
                observer.observe(element);
            });
        } else {
            // Fallback for older browsers
            fadeInElements.forEach(element => {
                element.classList.add('is-visible');
            });
        }
    }

    // Contact Form Submission Handler (using Formspree as an example)
    async function handleContactFormSubmit(event) {
        console.log('sketched2: handleContactFormSubmit called'); // Add log
        event.preventDefault();
        const form = event.target;
        const statusDiv = document.getElementById('contact-status-message-container');
        statusDiv.innerHTML = ''; // Clear previous messages

        const formData = new FormData(form);
        const object = {};
        formData.forEach((value, key) => object[key] = value);
        const json = JSON.stringify(object);

        try {
            // Replace 'YOUR_FORMSPREE_FORM_ID' with your actual Formspree form ID
            const response = await fetch("https://formspree.io/f/YOUR_FORMSPREE_FORM_ID", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });

            if (response.ok) {
                statusDiv.innerHTML = `<div class="card-panel green darken-1 white-text center-align">
                                            <i class="material-icons">check_circle</i> Thank you for your message! We will be in touch shortly.
                                        </div>`;
                form.reset(); // Clear the form
            } else {
                const data = await response.json();
                if (data.errors) {
                    statusDiv.innerHTML = `<div class="card-panel orange darken-1 white-text center-align">
                                                <i class="material-icons">warning</i> ${data.errors.map(error => error.message).join(', ')}
                                            </div>`;
                } else {
                    statusDiv.innerHTML = `<div class="card-panel red darken-1 white-text center-align">
                                                <i class="material-icons">error</i> There was an error sending your message. Please try again later.
                                            </div>`;
                }
            }
        } catch (error) {
            console.error('sketched2: Contact form submission error:', error);
            statusDiv.innerHTML = `<div class="card-panel red darken-1 white-text center-align">
                                        <i class="material-icons">error</i> There was a network error. Please try again.
                                    </div>`;
        }
    }

    // Implement minimum display time for loader
    let minLoadTimePassed = false;
    let appInitialized = false;
    const MIN_LOAD_TIME = 500; // milliseconds

    function hideLoader() {
        console.log('sketched2: hideLoader called. minLoadTimePassed:', minLoadTimePassed, 'appInitialized:', appInitialized);
        if (minLoadTimePassed && appInitialized) {
            const loaderWrapper = document.getElementById('loader-wrapper');
            if (loaderWrapper) {
                loaderWrapper.classList.add('hidden');
                console.log('sketched2: Loader should be hidden now.');
            } else {
                console.error('sketched2: Loader wrapper element not found!');
            }
        } else {
            console.log('sketched2: Conditions not yet met to hide loader.');
        }
    }

    // Set timeout for minimum load time
    setTimeout(() => {
        minLoadTimePassed = true;
        console.log('sketched2: minLoadTimePassed set to true.');
        hideLoader();
    }, MIN_LOAD_TIME);

    // Initial load and event listeners
    async function init() {
        console.log('sketched2: init() started');
        await fetchData(); // Load app data first
        console.log('sketched2: fetchData() completed');

        // Load header and footer
        document.getElementById('header-placeholder').innerHTML = await fetchPartial('header');
        document.getElementById('footer-placeholder').innerHTML = await fetchPartial('footer');
        console.log('sketched2: Header and Footer loaded');

        // Materialize AutoInit for new content (e.g., dropdowns in navbar)
        M.AutoInit();
        console.log('sketched2: Materialize AutoInit completed');
        
        // Setup router
        window.addEventListener('hashchange', router);
        await router(); // Initial route
        console.log('sketched2: Router initial setup completed');

        // Attach contact form listener after rendering the contact page
        document.addEventListener('submit', (event) => {
            if (event.target.id === 'contact-form') {
                handleContactFormSubmit(event);
            }
        });
        console.log('sketched2: Contact form listener attached');
        
        // Re-initialize Materialize forms after content load
        M.updateTextFields();
        document.querySelectorAll('select').forEach(el => M.FormSelect.init(el));
        console.log('sketched2: Materialize forms re-initialized');
        
        // Initialize Materialize tooltips (if any)
        const tooltippedElems = document.querySelectorAll('.tooltipped');
        M.Tooltip.init(tooltippedElems);
        console.log('sketched2: Materialize tooltips initialized');

        // Signal that app initialization is complete
        appInitialized = true;
        console.log('sketched2: appInitialized set to true.');
        hideLoader(); // Attempt to hide loader if min time has passed
        console.log('sketched2: init() completed.');
    }

    init();
});