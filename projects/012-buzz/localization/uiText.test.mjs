import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const require=createRequire(path.resolve(root,'../upstream/desktop/package.json'));
const ts=require('typescript');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'zh-CN.json'),'utf8'));
// Exercise the actual module shipped to the desktop, not a parallel formatter.
const source=fs.readFileSync(path.resolve(root,'../upstream/desktop/src/shared/i18n/uiText.ts'),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
function load(initial){
  const values=new Map(initial ? [['buzz-ui-language.v1',initial]] : []);
  const exports={};
  const document={documentElement:{lang:''}};
  const context={exports,require:(id)=>{assert.equal(id,'./zh-CN.json');return catalog;},localStorage:{getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)},document};
  vm.runInNewContext(compiled,context);
  return {api:exports,context,values,document};
}
test('Chinese edition defaults to Chinese and sets document language',()=>{
  const {api,document}=load();
  assert.equal(api.uiText('Save'),'保存');
  api.initializeUiLanguage();
  assert.equal(document.documentElement.lang,'zh-CN');
});
test('language persists and English copy retains source meaning',()=>{
  const {api,values}=load();
  api.saveUiLanguage('en');
  assert.equal(values.get('buzz-ui-language.v1'),'en');
  assert.equal(api.uiText('Save'),'Save');
  assert.equal(api.uiText('Saved as the generic agent&apos;s system prompt override.'),"Saved as the generic agent's system prompt override.");
});
test('interpolation preserves user names and message text literally',()=>{
  const {api}=load();
  const name='Save &amp; {1} 中文';
  assert.equal(api.uiText('Message #{0}',[name]),`向 #${name} 发消息`);
  assert.equal(api.uiText('not in the catalog'),'not in the catalog');
  assert.equal(api.uiText('Copy {0}',['npub1TEST']),'复制 npub1TEST');
});
test('storage failure is observable and unsupported saved locale falls back',()=>{
  const {api,context}=load('unknown');
  assert.equal(api.getUiLanguage(),'zh-CN');
  context.localStorage.setItem=()=>{throw new Error('quota');};
  assert.throws(()=>api.saveUiLanguage('en'),/quota/);
});
test('every translated template preserves its referenced placeholders',()=>{
  for(const [source,translation] of Object.entries(catalog)){
    const sourceTokens=new Set(source.match(/\{\d+\}/g)??[]);
    for(const token of translation.match(/\{\d+\}/g)??[]) assert.ok(sourceTokens.has(token),`${source}: unexpected ${token}`);
    // The English plural suffix {2} is intentionally omitted in Chinese.
    for(const token of sourceTokens) if(!(source==='{0} {1}{2} ago'&&token==='{2}')) assert.ok(translation.includes(token),`${source}: missing ${token}`);
  }
});
