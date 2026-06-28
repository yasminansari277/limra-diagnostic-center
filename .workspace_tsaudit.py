import pathlib, re, json
root = pathlib.Path('c:/Users/yasme/limra-diagnostic-center')
results = []
for p in root.rglob('*'):
    if p.suffix in {'.ts', '.tsx'} and p.is_file() and 'node_modules' not in p.parts:
        rel = str(p.relative_to(root))
        if rel.startswith(('admin\\', 'client\\', 'shared\\')):
            text = p.read_text(encoding='utf-8', errors='ignore')
            ts_patterns = [r"\bimport\s+type\b", r"\bexport\s+type\b", r"\btype\b", r"\binterface\b", r"\benum\b", r"\bimplements\b", r"\bextends\b", r"\bReact\.ComponentProps<", r"\b:\s*[A-Za-z_][A-Za-z0-9_<>\[\]]*", r"\b\w+\s*\?:"]
            score = sum(len(re.findall(pat, text)) for pat in ts_patterns)
            results.append((rel, p.suffix, score))
results.sort(key=lambda x: (x[2], x[1], x[0]))
print(json.dumps([item for item in results if item[2] == 0], indent=2))
