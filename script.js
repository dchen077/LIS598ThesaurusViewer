async function loadCSV() {
    const csvURL = 'https://raw.githubusercontent.com/dchen077/LIS598ThesaurusViewer/main/thesaurus.csv';

    try {
        const response = await fetch(csvURL);
        if (!response.ok) throw new Error("Failed to fetch CSV file.");
        
        const csvText = await response.text();
        processCSV(csvText);
    } catch (error) {
        console.error("Error loading CSV:", error);
        document.getElementById("thesaurus-view").innerHTML = "<p style='color: red;'>Failed to load thesaurus data.</p>";
    }
}

function processCSV(csvText) {
    let rows = csvText.trim().split("\n").map(row => row.split(","));
    let headers = rows.shift(); // Remove header row
    let thesaurus = {};

    // Step 1: Parse CSV into a hierarchical structure
    rows.forEach(row => {
        let term = row[0]?.trim();
        let alternativeLabel = row[1]?.trim() || "None";
        let broader = row[2]?.trim() || null;
        let relatedTerms = row[3]?.trim() ? row[3].split(";").map(t => t.trim()) : [];

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

    // Step 2: Identify root terms (terms with no Broader Term)
    let rootTerms = Object.values(thesaurus).filter(term => !term.broader);
    
    // Step 3: Display hierarchy
    let container = document.getElementById("thesaurus-view");
    container.innerHTML = ""; // ✅ Clears "Loading..." text at the right time
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

        // Add related terms info
        if (termObj.related.length > 0) {
            let relatedDiv = document.createElement("div");
            relatedDiv.style.fontSize = "12px


