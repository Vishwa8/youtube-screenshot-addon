chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "screenshot") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: captureScreenshot
            });
        });
    }
});

// Function to capture the frame
function captureScreenshot() {
    let video = document.querySelector("video");
    if (!video) return alert("No video found!");

    // Create a canvas
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let ctx = canvas.getContext("2d");

    // Draw current video frame onto the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to Base64 image
    let imgUrl = canvas.toDataURL("image/png");

    // Create a new tab with an HTML page showing the image
    let htmlContent = `
        <html>
        <head><title>Screenshot</title></head>
        <body style="margin:0; display:flex; align-items:center; justify-content:center; height:100vh; background:black;">
            <img src="${imgUrl}" style="max-width:100%; max-height:100%; border:5px solid white;">
        </body>
        </html>
    `;

    // Convert the HTML to a Blob URL
    let blob = new Blob([htmlContent], { type: "text/html" });
    let blobUrl = URL.createObjectURL(blob);

    // Open the new tab with the image
    window.open(blobUrl, "_blank");
}
