"""Validate dossier structure and regenerate the research ledger (no network claims)."""
import json
import pathlib
import re
import hashlib
import urllib.parse
import xml.etree.ElementTree as ET
from collections import Counter
from datetime import datetime, timezone

ROOT = pathlib.Path(__file__).resolve().parent
selection = json.loads((ROOT / 'selection.json').read_text())['models']
assert len(selection) == len({m['slug'] for m in selection}) == 200
entries = []
errors = []
publication_records = []
expected_slugs = {m['slug'] for m in selection}
actual_slugs = {p.stem for p in ROOT.glob('*.json')} - {'selection', 'status'}
if actual_slugs != expected_slugs:
    errors.append(f'dossier inventory mismatch: missing={expected_slugs-actual_slugs}, extra={actual_slugs-expected_slugs}')
for m in selection:
    slug = m['slug']
    path = ROOT / f'{slug}.json'
    issues = []
    try:
        d = json.loads(path.read_text())
    except Exception as exc:
        errors.append(f'{slug}: unreadable: {exc}')
        continue
    for key in ('slug', 'catalogPath', 'launchUrl', 'deliveryBatch'):
        if d.get(key) != m[key]:
            issues.append(f'selection identity mismatch: {key}')
    if not (ROOT / f'{slug}.md').is_file():
        issues.append('missing Markdown dossier')
    words = len(d.get('miniText', '').split())
    publications = d.get('publications', [])
    publication_records.extend(publications)
    if d.get('status') == 'complete':
        if not 100 <= words <= 160:
            issues.append(f'miniText word count {words}')
        if len(publications) != 3:
            issues.append(f'publication count {len(publications)}')
        keys = [str(p.get('doi') or p.get('title', '')).lower().strip() for p in publications]
        if len(set(keys)) != 3 or any(not k for k in keys):
            issues.append('publications must be three unique works')
        work_keys = [(re.sub(r'\W+', '', p.get('title', '').lower()), p.get('year'),
                      tuple(p.get('authors', []))) for p in publications]
        if len(set(work_keys)) != 3:
            issues.append('publication identities are not three distinct works')
        for i, p in enumerate(publications, 1):
            if p.get('verified') is not True:
                issues.append(f'publication {i}: bibliography not marked verified')
            for key in ('authors', 'title', 'year', 'venue', 'url', 'relevance'):
                if not p.get(key):
                    issues.append(f'publication {i}: missing {key}')
            if not re.match(r'https?://', p.get('url', '')):
                issues.append(f'publication {i}: invalid URL')
            v = p.get('verification', {})
            for key in ('consultedUrl', 'checkedAt', 'evidenceType', 'access', 'notes'):
                if not v.get(key):
                    issues.append(f'publication {i}: missing verification.{key}')
            if p.get('doi') and not re.match(r'^10\.\d{4,9}/\S+$', p['doi']):
                issues.append(f'publication {i}: malformed DOI')
            if '\ufffd' in p.get('title', ''):
                issues.append(f'publication {i}: corrupt title character')
            paths = [v[k] for k in ('evidenceFile', 'evidencePath', 'snapshot') if v.get(k)]
            paths.extend(v.get('additionalEvidenceFiles', []))
            if not paths:
                issues.append(f'publication {i}: missing retained evidence')
            for evidence in paths:
                if not (ROOT / evidence).is_file():
                    issues.append(f'publication {i}: missing evidence file {evidence}')
            if p.get('doi') and paths and not any(
                p['doi'].lower() in urllib.parse.unquote((ROOT / evidence).read_text(errors='replace')).lower()
                for evidence in paths if (ROOT / evidence).is_file()
            ):
                issues.append(f'publication {i}: DOI absent from retained primary evidence')
        for key in ('url', 'checkedAt', 'revision', 'evidence'):
            if not d.get('modelSource', {}).get(key):
                issues.append(f'missing modelSource.{key}')
        if d.get('gaps'):
            issues.append('complete dossier has unresolved gaps')
        if d.get('miniText', '') not in (ROOT / f'{slug}.md').read_text():
            issues.append('Markdown companion does not contain authoritative miniText')
        source = d.get('modelSource', {})
        source_path = next((ROOT / source[k] for k in ('evidenceFile', 'evidencePath', 'sourceSnapshot') if source.get(k)), None)
        if source_path is None or not source_path.is_file():
            issues.append('missing original source snapshot')
        else:
            original = source_path.read_bytes()
            actual_hash = hashlib.sha256(original).hexdigest()
            declared = source.get('sha256') or next(iter(re.findall(r'[a-f0-9]{64}', source.get('revision', ''))), None)
            if declared != actual_hash:
                issues.append('original source SHA-256 mismatch or missing hash')
            try:
                root = ET.fromstring(original)
                if root.find('info') is None or root.find('code') is None:
                    issues.append('original source lacks Info or Procedures')
            except ET.ParseError:
                issues.append('original snapshot is not valid NetLogo XML')
        if source.get('url') != m['launchUrl'].split('#', 1)[1]:
            issues.append('original source URL differs from selected launcher target')
    errors.extend(f'{slug}: {issue}' for issue in issues)
    entries.append({'slug': slug, 'name': m['name'], 'deliveryBatch': m['deliveryBatch'],
                    'status': d.get('status', 'incomplete'), 'wordCount': words,
                    'publicationCount': len(publications), 'validationIssues': issues})
counts = Counter(e['status'] for e in entries)
result = {'checkedAt': datetime.now(timezone.utc).isoformat(), 'total': 200,
          'complete': counts['complete'], 'incomplete': 200-counts['complete'],
          'statusCounts': dict(counts), 'validationErrors': errors, 'models': entries,
          'limits': 'Structural validation only. Online evidence is recorded per publication; this validator does not independently verify scientific relevance or bibliographic truth.'}
result['publicationAssignments'] = len(publication_records)
result['uniquePublications'] = len({str(p.get('doi') or p.get('url')).lower() for p in publication_records})
result['miniTextWordRange'] = [min(e['wordCount'] for e in entries), max(e['wordCount'] for e in entries)]
result['batchCounts'] = {batch: dict(Counter(e['status'] for e in entries if e['deliveryBatch'] == batch)) for batch in sorted({e['deliveryBatch'] for e in entries})}
(ROOT / 'status.json').write_text(json.dumps(result, indent=2)+'\n')
lines = ['# Research index', '', f"Complete: {counts['complete']}/200. Open: {200-counts['complete']}/200.", '',
         'Literature research status only; no runtime or independent implementation acceptance is implied.', '',
         '| Model | Batch | Research status | Words | Publications |', '| --- | --- | --- | ---: | ---: |']
for e in entries:
    lines.append(f"| [{e['name']}]({e['slug']}.md) · [JSON]({e['slug']}.json) | {e['deliveryBatch']} | {e['status']} | {e['wordCount']} | {e['publicationCount']} |")
(ROOT / 'INDEX.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'total': 200, 'complete': counts['complete'], 'open': 200-counts['complete'], 'validationErrors': errors}, indent=2))
raise SystemExit(bool(errors))
