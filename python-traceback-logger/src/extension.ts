// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ALL_COMMANDS } from './commands';
import { EXTENSION_ID } from './constants';
// import { EC2 } from "aws-sdk";

var workspace = vscode.workspace;

let global_response: Promise<any>;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Register all commands
    for (let [command_name, command] of Object.entries(ALL_COMMANDS)) {
        context.subscriptions.push(
            vscode.commands.registerCommand(
                `${EXTENSION_ID}.${command_name}`,
                command
            )
        );
    }

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "python-traceback-logger" is now active!');

    context.subscriptions.push(
        vscode.commands.registerCommand('python-traceback-logger.logTraceback', async () => {
            vscode.window.showInformationMessage('Hello World from Python Traceback Logger!');
            vscode.window.showInformationMessage('bruh');
            // let data = await global_response;

            // vscode.window.showInformationMessage(data.Reservations[0].Instances[0].InstanceId);

        })
    )

    // Delete all cases of 'tb_logger.log'
    context.subscriptions.push(
        vscode.commands.registerCommand('python-traceback-logger.deleteLogs', async () => {
        })
    );

    // Color first line purple
    context.subscriptions.push(
        vscode.commands.registerCommand('python-traceback-logger.colorFirstLine', () => {
            vscode.window.showInformationMessage('colorFirstLine invoked')
            const editor = vscode.window.activeTextEditor;

            editor?.setDecorations(vscode.window.createTextEditorDecorationType({
                backgroundColor: 'rgba(255,0,255,0.3)',
                overviewRulerColor: 'rgba(255,0,255,1)',
                overviewRulerLane: vscode.OverviewRulerLane.Right,
                isWholeLine: true
            }), [new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 10))]);
        })
    );

    // Color all cases of 'tb_logger.log' purple
    // modeled after: https://github.com/wayou/vscode-todo-highlight/blob/master/src/extension.js
    context.subscriptions.push(
        vscode.commands.registerCommand('python-traceback-logger.colorLogs', () => {
            vscode.window.showInformationMessage('colorLogs invoked')
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const document = editor.document;
                const text = document.getText();
                const regex = /tb_logger.log/g;
                const decorations: vscode.DecorationOptions[] = [];
                let match;
                while (match = regex.exec(text)) {
                    const startPos = document.positionAt(match.index);
                    const endPos = document.positionAt(match.index + match[0].length);
                    const decoration = { range: new vscode.Range(startPos, endPos) };
                    decorations.push(decoration);
                }
                editor.setDecorations(vscode.window.createTextEditorDecorationType({
                    backgroundColor: 'rgba(255,0,255,0.3)',
                    overviewRulerColor: 'rgba(255,0,255,1)',
                    overviewRulerLane: vscode.OverviewRulerLane.Right,
                    isWholeLine: true
                }), decorations);
            }
        })
    );


    // Color all cases of 'tb_logger.log' red 
    // Constantly, not on command
    function updateHighlights() {
        vscode.window.showInformationMessage('updateHighlights invoked')
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();
            const regex = /tb_logger.log/g;
            const decorations: vscode.DecorationOptions[] = [];
            let match;
            while (match = regex.exec(text)) {
                const startPos = document.positionAt(match.index);
                const endPos = document.positionAt(match.index + match[0].length);
                const decoration = { range: new vscode.Range(startPos, endPos) };
                decorations.push(decoration);
            }
            editor.setDecorations(vscode.window.createTextEditorDecorationType({
                backgroundColor: 'rgba(255,0,0,0.3)',
                overviewRulerColor: 'rgba(255,0,0,1)',
                overviewRulerLane: vscode.OverviewRulerLane.Right,
                isWholeLine: true
            }), decorations);
        }
    }
    var timeout: string | number | NodeJS.Timeout | null | undefined = null;

    function triggerUpdateHighlights() {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(updateHighlights, 500);
    }

    vscode.workspace.onDidChangeConfiguration(event => {
        vscode.window.showInformationMessage('onDidChangeConfiguration invoked')
        if (event.affectsConfiguration("python-traceback-logger")) {
            triggerUpdateHighlights();
        }
    });


    // invoke updateHighlights
    context.subscriptions.push(
        vscode.commands.registerCommand('python-traceback-logger.manualUpdateHighlights', () => {
            vscode.window.showInformationMessage('Manual updateHighlights invoked')
            triggerUpdateHighlights();
        })
    );

    // invoke updateHighlights on startup
    // if (vscode.window.activeTextEditor) {
    //     vscode.window.showInformationMessage('activeTextEditor exists on startup')
    //     triggerUpdateHighlights();
    // }
    // vscode.window.onDidChangeActiveTextEditor(editor => {
    //     vscode.window.showInformationMessage('onDidChangeActiveTextEditor invoked')
    //     if (editor) {
    //         triggerUpdateHighlights();
    //     }
    // }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(event => {
        vscode.window.showInformationMessage('onDidChangeTextDocument invoked')
        if (event.document === vscode.window.activeTextEditor?.document) {
            triggerUpdateHighlights();
        }
    }, null, context.subscriptions);
    // vscode.workspace.onDidChangeConfiguration(event => {
    //     vscode.window.showInformationMessage('onDidChangeConfiguration invoked')
    //     if (event.affectsConfiguration("python-traceback-logger")) {
    //         triggerUpdateHighlights();
    //     }
    // }
    // );
    // vscode.window.onDidChangeTextEditorSelection(event => {
    //     vscode.window.showInformationMessage('onDidChangeTextEditorSelection invoked')
    //     if (event.textEditor === vscode.window.activeTextEditor) {
    //         triggerUpdateHighlights();
    //     }
    // });
    // vscode.workspace.onDidOpenTextDocument(event => {
    //     vscode.window.showInformationMessage('onDidOpenTextDocument invoked')
    //     triggerUpdateHighlights();
    // });








}






// this method is called when your extension is deactivated
export function deactivate() { };
