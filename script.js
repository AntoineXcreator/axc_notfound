/* =========================================
   AXC / axc_notfound
   DATA-DRIVEN WEBSITE ENGINE
   ========================================= */


/* =========================================
   GLOBAL DATA
   ========================================= */

let siteData = {};
let projects = [];
let updates = [];
let partners = [];


/* =========================================
   TEXT FILE PARSER
   ========================================= */

function parseTXT(text) {

    const entries = [];

    let current = null;

    const lines = text.split(/\r?\n/);

    for (const rawLine of lines) {

        const line = rawLine.trim();

        // Ignore empty lines
        if (!line) {
            continue;
        }

        // Ignore comments
        if (line.startsWith("#")) {
            continue;
        }

        // New section
        if (
            line.startsWith("[") &&
            line.endsWith("]")
        ) {

            if (current) {
                entries.push(current);
            }

            current = {
                type: line.slice(1, -1),
                data: {}
            };

            continue;
        }

        // key=value
        const equalsIndex = line.indexOf("=");

        if (
            equalsIndex === -1 ||
            !current
        ) {
            continue;
        }

        const key =
            line
                .slice(0, equalsIndex)
                .trim();

        const value =
            line
                .slice(equalsIndex + 1)
                .trim();

        current.data[key] = value;
    }

    // Add final section
    if (current) {
        entries.push(current);
    }

    return entries.map(
        entry => entry.data
    );
}


/* =========================================
   LOAD TXT FILE
   ========================================= */

async function loadTXT(filename) {

    const response =
        await fetch(`data/${filename}`);

    if (!response.ok) {

        throw new Error(
            `Could not load data/${filename}`
        );

    }

    return await response.text();
}


/* =========================================
   HTML SAFETY
   ========================================= */

function escapeHTML(value = "") {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================
   BOOLEAN HELPER
   ========================================= */

function isTrue(value) {

    return String(value)
        .toLowerCase()
        .trim() === "true";

}


/* =========================================
   LOAD ALL WEBSITE DATA
   ========================================= */

async function loadAllData() {

    try {

        const [
            siteText,
            projectsText,
            updatesText,
            partnersText
        ] = await Promise.all([

            loadTXT("site.txt"),
            loadTXT("projects.txt"),
            loadTXT("updates.txt"),
            loadTXT("partners.txt")

        ]);


        const siteEntries =
            parseTXT(siteText);

        const projectEntries =
            parseTXT(projectsText);

        const updateEntries =
            parseTXT(updatesText);

        const partnerEntries =
            parseTXT(partnersText);


        siteData =
            siteEntries[0] || {};

        projects =
            projectEntries;

        updates =
            updateEntries;

        partners =
            partnerEntries;


        console.log(
            "> site.txt loaded"
        );

        console.log(
            `> projects: ${projects.length}`
        );

        console.log(
            `> updates: ${updates.length}`
        );

        console.log(
            `> partners: ${partners.length}`
        );


        renderEverything();


    } catch (error) {

        console.error(
            "> DATA ERROR:",
            error
        );

        showDataError();

    }

}


/* =========================================
   RENDER EVERYTHING
   ========================================= */

function renderEverything() {

    renderSite();

    renderFeaturedProject();

    renderProjects();

    renderUpdates();

    renderPartners();

}


/* =========================================
   SITE CONTENT
   ========================================= */

function renderSite() {

    setText(
        "siteLabel",
        siteData.heroLabel
    );

    setText(
        "heroLine1",
        siteData.heroLine1
    );

    setText(
        "heroLine2",
        siteData.heroLine2
    );

    setText(
        "heroLine3",
        siteData.heroLine3
    );

    setText(
        "heroDescription",
        siteData.heroDescription
    );


    setText(
        "aboutTitle",
        siteData.aboutTitle
    );

    setText(
        "aboutDescription",
        siteData.aboutDescription
    );


    setText(
        "aboutWhoami",
        siteData.aboutWhoami
    );

    setText(
        "aboutPurpose",
        siteData.aboutPurpose
    );

    setText(
        "aboutNextProject",
        siteData.aboutNextProject
    );

    setText(
        "aboutStatus",
        siteData.aboutStatus
    );


    // Logo
    const logos =
        document.querySelectorAll(".logo");

    logos.forEach(
        logo => {
            logo.textContent =
                siteData.logo || "AXc";
        }
    );

}


/* =========================================
   SAFE TEXT SETTER
   ========================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    element.textContent =
        value || "";

}


/* =========================================
   FIND FEATURED PROJECT
   ========================================= */

function getFeaturedProject() {

    return projects.find(
        project =>
            isTrue(project.featured)
    );

}


/* =========================================
   FEATURED PROJECT
   ========================================= */

function renderFeaturedProject() {

    const container =
        document.getElementById(
            "featuredProject"
        );

    if (!container) {
        return;
    }


    const project =
        getFeaturedProject();


    if (!project) {

        container.innerHTML = `
            <div class="window-content">
                <div class="window-title">
                    NO FEATURED PROJECT
                </div>

                <div class="window-meta">
                    STATUS: UNKNOWN
                </div>
            </div>
        `;

        return;
    }


    const day =
        project.day || "--";

    const totalDays =
        project.totalDays || "--";


    container.innerHTML = `

        <div class="window-header">

            <span>FEATURED PROJECT</span>

            <span class="window-status">
                ● ${escapeHTML(
                    project.status || "UNKNOWN"
                )}
            </span>

        </div>


        <div class="window-content">

            <div class="window-project-name">
                ${escapeHTML(project.name)}
            </div>


            <div class="window-project-description">
                ${escapeHTML(project.description)}
            </div>


            <div class="window-stats">

                <div>
                    <span>TECH</span>
                    <strong>
                        ${escapeHTML(
                            project.technology || "--"
                        )}
                    </strong>
                </div>


                <div>
                    <span>CATEGORY</span>
                    <strong>
                        ${escapeHTML(
                            project.category || "--"
                        )}
                    </strong>
                </div>


                <div>
                    <span>DAY</span>
                    <strong>
                        ${escapeHTML(day)}
                        /
                        ${escapeHTML(totalDays)}
                    </strong>
                </div>

            </div>


            <a
                class="window-button"
                href="${escapeHTML(
                    project.link || "#"
                )}"
            >
                VIEW PROJECT →
            </a>

        </div>

    `;

}


/* =========================================
   PROJECT CARDS
   ========================================= */

function renderProjects() {

    const container =
        document.getElementById(
            "projectsContainer"
        );

    if (!container) {
        return;
    }


    if (projects.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                NO PROJECTS FOUND.
            </div>
        `;

        return;
    }


    container.innerHTML =
        projects.map(
            project => `

                <article class="dynamic-project-card">

                    <div class="dynamic-project-top">

                        <span class="project-category">
                            ${escapeHTML(
                                project.category || "PROJECT"
                            )}
                        </span>

                        <span class="project-status">
                            ● ${escapeHTML(
                                project.status || "UNKNOWN"
                            )}
                        </span>

                    </div>


                    <h3>
                        ${escapeHTML(project.name)}
                    </h3>


                    <p>
                        ${escapeHTML(
                            project.description || ""
                        )}
                    </p>


                    <div class="dynamic-project-info">

                        <span>
                            ${escapeHTML(
                                project.technology || ""
                            )}
                        </span>

                        ${
                            project.day &&
                            project.totalDays &&
                            project.day !== "--"
                            ?
                            `<span>
                                DAY
                                ${escapeHTML(project.day)}
                                /
                                ${escapeHTML(project.totalDays)}
                            </span>`
                            :
                            ""
                        }

                    </div>


                    <a
                        href="${escapeHTML(
                            project.link || "#"
                        )}"
                        class="dynamic-project-link"
                    >
                        OPEN PROJECT →
                    </a>

                </article>

            `
        )
        .join("");

}


/* =========================================
   UPDATES
   ========================================= */

function renderUpdates() {

    const container =
        document.getElementById(
            "updatesContainer"
        );

    if (!container) {
        return;
    }


    if (updates.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                NO UPDATES FOUND.
            </div>
        `;

        return;
    }


    container.innerHTML =
        updates.map(
            update => `

                <article class="dynamic-update">

                    <div class="update-day">
                        ${escapeHTML(
                            update.day || "--"
                        )}
                    </div>


                    <div class="update-content">

                        <h3>
                            ${escapeHTML(
                                update.title || "UNTITLED"
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                update.description || ""
                            )}
                        </p>

                    </div>


                    ${
                        update.link
                        ?
                        `
                        <a
                            href="${escapeHTML(
                                update.link
                            )}"
                            class="update-link"
                        >
                            →
                        </a>
                        `
                        :
                        ""
                    }

                </article>

            `
        )
        .join("");

}


/* =========================================
   PARTNERS
   ========================================= */

function renderPartners() {

    const container =
        document.getElementById(
            "partnersContainer"
        );

    if (!container) {
        return;
    }


    if (partners.length === 0) {

        container.innerHTML = `
            <div class="partner-empty">
                <div class="partner-code">
                    404
                </div>

                <div>
                    PARTNERS NOT FOUND.
                </div>
            </div>
        `;

        return;
    }


    container.innerHTML =
        partners.map(
            partner => `

                <article class="dynamic-partner">

                    <div class="partner-status">
                        ${escapeHTML(
                            partner.status || "UNKNOWN"
                        )}
                    </div>


                    <h3>
                        ${escapeHTML(
                            partner.name || "UNKNOWN"
                        )}
                    </h3>


                    <p>
                        ${escapeHTML(
                            partner.description || ""
                        )}
                    </p>


                    ${
                        partner.website &&
                        partner.website !== "#"
                        ?
                        `
                        <a
                            href="${escapeHTML(
                                partner.website
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            VISIT →
                        </a>
                        `
                        :
                        ""
                    }

                </article>

            `
        )
        .join("");

}


/* =========================================
   RANDOM TERMINAL MESSAGE
   ========================================= */

const messages = [

    "loading creativity...",
    "compiling random ideas...",
    "searching for a good idea...",
    "making something weird...",
    "probably shouldn't work...",
    "building from scratch...",
    "project_status: UNKNOWN",
    "thinking...",
    "creating something unnecessary...",
    "what could possibly go wrong?"

];


const terminalLines =
    document.querySelectorAll(
        ".terminal-line"
    );


function randomMessage() {

    const randomIndex =
        Math.floor(
            Math.random() * messages.length
        );

    return messages[randomIndex];

}


setInterval(() => {

    if (terminalLines.length < 2) {
        return;
    }


    terminalLines[1].innerHTML =
        `<span>&gt;</span> ${escapeHTML(
            randomMessage()
        )}`;

}, 3000);


/* =========================================
   SCROLL REVEAL
   ========================================= */

const sections =
    document.querySelectorAll(
        ".section"
    );


const observer =
    new IntersectionObserver(

        (entries) => {

            entries.forEach(
                (entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                    }

                }
            );

        },

        {
            threshold: 0.1
        }

    );


sections.forEach(
    section => {
        observer.observe(section);
    }
);


/* =========================================
   DATA ERROR
   ========================================= */

function showDataError() {

    console.error(
        "> Could not load website data."
    );


    const containers = [

        "featuredProject",
        "projectsContainer",
        "updatesContainer",
        "partnersContainer"

    ];


    containers.forEach(
        id => {

            const element =
                document.getElementById(id);

            if (!element) {
                return;
            }


            element.innerHTML = `

                <div class="data-error">

                    <strong>
                        DATA ERROR
                    </strong>

                    <span>
                        Could not load TXT files.
                    </span>

                    <small>
                        Make sure the site is running
                        through a local server.
                    </small>

                </div>

            `;

        }
    );

}


/* =========================================
   START
   ========================================= */

console.log(
    "> booting axc_notfound..."
);

console.log(
    "> loading website data..."
);

loadAllData();


/* =========================================
   CURRENT YEAR
   ========================================= */

console.log(
    `> AXc initialized — ${new Date().getFullYear()}`
);