

const db = new Dexie('ArticleDB');
db.version(1).stores({
    articles: '++id, url, datePublished, author, description, keywords, timestamp, wordCount, approximateReadingTimeInMinutes, site'
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveArticle').addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: extractArticle
        }, (results) => {
            console.log('results', results);
            const article = results[0].result;
            onScriptExecuted(article);
        });
    });

    function extractArticle() {
        console.log('document.title', document.title);
        console.log('document.body.innerText', document.body.innerText.slice(0, 100));

        const article = {
            url: window.location.href,
            title: document.title,
            datePublished: document.querySelector('meta[property="article:published_time"]')?.content || null,
            author: document.querySelector('meta[name="author"]')?.content || null,
            description: document.querySelector('meta[name="description"]')?.content || document.body.innerText.slice(0, 100) + '...',
            keywords: document.querySelector('meta[name="keywords"]')?.content || null,
            timestamp: new Date().toISOString(),
            wordCount: document.body.innerText.split(' ').length,
            approximateReadingTimeInMinutes: Math.round(document.body.innerText.split(' ').length / 250),
            site: window.location.protocol + '//' + window.location.hostname
        };

        return article;
    }

    function saveArticleToDB(article) {
        console.log('db', db);
        console.log('db.articles', db.articles);
        db.articles.add(article)
            .then(() => {
                console.log('Article saved to IndexedDB');
            })
            .catch((error) => {
                console.error('Error saving article to IndexedDB:', error);
            });
    }

    function onScriptExecuted(article) {
        console.log('onScriptExecuted', article);

        saveArticleToDB(article);

        const statusContainer = document.getElementById('savedMessage');
        statusContainer.innerHTML = '<span class="saved-message">Article saved!</span>';
    }
});