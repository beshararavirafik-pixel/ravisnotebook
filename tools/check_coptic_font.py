"""Verify supplied outlines, keyboard mappings and library Unicode letter coverage."""
from pathlib import Path
import json, unicodedata
from fontTools.ttLib import TTFont
root = Path(__file__).resolve().parent.parent
original = TTFont(root / 'fonts/Coptic1.ttf')
web = TTFont(root / 'fonts/Coptic1-Unicode.ttf')
cmap = web.getBestCmap()
for code, name in original.getBestCmap().items():
    assert cmap[code] == name, f'Keyboard mapping changed: {code}'
for name in original.getGlyphOrder():
    assert original['glyf'][name].compile(original['glyf']) == web['glyf'][name].compile(web['glyf']), f'Outline changed: {name}'
missing = set()
files = list((root / 'assets/resources').glob('hymns-*.json'))
for path in files:
    data = json.loads(path.read_text())
    for unit in data.get('units', []):
        for text in unit.get('verses', {}).get('coptic', []):
            missing.update(c for c in text if 'COPTIC' in unicodedata.name(c, '') and unicodedata.category(c).startswith('L') and ord(c) not in cmap)
assert files, 'No hymn files checked'
assert not missing, f'Unsupported Coptic letters: {missing}'
assert all(c in cmap for c in [0x300, 0x305, 0xFE26]), 'Missing accents'
print(f'Passed: {len(files)} hymns, original outlines and keyboard mappings, Coptic letters and accents.')
