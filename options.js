let urls = [];
let urlStatuses = [];
let pollInterval = 5;

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();

  document.getElementById('urlInput').addEventListener("keyup", (event) => { if (event.key === "Enter"){addUrl();}});
  document.getElementById('addUrl').addEventListener('click', addUrl);
  document.getElementById('saveSettings').addEventListener('click', saveSettings);

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'statusUpdate') {
      urlStatuses = message.urlStatuses;
      updateURLList();
    }
  });
});

function addUrl() {
  const urlInput = document.getElementById('urlInput');
  const url = urlInput.value.trim();
  if (url && urls.length < 10) {
    urls.push(url);
    urlInput.value = '';
    updateURLList();
  }
}

function removeUrl(index) {
  urls.splice(index, 1); // Remove the URL at the given index
  urlStatuses.splice(index, 1); // Also remove the status for that URL
  updateURLList();
  saveToStorage(); // Save updated list
}

function saveSettings() {
  pollInterval = parseInt(document.getElementById('interval').value, 10);
  chrome.runtime.sendMessage({ action: 'updateURLs', urls, interval: pollInterval });
  saveToStorage();
}

function updateURLList() {
  const urlList = document.getElementById('urlList');
  urlList.innerHTML = '';
  urls.forEach((url, index) => {
    const listElement = document.createElement('li');
    listElement.className = 'list-group-item d-flex justify-content-between align-items-center ';

    const link = document.createElement('a');
    link.href = url;
    link.target = "_blank";
    link.className += 'text-decoration-none ';
    link.textContent = url;

    // Create the remove button
    const removeButton = document.createElement('button');
    removeButton.className += 'btn ';
    removeButton.className += 'btn-danger ';
    removeButton.className += 'float-end';
    removeButton.textContent = 'X';
    removeButton.addEventListener('click', () => removeUrl(index));

    listElement.appendChild(link);
    listElement.appendChild(removeButton);

    urlList.appendChild(listElement);
  });
}

function loadSettings() {
  chrome.storage.local.get(['urls', 'interval', 'urlStatuses'], (result) => {
    urls = result.urls || [];
    pollInterval = result.interval || 5;
    urlStatuses = result.urlStatuses || [];
    document.getElementById('interval').value = pollInterval;
    updateURLList();
  });
}

function saveToStorage() {
  chrome.storage.local.set({ urls, interval: pollInterval });
}
