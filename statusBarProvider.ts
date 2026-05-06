import * as vscode from 'vscode';
import { parseFile } from './astParser';

export class DocSmithStatusBar {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this.statusBarItem.command = 'docsmith.generateForFile';
    this.statusBarItem.tooltip = 'Click to document entire file';
  }

  update(document: vscode.TextDocument): void {
    if (!['typescript', 'javascript', 'typescriptreact', 'javascriptreact'].includes(document.languageId)) {
      this.statusBarItem.hide();
      return;
    }

    const functions = parseFile(document.getText(), document.fileName);
    if (functions.length === 0) {
      this.statusBarItem.text = '$(book) DocSmith: No functions';
      this.statusBarItem.show();
      return;
    }

    const documented = functions.filter(f => f.hasJsDoc).length;
    const total = functions.length;
    const pct = Math.round((documented / total) * 100);

    const icon = pct === 100 ? '$(check)' : pct > 50 ? '$(warning)' : '$(error)';
    this.statusBarItem.text = `${icon} Docs: ${pct}% (${documented}/${total})`;
    this.statusBarItem.backgroundColor = pct < 50
      ? new vscode.ThemeColor('statusBarItem.warningBackground')
      : undefined;
    this.statusBarItem.show();
  }

  dispose(): void {
    this.statusBarItem.dispose();
  }
}