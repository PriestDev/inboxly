import pathlib
import re

root = pathlib.Path(r'c:\xampp\htdocs\worknoon_remote')
file_exts = {'.php', '.js', '.css', '.md', '.json', '.txt', '.html', '.jsx', '.ts', '.tsx', '.yml', '.yaml', '.xml'}
patterns = [
    (re.compile(r'WORKNOON_CHAT'), 'INBOXLY_CHAT'),
    (re.compile(r'WORKNOON'), 'INBOXLY'),
    (re.compile(r'WorkNoon'), 'Inboxly'),
    (re.compile(r'Worknoon'), 'Inboxly'),
    (re.compile(r'worknoon_chat'), 'inboxly_chat'),
    (re.compile(r'worknoon-chat'), 'inboxly-chat'),
    (re.compile(r'worknoon'), 'inboxly'),
]
changed = []
for path in root.rglob('*'):
    # skip generated and dependency folders
    pstr = str(path).lower()
    if any(x in pstr for x in ('node_modules', 'frontend\\build', 'frontend/build', '.cache', '.git')):
        continue
    if path.is_file() and path.suffix.lower() in file_exts:
        try:
            text = path.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            continue
        new_text = text
        for pat, repl in patterns:
            new_text = pat.sub(repl, new_text)
        if new_text != text:
            path.write_text(new_text, encoding='utf-8')
            changed.append(str(path.relative_to(root)))
print('changed', len(changed))
for p in changed:
    print(p)
