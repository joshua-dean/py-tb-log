/**
 * @fileoverview Commands for python-traceback-logger vscode extension.
 */
import * as vscode from 'vscode';


async function testLoaded() {
    vscode.window.showInformationMessage('testLoaded invoked')
    vscode.window.showInformationMessage("bruh");
}


async function deleteAllLogs() {
    vscode.window.showInformationMessage('deleteAllLogs invoked')
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        vscode.window.showInformationMessage('editor exists')
        const document = editor.document;
        const text = document.getText();
        const new_text = text.replace(/tb_logger.log/g, "");
        const full_range = new vscode.Range(
            document.positionAt(0),
            document.positionAt(text.length)
        );
        await editor.edit(editBuilder => {
            editBuilder.replace(full_range, new_text);
        });
    }

}













const ALL_COMMANDS: Object = {
    testLoaded,
    deleteAllLogs
};


export {
    ALL_COMMANDS
};