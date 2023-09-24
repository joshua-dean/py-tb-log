/**
 * @file extension.ts
 * @fileoverview Entry point for the python-traceback-logger vscode extension.
 */
import * as vscode from 'vscode';
import { ALL_COMMANDS } from './commands';
import { EXTENSION_ID } from './constants';
import { decorationOptionsForMatchesInCurrentEditor, matchesInCurrentEditor } from './utils/vscode_utils';




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


    // Color all cases of 'tb_logger.log' red 
    function updateHighlights() {
        // vscode.window.showInformationMessage('updateHighlights invoked')

        let ranges = matchesInCurrentEditor(/tb_logger.log/g);
        vscode.window.activeTextEditor?.setDecorations(
            redHighlightDecorationType,
            ranges
        );
    }

    // invoke updateHighlights on startup
    if (vscode.window.activeTextEditor) {
        // vscode.window.showInformationMessage('activeTextEditor exists on startup')
        updateHighlights();
    }
    vscode.workspace.onDidChangeTextDocument(event => {
        // vscode.window.showInformationMessage('onDidChangeTextDocument invoked')
        if (event.document === vscode.window.activeTextEditor?.document) {
            updateHighlights();
        }
    }, null, context.subscriptions);





}






// this method is called when your extension is deactivated
export function deactivate() { };
