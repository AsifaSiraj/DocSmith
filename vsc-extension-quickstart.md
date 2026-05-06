# My VS Code Extension

## What's in the folder

* This folder contains all the files I need for my extension.
* `package.json` - this is the manifest file where I declare my extension and commands.
  * My plugin registers a command and defines its title and command name. With this information, VS Code can show my command in the command palette. It doesn't yet need to load the plugin.
* `src/extension.ts` - this is the main file where I implement my command.
  * The file exports one function, `activate`, which is called the very first time my extension is activated (in this case by executing the command). Inside the `activate` function, I call `registerCommand`.
  * I pass the function containing the implementation of my command as the second parameter to `registerCommand`.

## Setup

* I need to install the recommended extensions (amodio.tsl-problem-matcher, ms-vscode.extension-test-runner, and dbaeumer.vscode-eslint)

## Get up and running straight away

* I press `F5` to open a new window with my extension loaded.
* I run my command from the command palette by pressing (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) and typing `Hello World`.
* I set breakpoints in my code inside `src/extension.ts` to debug my extension.
* I find output from my extension in the debug console.

## Make changes

* I can relaunch my extension from the debug toolbar after changing code in `src/extension.ts`.
* I can also reload (`Ctrl+R` or `Cmd+R` on Mac) the VS Code window with my extension to load my changes.

## Explore the API

* I can open the full set of the VS Code API when I open the file `node_modules/@types/vscode/index.d.ts`.

## Run tests

* I install the [Extension Test Runner](https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner)
* I run the "watch" task via the **Tasks: Run Task** command. I make sure this is running, or tests might not be discovered.
* I open the Testing view from the activity bar and click the "Run Test" button, or use the hotkey `Ctrl/Cmd + ; A`
* I see the output of my test results in the Test Results view.
* I make changes to `src/test/extension.test.ts` or create new test files inside the `test` folder.
  * The provided test runner will only consider files matching the name pattern `**.test.ts`.
  * I can create folders inside the `test` folder to structure my tests any way I want.

## Go further

* I can reduce my extension size and improve the startup time by [bundling my extension](https://code.visualstudio.com/api/working-with-extensions/bundling-extension).
* I can [publish my extension](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) on the VS Code extension marketplace.
* I can automate builds by setting up [Continuous Integration](https://code.visualstudio.com/api/working-with-extensions/continuous-integration).
