/**
 * @file extension.ts
 * @fileoverview Entry point for the python-traceback-logger vscode extension.
 */
import * as vscode from 'vscode';
import { ALL_COMMANDS } from './commands';
import { EXTENSION_ID } from './constants';
import { matchesInCurrentEditor } from './utils/vscode_utils';

/*
I'm not entirely sure how language servers work, so I'm not sure if I can tap into whatever one
is already runnning and use that for type checking. 
If not, we'd have to bundle an existing language server or something.

Type checking would be nice, but in reality isn't needed for this application.
Git history and a record of the logs is sufficient for the desired functionality.
*/

/**
 * Activate the extension. 
 * @param context VSCode extension context
 */
export function activate(context: vscode.ExtensionContext) {
    console.log(
        `${EXTENSION_ID} activated. Commands: [${Object.keys(ALL_COMMANDS).join(', ')}]`
    )

    // Register all commands
    for (let [command_name, command] of Object.entries(ALL_COMMANDS)) {
        context.subscriptions.push(
            vscode.commands.registerCommand(
                `${EXTENSION_ID}.${command_name}`,
                command
            )
        );
    }

    let redHighlightDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: 'rgba(255,0,0,0.7)',
        overviewRulerColor: 'rgba(255,0,0,1)',
        overviewRulerLane: vscode.OverviewRulerLane.Right,
        isWholeLine: false,
    });


    /**
     * Color all cases of 'tb_logger.log' in the active editor red.
     */
    function updateHighlights() {
        let ranges = matchesInCurrentEditor(/tb_logger.log/g);
        vscode.window.activeTextEditor?.setDecorations(
            redHighlightDecorationType,
            ranges
        );
    }


    /**
     * Update the hover provider.
     */
    function updateHover() {
        vscode.languages.registerHoverProvider('python', {
            async provideHover(document, position, token) {
                const range = document.getWordRangeAtPosition(position);
                const word = document.getText(range);
                return new vscode.Hover(`${word}`);
            }
        });
    }


    /**
     * Update all decorations.
     */
    function updateAll() {
        updateHighlights();
        updateHover();
    }

    // invoke updateHighlights on startup
    if (vscode.window.activeTextEditor) {
        updateAll();
    }
    vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document === vscode.window.activeTextEditor?.document) {
            updateAll();
        }
    }, null, context.subscriptions);





}






// this method is called when your extension is deactivated
export function deactivate() { };
