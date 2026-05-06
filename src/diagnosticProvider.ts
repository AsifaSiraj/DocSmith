import * as vscode from 'vscode';
import { parseFile } from './astParser';

export class DocSmithDiagnosticProvider {
  private diagnosticCollection: vscode.DiagnosticCollection;

  constructor() {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('docsmith');
  }

  updateDiagnostics(document: vscode.TextDocument): void {
    const config = vscode.workspace.getConfiguration('docsmith');
    if (!config.get<boolean>('warnOnMissing', true)) {
      this.diagnosticCollection.clear();
      return;
    }

    if (!['typescript', 'javascript', 'typescriptreact', 'javascriptreact'].includes(document.languageId)) {
      return;
    }

    const functions = parseFile(document.getText(), document.fileName);
    const diagnostics: vscode.Diagnostic[] = [];

    functions.forEach(fn => {
      if (!fn.hasJsDoc && fn.isExported) {
        const range = new vscode.Range(fn.startLine, 0, fn.startLine, 100);
        const diagnostic = new vscode.Diagnostic(
          range,
          `DocSmith: Exported function "${fn.name}" is missing documentation.`,
          vscode.DiagnosticSeverity.Warning
        );
        diagnostic.source = 'DocSmith';
        diagnostic.code = 'missing-doc';
        diagnostics.push(diagnostic);
      }
    });

    this.diagnosticCollection.set(document.uri, diagnostics);
  }

  dispose(): void {
    this.diagnosticCollection.dispose();
  }
}