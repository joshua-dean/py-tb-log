/**
 * @file extension.ts
 * @fileoverview Entry point for the python-traceback-logger vscode extension.
 */
import * as vscode from 'vscode';
import { ALL_COMMANDS } from './commands';
import { EXTENSION_ID } from './constants';
import { decorationOptionsForMatchesInCurrentEditor, matchesInCurrentEditor } from './utils/vscode_utils';

import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import * as path from 'path';


// bruh mode
import { Uri, TextDocument, Position, CompletionContext, CancellationToken, CompletionItem, CompletionList } from 'vscode';

interface PylanceApi {
    client?: {
        sendRequest: Function;
        isEnabled(): boolean;
        start(): Promise<void>;
        stop(): Promise<void>;
    };
    notebook?: {
        registerJupyterPythonPathFunction(func: (uri: Uri) => Promise<string | undefined>): void;
        registerGetNotebookUriForTextDocumentUriFunction(func: (textDocumentUri: Uri) => Uri | undefined): void;
        getCompletionItems(
            document: TextDocument,
            position: Position,
            context: CompletionContext,
            token: CancellationToken,
        ): Promise<CompletionItem[] | CompletionList | undefined>;
    };
}
// end bruh mode



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

    // Get LanguageClient from pylance
    const PYLANCE_EXT_ID = 'ms-python.vscode-pylance';
    const pylance_ext = vscode.extensions.getExtension(PYLANCE_EXT_ID);
    let pylance_api: PylanceApi | undefined = undefined;
    const api = pylance_ext?.exports;
    if(api && api.client && api.client.isEnabled()){
        pylance_api = api;
        pylance_api!.client!.start();
        console.log('yyyy')
    }
    const languageServerFolder = pylance_ext ? pylance_ext.extensionPath : '';
    const bundlePath = path.join(languageServerFolder, 'dist', 'server.bundle.js');
    const modulePath = bundlePath;
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6600'] };

    // If the extension is launched in debug mode, then the debug server options are used.
    const serverOptions: ServerOptions = {
        run: {
            module: bundlePath,
            transport: TransportKind.ipc,
            args: ['--node-ipc'],
        },
        debug: {
            module: modulePath,
            transport: TransportKind.ipc,
            options: debugOptions,
            args: ['--node-ipc'],
        },
    };
    const clientOptions: LanguageClientOptions = {
        // documentSelector: [
        //     { scheme: 'file', language: 'python' },
        //     { scheme: 'untitled', language: 'python' },
        // ],
        // diagnosticCollectionName: 'python',
        // revealOutputChannelOn: 4,
        // initializationOptions: {},
        // middleware: {},
    };
    const python_language_client = new LanguageClient(
        'python_____',
        'Python Language Serverfdsgsdfg',
        serverOptions, 
        clientOptions
    );
    console.log(python_language_client);
    python_language_client.start();



    /**
     * Update the hover provider.
     */
    function updateHover() {
        vscode.languages.registerHoverProvider('python', {
            async provideHover(document, position, token) {
                const range = document.getWordRangeAtPosition(position);
                const word = document.getText(range);
                console.log(word)
                console.log(pylance_api)
                // Get type info from pylance
                // const type_info = await python_language_client.sendRequest('textDocument/hover', {
                if (pylance_api && pylance_api.client && pylance_api.client.isEnabled()) {
                    const type_info = await pylance_api.client.sendRequest(
                        'textDocument/hover', {
                        textDocument: {
                            uri: document.uri.toString()
                        },
                        position: {
                            line: position.line,
                            character: position.character
                        }   
                    });
                    console.log(type_info);

                    return new vscode.Hover(`${word}: no type info`);
                }
                return new vscode.Hover(`${word}: no type info`);
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
