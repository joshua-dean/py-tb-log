/**
 * @fileoverview vscode utils
 */
import * as vscode from 'vscode';

/**
 * Get the matches of a regex in the current editor. 
 * @param regex Regex to match
 * @returns Array of ranges of matches
 */
export function matchesInCurrentEditor(
    regex: RegExp
): Array<vscode.Range> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return [];

    const document = editor.document;
    const text = document.getText();
    const matches: Array<vscode.Range> = [];
    let match;
    while (match = regex.exec(text)) {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        const range = new vscode.Range(startPos, endPos);
        matches.push(range);
    }
    return matches;
}

/**
 * Get the decoration options for the matches of a regex in the current editor. 
 * setDecorations also accepts ranges so this shouldn't be necessary for that.
 * 
 * @param regex Regex to match
 * @returns Array of decoration options for the matches
 */
export function decorationOptionsForMatchesInCurrentEditor(
    regex: RegExp
): Array<vscode.DecorationOptions> {
    const matches = matchesInCurrentEditor(regex);
    const decorationOptions: Array<vscode.DecorationOptions> = [];
    for(let match of matches) {
        decorationOptions.push({ range: match });
    }
    return decorationOptions;
}







