// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { EC2 } from "aws-sdk";

let global_response: Promise<any>;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const ec2Client = new EC2({ region: "us-east-1" });
	global_response = ec2Client.describeInstances({}).promise();
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "python-traceback-logger" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('python-traceback-logger.helloWorld', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
        vscode.window.showInformationMessage('Hello World from Python Traceback Logger!');
        vscode.window.showInformationMessage('bruh');
		let data = await global_response;

		vscode.window.showInformationMessage(data.Reservations[0].Instances[0].InstanceId);

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
