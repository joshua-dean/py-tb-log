/**
 * @fileoverview Commands for python-traceback-logger vscode extension.
 */
import * as vscode from 'vscode';

/**
 * Test that the extension is loaded.
 */
async function testLoaded() {
    vscode.window.showInformationMessage('testLoaded invoked')
    vscode.window.showInformationMessage("bruh");
}


/**
 * Delete all instances of "tb_logger.log" from the active editor.
 */
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


/**
 * Color the first line of the active editor purple.
 */
async function colorFirstLinePurple() {
    vscode.window.showInformationMessage('colorFirstLine invoked')
    const editor = vscode.window.activeTextEditor;

    editor?.setDecorations(vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255,0,255,0.3)',
        overviewRulerColor: 'rgba(255,0,255,1)',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        isWholeLine: true
    }), [new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 10))]);
}













const ALL_COMMANDS: Object = {
    testLoaded,
    deleteAllLogs,
    colorFirstLinePurple
};


export {
    ALL_COMMANDS
};