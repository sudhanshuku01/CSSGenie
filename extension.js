const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "cssgenie.extractClassNames",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No editor is active");
        return;
      }

      const document = editor.document;
      const text = document.getText();
      const classNames = extractClassNames(text);

      if (classNames.length === 0) {
        vscode.window.showInformationMessage("No class names found");
        return;
      }

      // Modify this part to generate CSS with extra line breaks
      const cssContent = classNames.map((cls) => `.${cls} {\n\n}`).join("\n");
      const cssFileName =
        path.basename(document.fileName, path.extname(document.fileName)) +
        ".css";
      const cssFilePath = path.join(
        path.dirname(document.fileName),
        cssFileName
      );

      fs.writeFile(cssFilePath, cssContent, (err) => {
        if (err) {
          vscode.window.showErrorMessage("Failed to create CSS file");
          return;
        }
        vscode.window.showInformationMessage(
          `CSS file created: ${cssFilePath}`
        );
      });
    }
  );

  context.subscriptions.push(disposable);
}

function extractClassNames(text) {
  const regex = /className\s*=\s*["' ]([^"']+)["' ]/g;
  const classNames = new Set();
  let match;

  while ((match = regex.exec(text)) !== null) {
    match[1].split(" ").forEach((cls) => classNames.add(cls));
  }

  return Array.from(classNames);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
