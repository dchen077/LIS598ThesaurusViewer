let thesaurus = {}; // ✅ Global thesaurus object

async function loadCSV() {
    const csvURL = 'https://raw.githubusercontent.com/dchen077/LIS598ThesaurusViewer/main/thesaurus.csv';
    console.log("Fetching CSV from:", csvURL);

    try {
        const response = await fetch(csvURL);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const csvText = await response.text();
        processCSV(csvText);
    } catch (error) {
        console.error("❌ Error loading CSV:", error);
        document.getElementById("hierarchy-view").innerHTML = "<p style='color: red;'>Failed to load thesaurus data.</p>";
    }
}

function processCSV(csvText) {
    let rows = csvText.trim().split(/\r?\n/).map(row => row.split(","));
    let headers = rows.shift(); 

    thesaurus = {}; // Reset thesaurus object
    rows.forEach(row => {
        let term = row[0].trim();
        let broader = row[1]?.trim() || "";
        let related = row[2]?.trim() || "";

        if (!thesaurus[term]) thesaurus[term] = { broader: [], related: [], narrower: [] };
        if (broader) {
            if (!thesaurus[broader]) thesaurus[broader] = { broader: [], related: [], narrower: [] };
            thesaurus[broader].narrower.push(term);
            thesaurus[term].broader.push(broader);
        }
        if (related) thesaurus[term].related.push(related);
    });

    displayHierarchy();
}

function displayHierarchy() {
    let hierarchyContainer = document.getElementById("hierarchy-view");
    hierarchyContainer.innerHTML = createHierarchyList(null, 0);
}

function createHierarchyList(parent) {
    let terms = Object.keys(thesaurus).filter(term => 
        (parent ? thesaurus[term].broader.includes(parent) : thesaurus[term].broader.length === 0)
    );

    if (terms.length === 0) return "";

    let content = "<ul>";
    terms.forEach(term => {
        content += `<li>${term}`;
        let subList = createHierarchyList(term); // Recursively build nested structure
        if (subList) content += subList;
        content += "</li>";
    });
    content += "</ul>";

    return content;
}

function showDetails(term) {
    let detailsContainer = document.getElementById("details-view");

    if (!thesaurus[term]) {
        detailsContainer.innerHTML = "No details available.";
        return;
    }

    let { broader, narrower, related } = thesaurus[term];
    detailsContainer.innerHTML = `
        <div class="term-title">${term}</div>
        <p><strong>Broader Terms:</strong> ${broader.length ? broader.join(", ") : "None"}</p>
        <p><strong>Narrower Terms:</strong> ${narrower.length ? narrower.join(", ") : "None"}</p>
        <p><strong>Related Terms:</strong> ${related.length ? related.join(", ") : "None"}</p>
    `;
}

// Load CSV after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    loadCSV();
});
