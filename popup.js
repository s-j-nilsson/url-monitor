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

    const link = document.createElement('a');
    link.href = url;
    link.target = "_blank";
    link.className += 'list-group-item list-group-item-action ';
    link.className += 'list-group-item-action ';
    link.className += urlStatuses[index] === 'up' ? 'list-group-item-success' : 'list-group-item-danger';
    link.textContent = url;

    const statusText = document.createTextNode(` - ${urlStatuses[index] || 'checking...'}`);

    link.appendChild(statusText);

    urlList.appendChild(link);
  });
}

function loadSettings() {
  chrome.storage.local.get(['urls', 'urlStatuses'], (result) => {
    urls = result.urls || [];
    urlStatuses = result.urlStatuses || [];
    updateURLList();
  });
}
