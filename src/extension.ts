import * as vscode from 'vscode';
import { parseFile, FunctionInfo } from './astParser';
import { generateDocComment, DocStyle } from './docGenerator';
import { DocSmithCodeLensProvider } from './codeLensProvider';
import { DocSmithDiagnosticProvider } from './diagnosticProvider';
import { DocSmithStatusBar } from './statusBarProvider';

let codeLensProvider: DocSmithCodeLensProvider;
let diagnosticProvider: DocSmithDiagnosticProvider;
let statusBar: DocSmithStatusBar;

export function activate(context: vscode.ExtensionContext) {
  console.log('DocSmith is now active!');

  // Initialize providers
  codeLensProvider = new DocSmithCodeLensProvider();
  diagnosticProvider = new DocSmithDiagnosticProvider();
  statusBar = new DocSmithStatusBar();

  // Register CodeLens
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      [{ language: 'typescript' }, { language: 'javascript' },
       { language: 'typescriptreact' }, { language: 'javascriptreact' }],
      codeLensProvider
    )
  );

  // Command: Generate for single function
  context.subscriptions.push(
    vscode.commands.registerCommand('docsmith.generateForFunction', async (
      uri: vscode.Uri,
      fnInfo: FunctionInfo
    ) => {
      const document = await vscode.workspace.openTextDocument(uri || vscode.window.activeTextEditor?.document.uri!);
      
      // If called from command palette (no args), find function at cursor
      if (!fnInfo) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        const cursorLine = editor.selection.active.line;
        const functions = parseFile(document.getText(), document.fileName);
        const fn = functions.find(f => cursorLine >= f.startLine && cursorLine <= f.endLine);
        if (!fn) {
          vscode.window.showInformationMessage('DocSmith: No function found at cursor.');
          return;
        }
        fnInfo = fn;
      }

      await insertDocComment(document, fnInfo);
    })
  );

  // Command: Generate for entire file
  context.subscriptions.push(
    vscode.commands.registerCommand('docsmith.generateForFile', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) { return; }

      const document = editor.document;
      const functions = parseFile(document.getText(), document.fileName);
      const undocumented = functions.filter(f => !f.hasJsDoc);

      if (undocumented.length === 0) {
        vscode.window.showInformationMessage('DocSmith: All functions are already documented! 🎉');
        return;
      }

      const answer = await vscode.window.showInformationMessage(
        `DocSmith: Generate docs for ${undocumented.length} undocumented function(s)?`,
        'Yes', 'No'
      );

      if (answer !== 'Yes') { return; }

      // Apply edits in reverse order (bottom to top) to avoid line offset issues
      const sorted = [...undocumented].sort((a, b) => b.startLine - a.startLine);
      for (const fn of sorted) {
        await insertDocComment(document, fn);
      }

      statusBar.update(document);
      codeLensProvider.refresh();
      vscode.window.showInformationMessage(`DocSmith: Added docs to ${undocumented.length} functions! ✅`);
    })
  );

  // Update on file change
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (editor) {
        diagnosticProvider.updateDiagnostics(editor.document);
        statusBar.update(editor.document);
      }
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(event => {
      if (event.document === vscode.window.activeTextEditor?.document) {
        diagnosticProvider.updateDiagnostics(event.document);
        statusBar.update(event.document);
        codeLensProvider.refresh();
      }
    })
  );

  // Run on startup for already open file
  if (vscode.window.activeTextEditor) {
    diagnosticProvider.updateDiagnostics(vscode.window.activeTextEditor.document);
    statusBar.update(vscode.window.activeTextEditor.document);
  }
}

async function insertDocComment(document: vscode.TextDocument, fn: FunctionInfo): Promise<void> {
  const config = vscode.workspace.getConfiguration('docsmith');
  const style = config.get<DocStyle>('style', 'jsdoc');

  const docComment = generateDocComment(fn, style);
  const insertPosition = new vscode.Position(fn.startLine, 0);
  const indent = document.lineAt(fn.startLine).text.match(/^(\s*)/)?.[1] ?? '';
  const indentedComment = docComment.split('\n').map(l => indent + l).join('\n') + '\n';

  const edit = new vscode.WorkspaceEdit();
  edit.insert(document.uri, insertPosition, indentedComment);
  await vscode.workspace.applyEdit(edit);
}

export function deactivate() {
  diagnosticProvider?.dispose();
  statusBar?.dispose();
}