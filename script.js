async function loadCSV() {
    const csvURL = 'https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO/main/thesaurus.csv';
    const response = await fetch(csvURL);
    const csvText = await response.text();
    processCSV(csvText);
}
function displayHierarchy(terms, thesaurus, container, level) {
    terms.forEach(termObj => {
        let termDiv = document.createElement("div");
        let subContainer = document.createElement("div");

        termDiv.classList.add("term");
        termDiv.style.marginLeft = `${level * 20}px`; // Indent based on hierarchy level
        termDiv.textContent = termObj.name;
        termDiv.style.cursor = "pointer";

        subContainer.style.display = "none"; // Initially hidden

        termDiv.onclick = () => {
            subContainer.style.display = subContainer.style.display === "block" ? "none" : "block";
            termDiv.classList.toggle("expanded");
        };

        if (termObj.narrower.length > 0) {
            let subTerms = termObj.narrower.map(termName => thesaurus[termName]);
            displayHierarchy(subTerms, thesaurus, subContainer, level + 1);
        }

        container.appendChild(termDiv);
        container.appendChild(subContainer);
    });
}
window.onload = loadCSV;
