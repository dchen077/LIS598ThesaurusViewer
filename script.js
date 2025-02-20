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

    rows.forEach(row => {
        let broader = row[0]?.trim() || ""; 
        let narrower1 = row[1]?.trim() || "";
        let narrower2 = row[2]?.trim() || "";
        let narrower3 = row[3]?.trim() || "";
        let related = row[4]?.trim() || "";
        let alternativeLabel = row[5]?.trim() || ""; // USE FOR column

        function addTerm(broader, narrower) {
            if (narrower) {
                if (!thesaurus[narrower]) {
                    thesaurus[narrower] = { name: narrower, broader: [], narrower: [], related: [], alternative: "None" };
                }
                thesaurus[narrower].broader.push(broader);
                if (broader && thesaurus[broader]) {
                    thesaurus[broader].narrower.push(narrower);
                }
            }
        }

        // Ensure broader term exists in thesaurus
        if (broader) {
            if (!thesaurus[broader]) {
                thesaurus[broader] = { name: broader, broader: [], narrower: [], related: [], alternative: "None" };
            }
        }

        // Correctly assign broader-narrower relationships
        addTerm(broader, narrower1);
        addTerm(narrower1, narrower2);
        addTerm(narrower2, narrower3);

        // Add related terms
        if (related) {
            thesaurus[broader]?.related.push(related);
            thesaurus[narrower1]?.related.push(related);
            thesaurus[narrower2]?.related.push(related);
            thesaurus[narrower3]?.related.push(related);
        }

        // Add alternative labels (USE FOR terms)
        if (alternativeLabel) {
            thesaurus[broader]?.alternative = alternativeLabel;
            thesaurus[narrower1]?.alternative = alternativeLabel;
            thesaurus[narrower2]?.alternative = alternativeLabel;
            thesaurus[narrower3]?.alternative = alternativeLabel;
        }
    });

    displayHierarchy(Object.values(thesaurus), thesaurus, document.getElementById("hierarchy-view"), 0);
}

function displayHierarchy(terms, thesaurus, container, level) {
    terms.forEach(termObj => {
        let termDiv = document.createElement("div");
        let subContainer = document.createElement("div");

        termDiv.classList.add("term");
        termDiv.style.marginLeft = `${level * 20}px`; // Indent based on hierarchy level
        termDiv.innerHTML = `<strong>▶ ${termObj.name}</strong>`;

        if (termObj.alternative !== "None") {
            termDiv.innerHTML += ` <span style="color: gray;">(${termObj.alternative})</span>`;
        }

        termDiv.style.cursor = "pointer";
        subContainer.style.display = "none"; // Initially hidden

        termDiv.onclick = () => {
            subContainer.style.display = subContainer.style.display === "block" ? "none" : "block";
            termDiv.innerHTML = subContainer.style.display === "block" 
                ? `<strong>▼ ${termObj.name}</strong>` 
                : `<strong>▶ ${termObj.name}</strong>`;

            if (termObj.alternative !== "None") {
                termDiv.innerHTML += ` <span style="color: gray;">(${termObj.alternative})</span>`;
            }

            // ✅ Show details in right panel when clicked
            showDetails(termObj.name);
        };

        // ✅ Recursively render narrower terms
        if (termObj.narrower.length > 0) {
            let subTerms = termObj.narrower.map(termName => thesaurus[termName]);
            displayHierarchy(subTerms, thesaurus, subContainer, level + 1);
        }

        container.appendChild(termDiv);
        container.appendChild(subContainer);
    });
}

function showDetails(term) {
    let detailsContainer = document.getElementById("details-view");

    if (!thesaurus[term]) {
        detailsContainer.innerHTML = "No details available.";
        return;
    }

    let { broader, narrower, related, alternative } = thesaurus[term];
    detailsContainer.innerHTML = `
        <div class="term-title" style="font-weight: bold;">${term}</div>
        <p><strong>Broader Terms:</strong> ${broader.length ? broader.join(", ") : "None"}</p>
        <p><strong>Narrower Terms:</strong> ${narrower.length ? narrower.join(", ") : "None"}</p>
        <p><strong>Related Terms:</strong> ${related.length ? related.join(", ") : "None"}</p>
        <p><strong>USE FOR:</strong> ${alternative !== "None" ? alternative : "None"}</p>
    `;
}

// Load CSV after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    loadCSV();
});
