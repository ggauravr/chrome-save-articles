// Create a new Dexie database
const db = new Dexie('ArticleDB');
db.version(1).stores({
    articles: '++id, url, datePublished, author, description, keywords, timestamp, wordCount, approximateReadingTimeInMinutes, site'
});

// Function to fetch articles from the database and display them
async function displayArticles() {
    try {
        const articles = await db.articles.toArray(); // Fetch all articles
        console.log('articles', articles);
        const tableBody = document.getElementById('articlesTableBody');

        // Clear existing rows
        tableBody.innerHTML = '';

        // Populate the table with articles
        articles.forEach(article => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="border border-gray-300 p-2">${article.url}</td>
                <td class="border border-gray-300 p-2">${article.datePublished || 'N/A'}</td>
                <td class="border border-gray-300 p-2">${article.author || 'N/A'}</td>
                <td class="border border-gray-300 p-2">${article.description || 'N/A'}</td>
                <td class="border border-gray-300 p-2">${article.keywords || 'N/A'}</td>
                <td class="border border-gray-300 p-2">
                    <button class="text-red-500" onclick="deleteArticle('${article.url}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
}

// Function to delete an article from the database
async function deleteArticle(id) {
    try {
        await db.articles.delete(id);
        displayArticles(); // Refresh the article list
    } catch (error) {
        console.error('Error deleting article:', error);
    }
}

// Call the function to display articles when the page loads
document.addEventListener('DOMContentLoaded', displayArticles);