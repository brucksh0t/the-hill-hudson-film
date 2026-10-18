# Inline src/styles.css into src/index.html -> index.html (critical CSS inline, no render-blocking stylesheet).
import re,pathlib
R=pathlib.Path(__file__).resolve().parent.parent
css=(R/'src/styles.css').read_text()
css=re.sub(r'/\*.*?\*/','',css,flags=re.S); css=re.sub(r'\n\s*','\n',css).strip()
html=(R/'src/index.html').read_text().replace('/*@CSS@*/',css)
(R/'index.html').write_text(html); print('index.html',len(html),'bytes; css',len(css))
