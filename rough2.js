const fs = require('fs');
const { load } = require('cheerio');

// URL of the page you want to fetch
const href = 'https://spankbang.party/'; // Replace with the actual URL

async function fetchAndSaveHTML() {
    try {
        // Fetch the HTML content from the URL
        const response = await fetch(href);
        const body = await response.text();

        // Load the HTML into cheerio (optional step if you want to parse/modify it)
        const $ = load(body);

        // Optionally, you can manipulate the HTML here with cheerio if needed

        // Save the HTML content to a local file
        fs.writeFileSync('output.html', body);

        console.log('HTML saved to output.html');
    } catch (error) {
        console.error('Error fetching and saving HTML:', error);
    }
}

// Call the function to fetch and save the HTML
fetchAndSaveHTML();
