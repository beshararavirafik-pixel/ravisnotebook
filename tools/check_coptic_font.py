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
from import_hazzat_pascha import decode
assert decode(':wk') == 'Ⲑⲱⲕ'
assert decode('amyn') == 'ⲁⲙⲏⲛ'
assert decode('amahi') == 'ⲁⲙⲁϩⲓ'
assert decode('`aga;oc') == 'ⲁ̀ⲅⲁⲑⲟⲥ'
assert decode('I=y=c') == 'Ⲓ̅ⲏ̅ⲥ'
assert files, 'No hymn files checked'
assert not missing, f'Unsupported Coptic letters: {missing}'
# Coptic1 uses / and ? for eta; h and H for hori, unlike CS Coptic fonts.
assert cmap[0x2C8F] == original.getBestCmap()[ord('/')]
assert cmap[0x2C8E] == original.getBestCmap()[ord('?')]
assert cmap[0x3E9] == original.getBestCmap()[ord('h')]
assert cmap[0x3E8] == original.getBestCmap()[ord('H')]
assert all(c in cmap for c in [0x300, 0x305, 0xFE26]), 'Missing accents'
print(f'Passed: {len(files)} hymns, original outlines and keyboard mappings, Coptic letters and accents.')
