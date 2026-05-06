import { FunctionInfo } from './astParser';

export type DocStyle = 'jsdoc' | 'tsdoc';

function getAutoDescription(name: string): string {
  const n = name.toLowerCase();

  if (n.startsWith("get")) return "Gets data";
  if (n.startsWith("fetch")) return "Fetches data";
  if (n.startsWith("create")) return "Creates something";
  if (n.startsWith("update")) return "Updates something";
  if (n.startsWith("delete")) return "Deletes something";
  if (n.startsWith("calculate")) return "Calculates value";
  if (n.startsWith("is") || n.startsWith("has")) return "Checks condition";

  return `${name} function`;
}

function getParamDescription(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getReturnDescription(type: string): string {
  if (type.includes("Promise")) return "Async result";
  if (type === "boolean") return "True or false";
  if (type === "number") return "Numeric value";
  if (type === "string") return "String result";

  return "Result";
}

export function generateDocComment(fn: FunctionInfo, style: DocStyle = 'jsdoc'): string {
  const lines: string[] = ['/**'];

  // Description placeholder
  lines.push(` * ${getAutoDescription(fn.name)}`);
  lines.push(` *`);

  // Generic type params
  fn.typeParams.forEach(tp => {
    lines.push(` * @template ${tp}`);
  });

  // Async tag for JSDoc
  if (fn.isAsync && style === 'jsdoc') {
    lines.push(` * @async`);
  }

  // Parameters
  fn.params.forEach(param => {
    const optional = param.optional ? `[${param.name}]` : param.name;
    if (style === 'jsdoc') {
      const defaultStr = param.defaultValue ? ` (default: ${param.defaultValue})` : '';
      lines.push(` * @param {${param.type}} ${optional} - ${getParamDescription(param.name)}${defaultStr}`);
    } else {
      // TSDoc style
      lines.push(` * @param ${optional} - Description`);
    }
  });

  // Return type
  const returnType = fn.returnType.replace(/Promise<(.+)>/, '$1');
  if (returnType !== 'void' && returnType !== 'never') {
    if (style === 'jsdoc') {
      lines.push(` * @returns {${fn.returnType}} ${getReturnDescription(fn.returnType)}`);
    } else {
      lines.push(` * @returns Description`);
    }
  }

  // Throws
  fn.throwsErrors.forEach(err => {
    if (style === 'jsdoc') {
      lines.push(` * @throws {${err}} When this error occurs`);
    } else {
      lines.push(` * @throws ${err} - When this error occurs`);
    }
  });

  // Example placeholder
  lines.push(` *`);
  lines.push(` * @example`);
  lines.push(` * ${fn.name}(${fn.params.map(p => p.name).join(', ')})`);

  lines.push(` */`);
  return lines.join('\n');
}