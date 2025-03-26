function addScreenshotButton() {
    let controls = document.querySelector(".ytp-left-controls"); // Locate the left control bar
    if (!controls) {
        setTimeout(addScreenshotButton, 1000); // Retry if not available
        return;
    }

    // Prevent duplicate buttons
    if (document.getElementById("yt-screenshot-btn")) return;

    // Locate the time display element
    let timeDisplay = controls.querySelector(".ytp-time-display");
    if (!timeDisplay) {
        setTimeout(addScreenshotButton, 1000); // Retry if not found
        return;
    }

    // Create screenshot button
    let btn = document.createElement("button");
    btn.id = "yt-screenshot-btn";
    btn.className = "ytp-button"; // YouTube's button class for styling

    // Add the camera SVG icon inside the button
    btn.innerHTML = `
        <svg height="24" width="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9m3 5a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3Z"/>
        </svg>
    `;

    // Style the button to center vertically
    btn.style.cssText = `
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        margin-left: 8px; /* Space between time display and screenshot button */
        align-self: center; /* Center vertically in the flex container */
    `;

    // Add click event to capture the screenshot
    btn.onclick = () => {
        // Send message to chrome extension (if needed)
        chrome.runtime.sendMessage({ action: "screenshot" }, (response) => {
            if (response && response.success) {
                console.log("Screenshot captured!");
            } else {
                console.error("Failed to capture screenshot.");
            }
        });
    };

    // Insert the button right after the time display element
    timeDisplay.insertAdjacentElement("afterend", btn);
}

// Observe UI changes to re-add the button if removed
const observer = new MutationObserver(() => {
    addScreenshotButton();
});
observer.observe(document.body, { childList: true, subtree: true });

addScreenshotButton();
