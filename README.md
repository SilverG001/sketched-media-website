# Sketched Media Website (HTML/CSS/JS Static SPA)

This is a complete rebuild of the Sketched Media website, now implemented as a pure HTML, CSS, and JavaScript Single Page Application (SPA). This version can be hosted on any static web server, including GitHub Pages, as it does not require a server-side language like PHP.

## ✨ Features

-   **Pure Static SPA:** No server-side processing required.
-   **Fully Responsive Design:** Adapts seamlessly to all screen sizes.
-   **Material Design:** Implemented using Materialize CSS.
-   **Dynamic Content:** Project and showreel data are loaded from a JSON file and rendered dynamically by JavaScript.
-   **Hash-Based Routing:** Navigates between "pages" without full page reloads (e.g., `#home`, `#about`).
-   **Project Detail Pages:** Dynamically displays project details, including video embeds and credits.
-   **TrophyCase Page:** Showcases all showreels, dynamically rendered.
-   **Functional Contact Form:** Uses Formspree (a third-party service) to handle email submissions, removing the need for a PHP backend.
-   **Cinematic Animations:**
    -   Homepage hero section with a subtle "Ken Burns" animation.
    -   Elements fade into view as the user scrolls, powered by the Intersection Observer API.
-   **Modern Logo:** An SVG logo designed to fit the cinematic theme.

## 💻 Technology Stack

-   HTML5
-   CSS3 (Materialize CSS, custom styles)
-   JavaScript (ES6+, for routing, dynamic content, form handling, animations)
-   JSON (for data storage)
-   Formspree (for contact form backend)

## 📁 File & Directory Structure

```
sketched2/
│
├── 📜 index.html              # The single entry point for the SPA.
│
├── 📂 assets/
│   ├── 🖼️ placeholder_bg.jpg     # Background image for the hero section.
│   └── 🖼️ placeholder.png        # Placeholder image for project items.
│
├── 📂 css/
│   └── 📜 custom.css           # Custom styles and Materialize overrides.
│
├── 📂 data/
│   └── 📜 projects.json        # JSON data for all projects and showreels.
│
├── 📂 js/
│   └── 📜 main.js              # Core JavaScript logic for routing, dynamic content, animations, and form.
│
└── 📂 templates/
    ├── 📜 header.html           # Static HTML for the site header.
    ├── 📜 footer.html           # Static HTML for the site footer.
    ├── 📜 home.html             # Static HTML content for the home section.
    ├── 📜 about.html            # Static HTML content for the about section.
    ├── 📜 trophycase.html       # Static HTML content for the trophycase section.
    ├── 📜 project-detail.html   # Static HTML structure for project detail pages.
    ├── 📜 contact.html          # Static HTML for the contact form.
    └── 📜 404.html              # Static HTML for the 404 Not Found page.
```

## 🚀 Getting Started / How to Run

Since this is a static website, you don't need a PHP server. You just need a simple HTTP server to serve the files.

**Option 1: Python's Simple HTTP Server (Recommended for local development)**

1.  **Navigate to the project root directory:**
    ```bash
    cd /usr/lib/gemini-cli/codes/sketched2
    ```

2.  **Start the Python HTTP server:**
    ```bash
    python3 -m http.server 8000
    ```
    (If `python3` doesn't work, try `python -m http.server 8000`)

3.  **Open your browser:**
    Navigate to `http://localhost:8000` to view the website.

**Option 2: Live Server VS Code Extension (If using VS Code)**
Install the "Live Server" extension in VS Code. Right-click on `index.html` and select "Open with Live Server".

**Option 3: Any Static Web Hosting (e.g., GitHub Pages)**
Simply upload all the contents of the `sketched2` folder to your static web host.

## 📝 Contact Form Setup

The contact form uses [Formspree](https://formspree.io) to handle submissions without a backend.

1.  Go to [Formspree](https://formspree.io) and create an account.
2.  Create a new form to get your unique Form ID.
3.  **Edit `js/main.js`** and replace `YOUR_FORMSPREE_FORM_ID` with your actual Formspree ID.
    ```javascript
    // Replace 'YOUR_FORMSPREE_FORM_ID' with your actual Formspree form ID
    const response = await fetch("https://formspree.io/f/YOUR_FORMSPREE_FORM_ID", {
        // ...
    });
    ```
