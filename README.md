# DocSmith - Intelligent Documentation Generator for VS Code

DocSmith is a powerful VS Code extension that automatically generates JSDoc/TSDoc comments for your TypeScript and JavaScript functions, methods, and arrow functions. It helps maintain consistent documentation across your codebase with intelligent parameter detection, return type inference, and real-time diagnostics.

## Features

### 🎯 Smart Documentation Generation
- Automatically generates JSDoc/TSDoc comments for functions, class methods, and arrow functions
- Intelligently detects function signatures, parameters, return types, and generic type parameters
- Infers throwable errors by analyzing function bodies
- Provides context-aware default descriptions based on function naming conventions

### 🔍 Code Intelligence
- **Real-time CodeLens**: Shows documentation status directly above each function
  - "📎 Add Documentation" for undocumented functions
  - "✅ Documented" for already documented functions

### ⚠️ Diagnostics & Warnings
- Highlights exported functions missing documentation with warning squiggles
- Configurable warning severity
- Real-time updates as you type

### 📊 Status Bar Integration
- Shows documentation coverage percentage for the current file
- Color-coded status:
  - 🟢 Green: 100% documented
  - 🟡 Yellow: 50-99% documented
  - 🔴 Red: Below 50% documented
- Click the status bar to document all undocumented functions at once

### 🎨 Multiple Documentation Styles
- **JSDoc** (default): Traditional JSDoc format with type annotations
- **TSDoc**: TypeScript-optimized documentation format

## 🧠 Usage

### Generate Documentation for a Single Function
1. Place your cursor on or above any function  
2. Open Command Palette:
   - `Ctrl+Shift+P` (Windows/Linux)
   - `Cmd+Shift+P` (Mac)  
3. Run DocSmith: Generate Documentation for Function
4. OR click the **📎 Add Documentation** CodeLens above the function  

---

### Generate Documentation for Entire File
1. Open a TypeScript/JavaScript file  
2. Click the documentation percentage in the status bar  
3. **OR**Run DocSmith: Generate Documentation for File
4. Confirm the number of functions to document

## ⚙️ Configuration

Open VS Code settings:

- `Ctrl + ,` (Windows/Linux)  
- `Cmd + ,` (Mac)  

Search for **"docsmith"** and configure as needed:

```json
{
  // Documentation style: 'jsdoc' or 'tsdoc'
  "docsmith.style": "jsdoc",

  // Show warnings for missing documentation on exported functions
  "docsmith.warnOnMissing": true,

  // Auto-detect throw statements
  "docsmith.detectThrows": true,

  // Include example tags in documentation
  "docsmith.includeExamples": true
}
```

## 🧩 What Gets Documented

### Function Declarations

#### Before
```typescript
export function calculateTotal(price: number, quantity: number, discount?: number): number {
  if (price < 0) throw new Error("Invalid price");
  return price * quantity - (discount || 0);
}
```
#### After (JSDoc Generated)
/**
 * Calculates value
 *
 * @param {number} price - Price
 * @param {number} quantity - Quantity
 * @param {number} [discount] - Discount (default: 0)
 * @returns {number} Numeric value
 * @throws {Error} When this error occurs
 *
 * @example
 * calculateTotal(price, quantity, discount)
 */
export function calculateTotal(price: number, quantity: number, discount?: number): number {
  // ... function body
}

###Class Methods
####Before
class UserService {
  async fetchUser(id: string): Promise<User> {
    // implementation
  }
}
####After
class UserService {
  /**
   * Fetches data
   *
   * @async
   * @param {string} id - Id
   * @returns {Promise<User>} Async result
   *
   * @example
   * fetchUser(id)
   */
  async fetchUser(id: string): Promise<User> {
    // implementation
  }
}

###Arrow Functions
####Before
const greet = (name: string): string => `Hello, ${name}!`;
####After
/**
 * greet function
 *
 * @param {string} name - Name
 * @returns {string} String result
 *
 * @example
 * greet(name)
 */
const greet = (name: string): string => `Hello, ${name}!`;



## Installation

### From VS Code Marketplace
1. Press `Ctrl+P` (or `Cmd+P` on Mac)
2. Type: `ext install docsmith`
3. Press Enter

### Manual Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/docsmith.git

# Install dependencies
npm install

# Build the extension
npm run compile

# Copy to VS Code extensions folder
cp -r . ~/.vscode/extensions/docsmith

```

