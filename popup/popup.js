

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveArticle').addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: saveArticleContent
        }, (results) => {
            onScriptExecuted(results);
        });
    });

    function saveArticleContent() {
        console.log('document.title', document.title);
        console.log('document.body.innerText', document.body.innerText.slice(0, 100));

        const article = {
            title: document.title,
            url: window.location.href,
            content: document.body.innerText,
            savedAt: new Date().toISOString()
        };

        chrome.storage.local.get(['savedArticles'], (result) => {
            console.log('result', result);
            const savedArticles = result.savedArticles || [];
            savedArticles.push(article);
            
            chrome.storage.local.set({ savedArticles }, () => {
                chrome.storage.local.get(['savedArticles'], (result) => {
                    console.log('result2', result);
                });
                // TODO: Add a message to the status container
            });
        });
    }

    function onScriptExecuted(results) {
        console.log('onScriptExecuted', results);
        const statusContainer = document.getElementById('savedMessage');
        statusContainer.innerHTML = '<span class="saved-message">Article saved!</span>';
    }
});