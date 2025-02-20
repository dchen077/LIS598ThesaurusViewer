async function loadCSV() {
    const csvURL = 'https://raw.githubusercontent.com/dchen077/LIS598ThesaurusViewer/main/thesaurus.csv';
    console.log("Fetching CSV from:", csvURL);

    try {
        const response = await fetch(csvURL);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const csvText = await response.text();
        console.log("✅ CSV Loaded Successfully!");
        console.log("CSV Content (First 500 chars):", csvText.substring(0, 500)); // Logs a preview of CSV

        processCSV(csvText);
    } catch (error) {
        console.error("❌ Error loading CSV:", error);
        document.getElementById("thesaurus-view").innerHTML = "<p style='color: red;'>Failed to load thesaurus data.</p>";
        
        if (error.message.includes('CORS')) {
            console.warn("Possible CORS issue. Try hosting the CSV on a different server.");
        }
    }
}

function processCSV(csvText) {
    console.log("Processing CSV Data...");

    let rows = csvText.trim().split(/\r?\n/).map(row => row.split(","));
    console.log("Parsed Rows (Preview):", rows.slice(0, 5)); // Log only the first 5 rows for debugging

    let headers = rows.shift(); // Extract headers
    console.log("CSV Headers:", headers);

    let content = '<ul>';
    rows.forEach(row => {
        content += '<li><strong>' + row[0] + ':</strong> ' + (row.slice(1).join(", ") || "No synonyms") + '</li>';
    });
    content += '</ul>';

    document.getElementById("thesaurus-view").innerHTML = content;
}

// Ensure script runs when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    console.log("📌 DOM Loaded. Initiating CSV Load...");
    loadCSV();
});
