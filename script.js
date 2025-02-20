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
    let headers = rows.shift(); // Remove header row
    thesaurus = {}; // Reset thesaurus object
    lastKnownBroader = null; // Reset last known broader term

    rows.forEach(row => {
        let broader = row[0]?.trim();
        let related = row[5]?.trim();
        let alternativeLabel = row[6]?.trim(); // USE FOR column

        // Ensure broader term is valid
        if (broader) {
            if (!thesaurus[broader]) {
                thesaurus[broader] = { broader: [], narrower: [], related: [], alternativeLabels: [] };
            }
            lastKnownBroader = broader; // Update the last known broader term
        } else {
            broader = lastKnownBroader; // Use the last known broader term if missing
        }

        // Loop through all narrower terms
        for (let i = 1; i <= 4; i++) {
            let narrower = row[i]?.trim();
            if (narrower) {
                if (!thesaurus[narrower]) {
                    thesaurus[narrower] = { broader: [], narrower: [], related: [], alternativeLabels: [] };
                }
                thesaurus[narrower].broader.push(broader);
                thesaurus[broader]?.narrower.push(narrower);
            }
        }

        // Add related terms
        if (related) {
            thesaurus[broader]?.related.push(related);
        }

        // Add alternative labels (USE FOR terms)
        if (alternativeLabel) {
            thesaurus[broader]?.alternativeLabels.push(alternativeLabel);
        }
    });

    console.log("Thesaurus Structure:", thesaurus); // Debugging Log
    displayHierarchy();
}
function displayHierarchy() {
    let hierarchyContainer = document.getElementById("hierarchy-view");
    hierarchyContainer.innerHTML = createHierarchyList(null, 0);
}

function createHierarchyList(parent, level) {
    let terms = Object.keys(thesaurus).filter(term => 
        (parent ? thesaurus[term].broader.includes(parent) : thesaurus[term].broader.length === 0)
    );
    if (terms.length === 0) return "";
    let content = "<ul>";
    terms.forEach(term => {
        content += `<li style="margin-left: ${level * 15}px; cursor: pointer; color: blue;" onclick="showDetails('${term}')">${term}</li>`;
        content += createHierarchyList(term, level + 1); // Recursively build hierarchy
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
    let { broader, narrower, related, alternativeLabels } = thesaurus[term];
    detailsContainer.innerHTML = `
        <div class="term-title"><strong>${term}</strong></div>
        <p><strong>Broader Terms:</strong> ${broader.length ? broader.join(", ") : "None"}</p>
        <p><strong>Narrower Terms:</strong> ${narrower.length ? narrower.join(", ") : "None"}</p>
        <p><strong>Related Terms:</strong> ${related.length ? related.join(", ") : "None"}</p>
        <p><strong>USE FOR:</strong> ${alternativeLabels.length ? alternativeLabels.join(", ") : "None"}</p>
    `;
}

// Load CSV after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    loadCSV();
});
