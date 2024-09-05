let urls = [];
let urlStatuses = [];

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'statusUpdate') {
      urlStatuses = message.urlStatuses;
      updateURLList();
    }
  });
});

function updateURLList() {
  const urlList = document.getElementById('urlList');
  urlList.innerHTML = '';
  urls.forEach((url, index) => {
    const listItem = document.createElement('li');

    const link = document.createElement('a');
    link.href = url;
    link.target = "_blank";
    link.textContent = url;

    const statusText = document.createTextNode(` - ${urlStatuses[index] || 'checking...'}`);
    listItem.appendChild(link);
    listItem.appendChild(statusText);

    listItem.style.color = urlStatuses[index] === 'up' ? 'green' : 'red';
    urlList.appendChild(listItem);
  });
}

function loadSettings() {
  chrome.storage.local.get(['urls', 'urlStatuses'], (result) => {
    urls = result.urls || [];
    urlStatuses = result.urlStatuses || [];
    updateURLList();
  });
}
