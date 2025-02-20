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
    let lastKnownBroader = null; // Track the last known broader term

    rows.forEach(row => {
        let broader = row[0]?.trim() || lastKnownBroader; // Use last known broader if empty
        let narrower1 = row[1]?.trim() || "";
        let narrower2 = row[2]?.trim() || "";
        let narrower3 = row[3]?.trim() || "";
        let related = row[4]?.trim() || "";
        let alternativeLabel = row[5]?.trim() || ""; // USE FOR column

        if (broader) {
            if (!thesaurus[broader]) {
                thesaurus[broader] = { broader: [], narrower: [], related: [], alternativeLabels: [] };
            }
            lastKnownBroader = broader; // Update the last known broader term
        }

        // Process hierarchy correctly
        if (narrower1) {
            if (!thesaurus[narrower1]) {
                thesaurus[narrower1] = { broader: [], narrower: [], related: [], alternativeLabels: [] };
            }
            thesaurus[narrower1].broader.push(broader);
            thesaurus[broader]?.narrower.push(narrower1);
        }

        if (narrower2) {
            if (!thesaurus[narrower2]) {
                thesaurus[narrower2] = { broader: [], narrower: [], related: [], alternativeLabels: [] };
            }
            thesaurus[narrower2].broader.push(narrower1);
            thesaurus[narrower1]?.narrower.push(narrower2);
        }

        if (narrower3) {
            if (!thesaurus[narrower3]) {
                thesaurus[narrower3] = { broader: [], narrower: [], related: [], alternativeLabels: [] };
            }
            thesaurus[narrower3].broader.push(narrower2);
            thesaurus[narrower2]?.narrower.push(narrower3);
        }

        // Add related terms
        if (related) {
            thesaurus[broader]?.related.push(related);
            thesaurus[narrower1]?.related.push(related);
            thesaurus[narrower2]?.related.push(related);
            thesaurus[narrower3]?.related.push(related);
        }

        // Add alternative labels (USE FOR terms)
        if (alternativeLabel) {
            thesaurus[broader]?.alternativeLabels.push(alternativeLabel);
            thesaurus[narrower1]?.alternativeLabels.push(alternativeLabel);
            thesaurus[narrower2]?.alternativeLabels.push(alternativeLabel);
            thesaurus[narrower3]?.alternativeLabels.push(alternativeLabel);
        }
    });

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
        <div class="term-title">${term}</div>
        <p><strong>BT:</strong> ${broader.length ? broader.join(", ") : "None"}</p>
        <p><strong>USE FOR:</strong> ${alternativeLabels.length ? alternativeLabels.join(", ") : "None"}</p>
    `;
}

// Load CSV after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    loadCSV();
});
