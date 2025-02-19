async function loadCSV() {
    const csvURL = 'https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO/main/thesaurus.csv';
    const response = await fetch(csvURL);
    const csvText = await response.text();
    processCSV(csvText);
}

function processCSV(csvText) {
    let rows = csvText.trim().split("\n").map(row => row.split(","));
    if (rows.length === 0) {
        console.error('CSV is empty or malformed');
        return;
    }

    let headers = rows.shift(); // Extract headers
    let thesaurus = {};

    // Step 1: Convert CSV into a dictionary
    rows.forEach(row => {
        let term = row[0]?.trim();
        let broader = row[2]?.trim() || null;

        if (!term) return;

        if (!thesaurus[term]) {
            thesaurus[term] = { name: term, broader: broader, narrower: [] };
        } else {
            thesaurus[term].broader = broader;
        }

        if (broader) {
            if (!thesaurus[broader]) {
                thesaurus[broader] = { name: broader, narrower: [] };
            }
            thesaurus[broader].narrower.push(term);
        }
    });

    // Step 2: Identify root terms (no broader term)
    let rootTerms = Object.values(thesaurus).filter(term => !term.broader);

    // Step 3: Display hierarchy
    let container = document.getElementById("hierarchy-view");
    if (container) {
        displayHierarchy(rootTerms, thesaurus, container, 0);
    } else {
        console.error('Container element not found');
    }
}

function displayHierarchy(terms, thesaurus, container, level) {
    terms.forEach(termObj => {
        let termDiv = document.createElement("div");
        let subContainer = document.createElement("div");

        termDiv.classList.add("term");
        termDiv.style.marginLeft = `${level * 20}px`; // Indent based on hierarchy level
        termDiv.textContent = "▶ " + termObj.name;
        termDiv.style.cursor = "pointer";

        subContainer.style.display = "none"; // Initially hidden

        termDiv.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent event bubbling
            subContainer.style.display = subContainer.style.display === "block" ? "none" : "block";
            termDiv.textContent = subContainer.style.display === "block" ? "▼ " + termObj.name : "▶ " + termObj.name;

            // Update the details view
            updateDetailsView(termObj, thesaurus);
        });

        if (termObj.narrower.length > 0) {
            let subTerms = termObj.narrower.map(termName => thesaurus[termName]);
            displayHierarchy(subTerms, thesaurus, subContainer, level + 1);
        }

        container.appendChild(termDiv);
        container.appendChild(subContainer);
    });
}

function updateDetailsView(termObj, thesaurus) {
    const detailsView = document.getElementById("details-view");
    if (!detailsView) return;

    // Clear previous content
    detailsView.innerHTML = "";

    // Add term name
    const termName = document.createElement("h2");
    termName.textContent = termObj.name;
    detailsView.appendChild(termName);

    // Add broader term
    if (termObj.broader) {
        const broaderTerm = document.createElement("p");
        broaderTerm.textContent = `Broader Term: ${termObj.broader}`;
        detailsView.appendChild(broaderTerm);
    } else {
        const broaderTerm = document.createElement("p");
        broaderTerm.textContent = "Broader Term: None (Root Term)";
        detailsView.appendChild(broaderTerm);
    }

    // Add narrower terms
    if (termObj.narrower.length > 0) {
        const narrowerTerms = document.createElement("p");
        narrowerTerms.textContent = `Narrower Terms: ${termObj.narrower.join(", ")}`;
        detailsView.appendChild(narrowerTerms);
    } else {
        const narrowerTerms = document.createElement("p");
        narrowerTerms.textContent = "Narrower Terms: None";
        detailsView.appendChild(narrowerTerms);
    }
}

window.onload = loadCSV;
