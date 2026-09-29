// Local research patch for block/buzz ebe99a46 (Apache-2.0).
// Only source-authored presentation strings are eligible. Never inspect or
// rewrite rendered DOM, user content, protocol values, identifiers, or keys.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const desktop = path.resolve(root, '../upstream/desktop');
const require = createRequire(path.join(desktop, 'package.json'));
const ts = require('typescript');
const sourceRoot = path.join(desktop, 'src');
const labels = new Set(['title', 'label', 'description', 'placeholder', 'aria-label', 'tooltip', 'subtitle', 'emptyMessage', 'emptyLabel', 'helperText', 'buttonLabel', 'submitLabel', 'cancelLabel', 'confirmLabel', 'legend', 'heading', 'caption', 'primaryActionLabel', 'secondaryActionLabel']);
const catalogFile = path.join(root, 'zh-CN.json');
const catalog = fs.existsSync(catalogFile) ? JSON.parse(fs.readFileSync(catalogFile, 'utf8')) : {};
const extract = process.argv.includes('--extract');
const candidates = {};
const changed = [];

function cleanJsxText(value) {
  const lines=value.split(/\r\n|\n|\r/);
  let lastNonEmpty=0;
  lines.forEach((line,index)=>{if(/[^ \t]/.test(line)) lastNonEmpty=index;});
  return lines.map((line,index)=>{
    let text=line.replaceAll('\t',' ');
    if(index!==0) text=text.replace(/^ +/,'');
    if(index!==lines.length-1) text=text.replace(/ +$/,'');
    return text ? text+(index!==lastNonEmpty?' ':'') : '';
  }).join('');
}

function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(e => e.isDirectory()
    ? (['testing', 'i18n'].includes(e.name) ? [] : walk(path.join(dir, e.name)))
    : (/\.tsx?$/.test(e.name) && !/\.test\.|\.gen\.|\.d\.ts$/.test(e.name) && (e.name.endsWith('.tsx') || e.name === 'keyboard-shortcuts.ts' || dir.replaceAll('\\','/').includes('/ui')) ? [path.join(dir, e.name)] : []));
}

function presentation(node) {
  let n = node;
  while (n.parent) {
    const p = n.parent;
    if (ts.isJsxAttribute(p)) return labels.has(p.name.getText());
    if (ts.isJsxExpression(p)) {
      return !ts.isJsxAttribute(p.parent) || labels.has(p.parent.name.getText());
    }
    if (ts.isPropertyAssignment(p)) return p.initializer === n && labels.has(p.name.getText().replace(/^['"]|['"]$/g, ''));
    if (ts.isVariableDeclaration(p) && p.initializer === n) return p.name.getText() !== 'itemLabelTitle' && (/(?:Label|Title|Placeholder|Description)$/.test(p.name.getText()) || ['label','title','subtitle','placeholder'].includes(p.name.getText()));
    if (ts.isConditionalExpression(p)) { if (p.condition === n) return false; n = p; continue; }
    if (ts.isBinaryExpression(p) && [ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken, ts.SyntaxKind.AmpersandAmpersandToken].includes(p.operatorToken.kind)) {
      if (p.left === n) return false;
      n = p; continue;
    }
    if (ts.isParenthesizedExpression(p) || ts.isAsExpression(p)) { n = p; continue; }
    if (ts.isCallExpression(p) && /^(toast|toast\.(success|error|info|warning|loading))$/.test(p.expression.getText())) return p.arguments[0] === n;
    return false;
  }
  return false;
}

if (!extract) {
  const customEdits=JSON.parse(fs.readFileSync(path.join(root,'source-edits.json'),'utf8'));
  for(const change of customEdits){
    const file=path.join(desktop,change.file);
    const before=fs.readFileSync(file,'utf8');
    let after=before.replaceAll('\r\n','\n');
    for(const [match,replacement] of change.edits){
      if(after.includes(match)) after=after.replaceAll(match,replacement);
      else if(!after.includes(replacement)) throw new Error(`Source anchor missing: ${change.file}: ${match}`);
    }
    for(const statement of ['import { uiText } from "@/shared/i18n/uiText";',...(change.imports??[])]){
      if(!after.includes(statement)) after=statement+'\n'+after;
    }
    if(after!==before){
      const backup=path.resolve(root,'../upstream/runtime/localization-original',change.file);
      if(!fs.existsSync(backup)){fs.mkdirSync(path.dirname(backup),{recursive:true});fs.writeFileSync(backup,before);}
      fs.writeFileSync(file,after);
    }
  }
}

for (const file of walk(sourceRoot)) {
  const before = fs.readFileSync(file, 'utf8');
  const source = ts.createSourceFile(file, before, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const edits = [];
  function visit(node) {
    let key;
    let args = [];
    let jsxText = false;
    let jsxValue = '';
    if (ts.isJsxText(node)) {
      jsxValue = cleanJsxText(node.text);
      key = jsxValue.trim();
      jsxText = true;
    } else if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && presentation(node)) {
      key = node.text;
    } else if (ts.isTemplateExpression(node) && presentation(node)) {
      key = node.head.text;
      node.templateSpans.forEach((span, index) => { key += `{${index}}${span.literal.text}`; args.push(span.expression.getText(source)); });
    }
    if (key && /[a-zA-Z]/.test(key)) {
      const relative = path.relative(sourceRoot, file).replaceAll('\\', '/');
      (candidates[key] ??= []).push(relative);
      if (!extract && Object.hasOwn(catalog, key)) {
        const call = `uiText(${JSON.stringify(key)}${args.length ? `, [${args.join(', ')}]` : ''})`;
        let replacement = jsxText || ts.isJsxAttribute(node.parent) ? `{${call}}` : call;
        if(jsxText) {
          const leading=jsxValue.match(/^\s*/)[0];
          const trailing=jsxValue.match(/\s*$/)[0];
          replacement=(leading?`{${JSON.stringify(leading)}}`:'')+replacement+(trailing?`{${JSON.stringify(trailing)}}`:'');
        }
        edits.push({start: jsxText ? node.pos : node.getStart(source), end: node.end, replacement});
        return;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  if (edits.length) {
    const backup = path.resolve(root, '../upstream/runtime/localization-original', path.relative(desktop, file));
    if (!fs.existsSync(backup)) { fs.mkdirSync(path.dirname(backup), {recursive:true}); fs.writeFileSync(backup, before); }
    let after = before;
    for (const edit of edits.sort((a,b) => b.start - a.start)) after = after.slice(0, edit.start) + edit.replacement + after.slice(edit.end);
    if (!after.includes('import { uiText } from "@/shared/i18n/uiText"')) after = `import { uiText } from "@/shared/i18n/uiText";\n${after}`;
    fs.writeFileSync(file, after);
    changed.push({file: path.relative(desktop,file).replaceAll('\\','/'), replacements:edits.length});
  }
}

if (extract) {
  const output = path.resolve(root, '../upstream/runtime/localization-candidates.json');
  fs.writeFileSync(output, JSON.stringify(candidates, null, 2));
  console.log(`${Object.keys(candidates).length} presentation strings: ${output}`);
} else {
  const structuralEdits = [
    ['src/main.tsx', 'import { initializeUiLanguage } from "@/shared/i18n/uiText";', 'async function bootstrap() {', 'async function bootstrap() {\n  initializeUiLanguage();'],
    ['src/features/settings/ui/SettingsPanels.tsx', 'import { LanguageSettings } from "@/shared/i18n/LanguageSettings";', 'return <ThemeSettingsCard />;', 'return <><LanguageSettings /><ThemeSettingsCard /></>;'],
  ];
  for (const [relative, addedImport, match, replacement] of structuralEdits) {
    const file = path.join(desktop, relative);
    const before = fs.readFileSync(file, 'utf8');
    if (before.includes(addedImport)) continue;
    if (!before.includes(match)) throw new Error(`Expected source anchor missing: ${relative}`);
    const backup = path.resolve(root, '../upstream/runtime/localization-original', relative);
    if (!fs.existsSync(backup)) { fs.mkdirSync(path.dirname(backup), {recursive:true}); fs.writeFileSync(backup, before); }
    fs.writeFileSync(file, `${addedImport}\n${before.replace(match, replacement)}`);
  }
  for (const filename of ['uiText.ts', 'LanguageSettings.tsx']) {
    const destination = path.join(sourceRoot, 'shared/i18n', filename);
    fs.mkdirSync(path.dirname(destination), {recursive:true});
    fs.copyFileSync(path.join(root, filename), destination);
  }
  fs.copyFileSync(catalogFile, path.join(sourceRoot, 'shared/i18n/zh-CN.json'));
  const report = path.join(root, 'coverage.json');
  const previous = !process.argv.includes('--fresh-report') && fs.existsSync(report) ? JSON.parse(fs.readFileSync(report,'utf8')).files : [];
  const counts = new Map(previous.map(entry=>[entry.file,entry.replacements]));
  for (const entry of changed) counts.set(entry.file,(counts.get(entry.file)??0)+entry.replacements);
  fs.writeFileSync(report, JSON.stringify({upstreamCommit:'ebe99a46e8802b9ff20fdf6a1028ce93bdefaa43', translatedStrings:Object.keys(catalog).length, files:[...counts].map(([file,replacements])=>({file,replacements}))}, null, 2));
  console.log(`Applied ${changed.reduce((n,f)=>n+f.replacements,0)} localized presentation strings in ${changed.length} files.`);
}
