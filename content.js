// Erstelle das Overlay-Element
const overlay = document.createElement('div');
overlay.id = 'wdynif-overlay';
overlay.innerHTML = `
    <h1>What do you need it for?</h1>
    <input id="reasonInput" type="text" placeholder="reason..." class="reason" autofocus/><br><br>
    <button id="close-button" class="close-button">No reason. Close.</button><br><br>
    <h2>How long will you need it?</h2>
    <div class="duration-container">
        <button value=60 class="duration-button">1 min</button>
        <button value=180 class="duration-button">3 min</button>
        <button value=300 class="duration-button">5 min</button>
        <button value=600 class="duration-button">10 min</button>
        <button value=900 class="duration-button">15 min</button>
        <button value=1800 class="duration-button">30 min</button>
        <button value=3600 class="duration-button">1 h</button>
        <button id="indefinite-duration" class="danger-zone">∞</button>
    </div>
    <p id="errorDisplay"></p>
`;
document.body.appendChild(overlay);

browser.runtime.sendMessage({action: 'getTabId'})


function hideOverlay() {
    console.log("Overlay hidden")
    overlay.style.display = "none";
}

function showOverlay() {
    console.log("Overlay shown")
    overlay.style.display = "flex";
}

browser.runtime.onMessage.addListener((message) => {
    if (message.action == "showOverlay") {
        showOverlay();
    } else if (message.action == "hideOverlay") {
        hideOverlay();
    } else if (message.action == "setTabId") {
        const tabId = message.tabId;
        console.log(tabId);
        browser.storage.local.get('tabIds').then((result) => {
            const tabIds = result.tabIds || [];
            if(tabIds.indexOf(tabId) == -1) {showOverlay()}
        })
    }
})

function setDuration(duration) {
        const reason = document.getElementById('reasonInput').value

        if (!reason) {
            const errorDisplay = document.getElementById('errorDisplay')
            errorDisplay.innerHTML = "You need to give a reason before proceeding..."
            return
        }


        console.log('Set tab duration for ' + window.location.href + " to " + duration + ' seconds.');
        browser.runtime.sendMessage({
          action: 'setDuration',
          duration: duration,
          reason: reason
        });
  }
  
  
  
Array.from(document.getElementsByClassName('duration-button')).forEach(button => {
    let value = button.value;
    button.addEventListener('click', function(){
      setDuration(value)
    })
});
  
document.getElementById('indefinite-duration').addEventListener('click', function() {
    const reason = document.getElementById('reasonInput').value

    if (!reason) {
        const errorDisplay = document.getElementById('errorDisplay')
        errorDisplay.innerHTML = "You need to give a reason before proceeding..."
        return
    }
    setDuration("indefinite")
    hideOverlay()
 })

document.getElementById('close-button').addEventListener('click', function() {
    browser.runtime.sendMessage({ action: "closeTab" });
})