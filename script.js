async function loadCSV() {
    const csvURL = 'https://raw.githubusercontent.com/dchen077/LIS598ThesaurusViewer/main/thesaurus.csv';
    const response = await fetch(csvURL);
    const csvText = await response.text();
    processCSV(csvText);
}

function processCSV(csvText) {
    let rows = csvText.trim().split("\n").map(row => row.split(","));
    let headers = rows.shift();
    let thesaurus = {};

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

    let rootTerms = Object.values(thesaurus).filter(term => !term.broader);
    displayHierarchy(rootTerms, thesaurus, document.getElementById("thesaurus-view"));
}

function displayHierarchy(terms, thesaurus, container) {
    container.innerHTML = "";
    terms.forEach(termObj => {
        let termDiv = document.createElement("div");
        let subContainer = document.createElement("div");

        termDiv.classList.add("term");
        termDiv.textContent = termObj.name;
        subContainer.classList.add("hidden");

        termDiv.onclick = () => {
            subContainer.classList.toggle("hidden");
        };

        if (termObj.narrower.length > 0) {
            let subTerms = termObj.narrower.map(termName => thesaurus[termName]);
            displayHierarchy(subTerms, thesaurus, subContainer);
        }

        container.appendChild(termDiv);
        container.appendChild(subContainer);
    });
}

window.onload = loadCSV;
