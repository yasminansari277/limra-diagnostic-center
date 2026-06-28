import pathlib
import re
from typing import List

root = pathlib.Path('c:/Users/yasme/limra-diagnostic-center')

import_type_line = re.compile(r'^\s*import\s+type\s+.*;\s*$', re.MULTILINE)
import_named_line = re.compile(r'^\s*import\s*\{([^}]+)\}\s*from\s*(.+)$', re.MULTILINE)
export_interface = re.compile(r'(^\s*export\s+interface\s+\w+\s*\{)', re.MULTILINE)
interface_decl = re.compile(r'(^\s*interface\s+\w+\s*\{)', re.MULTILINE)
export_type = re.compile(r'(^\s*export\s+type\s+\w+[^{;]*[;{])', re.MULTILINE)
enum_decl = re.compile(r'(^\s*export\s+enum\s+(\w+)\s*\{)', re.MULTILINE)

# Patterns for type annotations in declarations and functions
param_type = re.compile(r'([\w$]+\s*\?)?\s*:\s*([^,)=]+)')
return_type = re.compile(r'\)\s*:\s*[^\s{]+')
arrow_type = re.compile(r'\:\s*[^,)=]+')
class_field_type = re.compile(r'^(\s*(?:public|private|protected)?\s*[\w$]+)\s*\??\s*:\s*[^=;]+(=[^;]+;|;)', re.MULTILINE)
implements_re = re.compile(r'\bimplements\s+[^{]+')
import_type_named = re.compile(r'\btype\s+([A-Za-z0-9_$]+)\b')
as_type_assert = re.compile(r'\s+as\s+[A-Za-z0-9_<>\[\]{}|,& ]+')

# Helper functions

def simplify_import_named(match: re.Match) -> str:
    names = match.group(1)
    rest = match.group(2)
    parts = [part.strip() for part in names.split(',') if part.strip()]
    kept = []
    for part in parts:
        if part.startswith('type '):
            continue
        kept.append(part)
    if not kept:
        return ''
    return f'import {{ {", ".join(kept)} }} from {rest}'


def remove_type_declarations(text: str) -> str:
    # Remove type-only import lines
    text = import_type_line.sub('', text)
    # Remove type-only named imports
    text = import_named_line.sub(simplify_import_named, text)
    # Remove import type * as React
    text = re.sub(r'^\s*import\s+type\s+\*\s+as\s+\w+\s+from\s+.*;[ \t]*\n?', '', text, flags=re.MULTILINE)
    # Remove export types and type declarations
    text = re.sub(r'(^\s*(?:export\s+)?type\s+\w+\s*=\s*[^;]+;\s*)', '', text, flags=re.MULTILINE)
    # Remove type alias blocks if multiline
    text = re.sub(r'(^\s*(?:export\s+)?type\s+\w+\s*=\s*\{[\s\S]*?\};\s*)', '', text, flags=re.MULTILINE)
    # Remove interface blocks
    text = remove_block_declarations(text, 'export interface')
    text = remove_block_declarations(text, 'interface')
    return text


def remove_block_declarations(text: str, start_keyword: str) -> str:
    pattern = re.compile(rf'(^\s*{re.escape(start_keyword)}\s+\w+\s*\{{)', re.MULTILINE)
    while True:
        match = pattern.search(text)
        if not match:
            break
        start = match.start(1)
        brace_count = 0
        i = match.end(1)
        while i < len(text):
            if text[i] == '{':
                brace_count += 1
            elif text[i] == '}':
                if brace_count == 0:
                    i += 1
                    break
                brace_count -= 1
            i += 1
        text = text[:start] + text[i:]
    return text


def convert_enum_blocks(text: str) -> str:
    idx = 0
    result = ''
    while True:
        match = enum_decl.search(text, idx)
        if not match:
            result += text[idx:]
            break
        result += text[idx:match.start()]
        enum_name = match.group(2)
        body_start = match.end()
        brace_count = 0
        i = body_start
        while i < len(text):
            if text[i] == '{':
                brace_count += 1
            elif text[i] == '}':
                brace_count -= 1
                if brace_count == 0:
                    body = text[body_start:i]
                    end = i + 1
                    break
            i += 1
        else:
            break
        entries = []
        for line in body.splitlines():
            line = line.strip().rstrip(',')
            if not line:
                continue
            if '=' in line:
                key, val = [part.strip() for part in line.split('=', 1)]
                entries.append(f'{key}: {val}')
            else:
                entries.append(line)
        obj = 'export const ' + enum_name + ' = {
' + ',\n'.join('  ' + e for e in entries) + '\n};\n'
        result += obj
        idx = end
    return result


def remove_type_annotations(text: str) -> str:
    # Remove constructor param properties
    text = convert_constructor_param_props(text)
    # Remove type return annotations on functions
    text = re.sub(r'\)\s*:\s*[^\s\{]+', ')', text)
    # Remove typed function param blocks like ({ ... }: SomeType)
    text = re.sub(r'\)\s*:\s*[^\)\{]+\)', ')', text)
    # Remove all explicit param type annotations in parameter lists
    text = re.sub(r'([\w$]+\??)\s*:\s*[^,)=]+', lambda m: m.group(1), text)
    # Remove type annotations in variable declarations
    text = re.sub(r'([const|let|var]+\s+[\w$]+)\s*:\s*[^=;]+(=|;)', lambda m: m.group(1) + m.group(2), text)
    # Remove class field type annotations
    text = class_field_type.sub(r'\1\2', text)
    # Remove 'implements' clauses
    text = implements_re.sub('', text)
    # Remove type assertions
    text = as_type_assert.sub('', text)
    return text


def convert_constructor_param_props(text: str) -> str:
    def repl(match: re.Match) -> str:
        params = match.group(1)
        args = []
        assigns = []
        for part in re.split(r',\s*(?![^<]*>)', params):
            part = part.strip()
            m = re.match(r'^(?:public |private |protected )?([\w$]+)\??\s*:\s*.*$', part)
            if m:
                name = m.group(1)
                args.append(name)
                assigns.append(f'    this.{name} = {name};')
            else:
                if part:
                    name = part.split(':')[0].strip()
                    args.append(name)
        body = '({})'.format(', '.join(args))
        return body + ' {
' + '\n'.join(assigns) + '\n'
    return re.sub(r'constructor\s*\(([^)]*)\)\s*\{', repl, text)


def clean_file(path: pathlib.Path) -> None:
    text = path.read_text(encoding='utf-8')
    text = remove_type_declarations(text)
    text = convert_enum_blocks(text)
    text = remove_type_annotations(text)
    text = text.replace('import React from "react";\n', '')
    path.write_text(text, encoding='utf-8')


def main() -> None:
    candidates = []
    for p in root.rglob('*'):
        if p.suffix in {'.ts', '.tsx'} and p.is_file() and 'node_modules' not in p.parts:
            rel = str(p.relative_to(root))
            if rel.startswith(('admin\\', 'client\\', 'shared\\')):
                candidates.append(p)
    for path in candidates:
        clean_file(path)
        if path.suffix == '.ts':
            new_path = path.with_suffix('.js')
            path.rename(new_path)
        elif path.suffix == '.tsx':
            new_path = path.with_suffix('.jsx')
            path.rename(new_path)

if __name__ == '__main__':
    main()
