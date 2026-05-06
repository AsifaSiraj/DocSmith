import { Project, SourceFile, FunctionDeclaration, MethodDeclaration, ArrowFunction, Node, SyntaxKind } from 'ts-morph';

export interface FunctionInfo {
  name: string;
  startLine: number;   // 0-indexed
  endLine: number;
  params: ParamInfo[];
  returnType: string;
  isAsync: boolean;
  isExported: boolean;
  hasJsDoc: boolean;
  throwsErrors: string[];
  typeParams: string[];
}

export interface ParamInfo {
  name: string;
  type: string;
  optional: boolean;
  defaultValue?: string;
}

export function parseFile(content: string, fileName: string = 'temp.ts'): FunctionInfo[] {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile(fileName, content);
  const functions: FunctionInfo[] = [];

  // Collect all function declarations
  sourceFile.getFunctions().forEach(fn => {
    functions.push(extractFunctionInfo(fn));
  });

  // Collect methods inside classes
  sourceFile.getClasses().forEach(cls => {
    cls.getMethods().forEach(method => {
      functions.push(extractMethodInfo(method));
    });
  });

  // Collect arrow functions assigned to variables
  sourceFile.getVariableDeclarations().forEach(varDecl => {
    const initializer = varDecl.getInitializer();
    if (initializer && (Node.isArrowFunction(initializer) || Node.isFunctionExpression(initializer))) {
      functions.push(extractArrowFunctionInfo(varDecl.getName(), initializer as ArrowFunction));
    }
  });

  return functions;
}

function extractFunctionInfo(fn: FunctionDeclaration): FunctionInfo {
  return {
    name: fn.getName() ?? 'anonymous',
    startLine: fn.getStartLineNumber() - 1,
    endLine: fn.getEndLineNumber() - 1,
    params: fn.getParameters().map(p => ({
      name: p.getName(),
      type: p.getType().getText() || 'any',
      optional: p.isOptional(),
      defaultValue: p.getInitializer()?.getText()
    })),
    returnType: fn.getReturnType().getText() || 'void',
    isAsync: fn.isAsync(),
    isExported: fn.isExported(),
    hasJsDoc: fn.getJsDocs().length > 0,
    throwsErrors: extractThrows(fn.getBodyText() ?? ''),
    typeParams: fn.getTypeParameters().map(tp => tp.getName())
  };
}

function extractMethodInfo(method: MethodDeclaration): FunctionInfo {
  return {
    name: method.getName(),
    startLine: method.getStartLineNumber() - 1,
    endLine: method.getEndLineNumber() - 1,
    params: method.getParameters().map(p => ({
      name: p.getName(),
      type: p.getType().getText() || 'any',
      optional: p.isOptional(),
      defaultValue: p.getInitializer()?.getText()
    })),
    returnType: method.getReturnType().getText() || 'void',
    isAsync: method.isAsync(),
    isExported: true, // class methods are considered public by default
    hasJsDoc: method.getJsDocs().length > 0,
    throwsErrors: extractThrows(method.getBodyText() ?? ''),
    typeParams: method.getTypeParameters().map(tp => tp.getName())
  };
}

function extractArrowFunctionInfo(name: string, fn: ArrowFunction): FunctionInfo {
  return {
    name,
    startLine: fn.getStartLineNumber() - 1,
    endLine: fn.getEndLineNumber() - 1,
    params: fn.getParameters().map(p => ({
      name: p.getName(),
      type: p.getType().getText() || 'any',
      optional: p.isOptional(),
      defaultValue: p.getInitializer()?.getText()
    })),
    returnType: fn.getReturnType().getText() || 'void',
    isAsync: fn.isAsync(),
    isExported: false,
    hasJsDoc: false,
    throwsErrors: extractThrows(fn.getBodyText() ?? ''),
    typeParams: fn.getTypeParameters().map(tp => tp.getName())
  };
}

function extractThrows(bodyText: string): string[] {
  const throwPattern = /throw\s+new\s+(\w+)/g;
  const errors: string[] = [];
  let match;
  while ((match = throwPattern.exec(bodyText)) !== null) {
    if (!errors.includes(match[1])) {
      errors.push(match[1]);
    }
  }
  return errors;
}