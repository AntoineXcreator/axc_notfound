/* =========================================
   AXC / axc_notfound
   v2 DATA ENGINE
   ========================================= */


/* =========================================
   GLOBAL DATA
   ========================================= */

let siteData = {};

let projects = [];

let updates = [];

let partners = [];


/* =========================================
   TXT PARSER
   ========================================= */

function parseTXT(text) {

    const entries = [];

    let current = null;

    const lines =
        text.split(/\r?\n/);


    for (const rawLine of lines) {

        const line =
            rawLine.trim();


        if (!line) {
            continue;
        }


        if (line.startsWith("#")) {
            continue;
        }


        if (
            line.startsWith("[") &&
            line.endsWith("]")
        ) {

            if (current) {
                entries.push(current);
            }


            current = {

                type:
                    line.slice(1, -1),

                data: {}

            };


            continue;

        }


        const equalsIndex =
            line.indexOf("=");


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


        current.data[key] =
            value;

    }


    if (current) {

        entries.push(current);

    }


    return entries.map(
        entry => entry.data
    );

}


/* =========================================
   LOAD TXT
   ========================================= */

async function loadTXT(filename) {

    const response =
        await fetch(
            `data/${filename}?v=${Date.now()}`
        );


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

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================
   BOOLEAN
   ========================================= */

function isTrue(value) {

    return String(value)
        .toLowerCase()
        .trim() === "true";

}


/* =========================================
   TEXT SETTER
   ========================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (!element) {
        return;
    }


    element.textContent =
        value ?? "";

}


/* =========================================
   LOAD ALL DATA
   ========================================= */

async function loadAllData() {

    try {

        console.log(
            "> loading AXc data..."
        );


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


        projects =
            parseTXT(projectsText);


        updates =
            parseTXT(updatesText);


        partners =
            parseTXT(partnersText);


        siteData =
            siteEntries[0] || {};


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


        console.log(
            "> AXc data loaded successfully."
        );


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

    renderStats();

    renderFeaturedProject();

    renderProjects();

    renderUpdates();

    renderPartners();

}


/* =========================================
   SITE
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


    if (siteData.siteName) {

        document.title =
            `${siteData.logo || "AXc"} — ${siteData.siteName}`;

    }


    const logos =
        document.querySelectorAll(
            ".logo, .footer-logo"
        );


    logos.forEach(
        logo => {

            logo.textContent =
                siteData.logo || "AXc";

        }
    );

}


/* =========================================
   STATS
   ========================================= */

function renderStats() {

    setText(
        "projectCount",
        String(projects.length).padStart(2, "0")
    );


    setText(
        "updateCount",
        String(updates.length).padStart(2, "0")
    );


    setText(
        "currentYear",
        new Date().getFullYear()
    );

}


/* =========================================
   FEATURED PROJECT
   ========================================= */

function getFeaturedProject() {

    return projects.find(
        project =>
            isTrue(project.featured)
    );

}


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

            <div class="window-header">

                <div class="window-title-group">

                    <span class="window-dot"></span>

                    <span>
                        project.exe
                    </span>

                </div>

                <span class="window-status">
                    ● IDLE
                </span>

            </div>


            <div class="window-content">

                <div class="window-project-name">
                    NO FEATURED PROJECT
                </div>

                <p class="window-project-description">
                    Nothing is currently featured.
                </p>

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

            <div class="window-title-group">

                <span class="window-dot"></span>

                <span>
                    ${escapeHTML(
                        project.id || "project.exe"
                    )}
                </span>

            </div>


            <span class="window-status">

                ● ${escapeHTML(
                    project.status || "UNKNOWN"
                )}

            </span>

        </div>


        <div class="window-content">

            <div class="window-project-name">

                ${escapeHTML(
                    project.name || "UNTITLED"
                )}

            </div>


            <div class="window-project-description">

                ${escapeHTML(
                    project.description || ""
                )}

            </div>


            <div class="window-stats">


                <div>

                    <span>
                        TECHNOLOGY
                    </span>

                    <strong>

                        ${escapeHTML(
                            project.technology || "--"
                        )}

                    </strong>

                </div>


                <div>

                    <span>
                        CATEGORY
                    </span>

                    <strong>

                        ${escapeHTML(
                            project.category || "--"
                        )}

                    </strong>

                </div>


                <div>

                    <span>
                        PROGRESS
                    </span>

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
                    project.link || "#projects"
                )}"
            >

                VIEW PROJECT →

            </a>


        </div>

    `;

}


/* =========================================
   PROJECTS
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
            project => {


                const hasDays =
                    project.day &&
                    project.totalDays &&
                    project.day !== "--";


                return `

                    <article
                        class="dynamic-project-card"
                    >


                        <div class="dynamic-project-top">


                            <span
                                class="project-category"
                            >

                                ${escapeHTML(
                                    project.category ||
                                    "PROJECT"
                                )}

                            </span>


                            <span
                                class="project-status"
                            >

                                ● ${escapeHTML(
                                    project.status ||
                                    "UNKNOWN"
                                )}

                            </span>


                        </div>



                        <h3>

                            ${escapeHTML(
                                project.name ||
                                "UNTITLED"
                            )}

                        </h3>



                        <p>

                            ${escapeHTML(
                                project.description ||
                                ""
                            )}

                        </p>



                        <div
                            class="dynamic-project-info"
                        >

                            <span>

                                ${escapeHTML(
                                    project.technology ||
                                    "--"
                                )}

                            </span>


                            ${
                                hasDays

                                ?

                                `

                                <span>

                                    DAY
                                    ${escapeHTML(
                                        project.day
                                    )}
                                    /
                                    ${escapeHTML(
                                        project.totalDays
                                    )}

                                </span>

                                `

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

                `;

            }
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

            <div class="loading-state">
                NO UPDATES FOUND.
            </div>

        `;

        return;

    }


    container.innerHTML =

        updates.map(
            update => `

                <article
                    class="dynamic-update"
                >


                    <div class="update-day">

                        ${escapeHTML(
                            update.day || "--"
                        )}

                    </div>


                    <div class="update-content">


                        <h3>

                            ${escapeHTML(
                                update.title ||
                                "UNTITLED"
                            )}

                        </h3>


                        <p>

                            ${escapeHTML(
                                update.description ||
                                ""
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


    /*
        Treat the placeholder partner as
        "no partners yet".
    */

    const realPartners =
        partners.filter(
            partner =>
                partner.status !== "NOT FOUND"
        );


    if (realPartners.length === 0) {

        container.innerHTML = `

            <div class="partner-empty">

                <div class="partner-code">
                    404
                </div>

                <div class="partner-empty-text">

                    PARTNERS NOT FOUND.
                    <br><br>
                    NOTHING HERE YET.

                </div>

            </div>

        `;

        return;

    }


    container.innerHTML =

        realPartners.map(
            partner => `

                <article
                    class="dynamic-partner"
                >


                    <div class="partner-status">

                        ${escapeHTML(
                            partner.status ||
                            "ACTIVE"
                        )}

                    </div>


                    <h3>

                        ${escapeHTML(
                            partner.name ||
                            "UNKNOWN"
                        )}

                    </h3>


                    <p>

                        ${escapeHTML(
                            partner.description ||
                            ""
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
   RANDOM TERMINAL
   ========================================= */

const terminalMessages = [

    "loading creativity...",

    "compiling random ideas...",

    "searching for a good idea...",

    "making something weird...",

    "probably shouldn't work...",

    "building from scratch...",

    "project_status: UNKNOWN",

    "thinking...",

    "creating something unnecessary...",

    "what could possibly go wrong?",

    "touching code I probably shouldn't touch...",

    "inventing another project...",

    "turning coffee into code...",

    "checking if it works...",

    "it works. somehow."

];


function randomTerminalMessage() {

    const index =
        Math.floor(
            Math.random() *
            terminalMessages.length
        );


    return terminalMessages[index];

}


const changingTerminal =
    document.getElementById(
        "terminalChanging"
    );


function updateTerminalMessage() {

    if (!changingTerminal) {
        return;
    }


    changingTerminal.innerHTML = `

        <span>&gt;</span>

        ${escapeHTML(
            randomTerminalMessage()
        )}

    `;

}


setInterval(
    updateTerminalMessage,
    2800
);


/* =========================================
   SCROLL REVEAL
   ========================================= */

const revealElements =
    document.querySelectorAll(
        ".section, .featured-section, .final-section"
    );


const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(
                entry => {

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
            threshold: 0.08
        }

    );


revealElements.forEach(
    element => {

        revealObserver.observe(
            element
        );

    }
);


/* =========================================
   DATA ERROR
   ========================================= */

function showDataError() {

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
                        Make sure the files exist
                        inside the data/ folder.
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
    "================================="
);

console.log(
    " AXc / axc_notfound"
);

console.log(
    " interface v2"
);

console.log(
    "================================="
);


console.log(
    "> booting..."
);


loadAllData();


console.log(
    `> year: ${new Date().getFullYear()}`
);