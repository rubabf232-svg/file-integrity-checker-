const fileInput = document.getElementById("fileInput");
const checkBtn = document.getElementById("checkBtn");
const fileInfo = document.getElementById("fileInfo");
const result = document.getElementById("result");

fileInput.addEventListener("change", function () {

    const file = fileInput.files[0];

    if (!file) {
        fileInfo.textContent = "No file selected";
        return;
    }

    fileInfo.innerHTML = `
        <strong>File:</strong> ${file.name}<br>
        <strong>Size:</strong> ${formatFileSize(file.size)}
    `;

    result.textContent = "SHA-256 hash will appear here.";
});


checkBtn.addEventListener("click", async function () {

    const file = fileInput.files[0];

    if (!file) {
        result.textContent = "⚠️ Please select a file first.";
        return;
    }

    result.textContent = "⏳ Calculating SHA-256...";

    try {

        const buffer = await file.arrayBuffer();

        const hashBuffer = await crypto.subtle.digest(
            "SHA-256",
            buffer
        );

        const hashArray = Array.from(
            new Uint8Array(hashBuffer)
        );

        const hashHex = hashArray
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");

        result.innerHTML = `
            <strong>SHA-256:</strong><br><br>
            ${hashHex}
        `;

    } catch (error) {

        result.textContent =
            "❌ Unable to calculate file hash.";

        console.error(error);
    }
});


function formatFileSize(bytes) {

    if (bytes < 1024) {
        return bytes + " Bytes";
    }

    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
