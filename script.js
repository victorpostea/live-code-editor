// Ensure DOM is fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
    let editor; // Declare editor globally
    const previewFrame = document.getElementById("preview");

    // Function to update preview iframe
    function updatePreview() {
        if (!editor) return; // Prevent errors if Monaco isn't ready yet

        const previewDoc = previewFrame.contentDocument || 
previewFrame.contentWindow.document;
        previewDoc.open();
        previewDoc.write(editor.getValue());
        previewDoc.close();
    }

    // Load Monaco Editor
    require.config({ paths: { vs: 
"https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs" } });
    require(["vs/editor/editor.main"], function () {
        editor = monaco.editor.create(document.getElementById("editor-container"), {
            value: `<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; }
    </style>
</head>
<body>
    <h1>Hello World</h1>
    <p>Edit the code and see changes here!</p>
    <script>
        console.log('JS is running');
    </script>
</body>
</html>`,
            language: "html",
            theme: "vs-dark",
            automaticLayout: true
        });

        // Load last session (if available)
        const savedCode = localStorage.getItem("savedCode");
        if (savedCode) editor.setValue(savedCode);

        // Update preview only after Monaco is ready
        updatePreview();

        // Attach event listener for live updates
        editor.onDidChangeModelContent(() => {
            updatePreview();
        });

        // Auto-save every 2 seconds
        setInterval(() => localStorage.setItem("savedCode", editor.getValue()), 2000);
    });

    // Attach event listeners only if elements exist
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            if (!editor) return; // Ensure editor exists before changing theme
            const newTheme = editor._themeService._theme.id === "vs-dark" ? "vs-light" 
: "vs-dark";
            monaco.editor.setTheme(newTheme);
        });
    }

});

