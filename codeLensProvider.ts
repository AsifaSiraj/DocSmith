import * as vscode from 'vscode';
import { parseFile, FunctionInfo } from './astParser';

export class DocSmithCodeLensProvider implements vscode.CodeLensProvider {
  private _onDidChangeCodeLenses = new vscode.EventEmitter<void>();
  readonly onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;

  refresh(): void {
    this._onDidChangeCodeLenses.fire();
  }

  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    if (!['typescript', 'javascript', 'typescriptreact', 'javascriptreact'].includes(document.languageId)) {
      return [];
    }

    const functions = parseFile(document.getText(), document.fileName);
    const lenses: vscode.CodeLens[] = [];

    functions.forEach(fn => {
      if (!fn.hasJsDoc) {
        const range = new vscode.Range(fn.startLine, 0, fn.startLine, 0);
        lenses.push(new vscode.CodeLens(range, {
          title: '📎 Add Documentation',
          command: 'docsmith.generateForFunction',
          arguments: [document.uri, fn]
        }));
      } else {
        const range = new vscode.Range(fn.startLine, 0, fn.startLine, 0);
        lenses.push(new vscode.CodeLens(range, {
          title: '✅ Documented',
          command: ''
        }));
      }
    });

    return lenses;
  }
}