async function loadCSV() {
    const csvURL = 'https://raw.githubusercontent.com/dchen077/LIS598ThesaurusViewer/main/thesaurus.csv';
    console.log("Fetching CSV from:", csvURL);

    try {
        const response = await fetch(csvURL);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const csvText = await response.text();
        console.log("✅ CSV Loaded Successfully!");
        console.log("CSV Content:\n", JSON.stringify(csvText));  // ✅ Logs raw CSV data safely

        processCSV(csvText);
    } catch (error) {
        console.error("❌ Error loading CSV:", error);
        document.getElementById("thesaurus-view").innerHTML = "<p style='color: red;'>Failed to load thesaurus data.</p>";
    }
}

function processCSV(csvText) {
    console.log("Processing CSV Data...");

    // Ensure CSV is split properly
    let rows = csvText.trim().split(/\r?\n/).map(row => row.split(","));
    console.log("Parsed Rows:", rows);

    let headers = rows.shift();
    console.log("CSV Headers:", headers);

    let thesaurus = {};

    rows.forEach(row => {
        if (row.length < 1) return; // Ignore empty rows

        let term = row[0]?.trim();
        let alternativeLabel = row[1]?.trim() || "None";
        let broader = row[2]?.trim() || null;
        let relatedTerms = row[3]?.trim() ? row[3].split(";").map(t => t.trim()) : [];

        console.log(`Processing Term: ${term}, Broader: ${broader}, Related: ${relatedTerms}`);

        if (!term) return;

        if (!thesaurus[term]) {
            thesaurus[term] = { 
                name: term, 
                alternative: alternativeLabel, 
                broader: broader, 
                related: relatedTerms, 
                narrower: [] 
            };
        } else {
            thesaurus[term].broader = broader;
            thesaurus[term].alternative = alternativeLabel;
            thesaurus[term].related = relatedTerms;
        }

        if (broader) {
            if (!thesaurus[broader]) {
                thesaurus[broader] = { name: broader, narrower: [] };
            }
            thesaurus[broader].narrower.push(term);
        }
    });

    console.log("✅ Final Thesaurus Structure:", thesaurus);

    let rootTerms = Object.values(thesaurus).filter(term => !term.broader);
    
    let container = document.getElementById("thesaurus-view");
    container.innerHTML = "";
    displayHierarchy(rootTerms, thesaurus, container, 0);
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
        };

        // ✅ Fix: Properly add related terms to the container
        if (termObj.related.length > 0) {
            let relatedDiv = document.createElement("div");
            relatedDiv.style.fontSize = "12px";
            relatedDiv.style.color = "gray";
            relatedDiv.style.marginLeft = `${(level + 1) * 20}px`;
            relatedDiv.innerHTML = `<em>Related: ${termObj.related.join(", ")}</em>`;
            container.appendChild(relatedDiv); // ✅ Now relatedDiv is added to the DOM!
        }

        // ✅ Fix: Recursively render narrower terms
        if (termObj.narrower.length > 0) {
            let subTerms = termObj.narrower.map(termName => thesaurus[termName]);
            displayHierarchy(subTerms, thesaurus, subContainer, level + 1);
        }

        container.appendChild(termDiv);
        container.appendChild(subContainer);
    });
} // ✅ Ensure function ends properly!
