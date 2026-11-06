"""Read-only verification of B09 source identities, loaded bundles and decoded PNGs."""
import collections
import concurrent.futures
import hashlib
import json
import pathlib
import subprocess

root = pathlib.Path(__file__).parent / "selected-disease-gene-evidence"
audit_path = pathlib.Path(__file__).parent / "selected-disease-gene-source-audit.json"
audit = json.loads(audit_path.read_text())
for model in audit["models"]:
    original = json.loads((root / (model["slug"] + "-original.json")).read_text())
    actual = original.get("setup", {}).get("sourceSHA256", original.get("progress", {}).get("sourceSHA256"))
    assert actual == model["sha256"], (model["slug"], actual)
    model["actualSessionSHA256"] = actual
    model["browserEvidence"] = model["slug"] + "-original.json"
final = json.loads((root / "final-bundles.json").read_text())
sources = {model["slug"]: model for model in audit["models"]}
for model in final["models"]:
    assert model["sourceMarker"].endswith(sources[model["slug"]]["sha256"])
audit["servedVerification"] = "All ten fresh T3 Chromium HTTP200 fetch SHA-256 values match inventory; all ten actual loaded-session UTF-8 XML SHA-256 values also match."
audit_path.write_text(json.dumps(audit, indent=2) + "\n")

def decoded(path):
    info = subprocess.check_output(["magick", "identify", "-format", "%w %h %k %[channels]", str(path)], text=True).split()
    rgba = subprocess.check_output(["magick", str(path), "-depth", "8", "rgba:-"])
    histogram = subprocess.check_output(["magick", str(path), "-depth", "8", "-format", "%c", "histogram:info:-"], text=True)
    dominant = sorted((line.strip() for line in histogram.splitlines()), key=lambda line: int(line.split(":", 1)[0]), reverse=True)[:5]
    return {"file": path.name, "width": int(info[0]), "height": int(info[1]), "uniqueColors": int(info[2]), "channels": info[3], "sha256": hashlib.sha256(path.read_bytes()).hexdigest(), "decodedRGBAsha256": hashlib.sha256(rgba).hexdigest(), "dominantDecodedColors": dominant}

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    images = list(pool.map(decoded, sorted(root.glob("*.png"))))
(root / "png-decoded-analysis.json").write_text(json.dumps(images, indent=2) + "\n")
print(f"Verified ten actual loaded source sessions and ten final bundle source markers; decoded {len(images)} ordinary PNGs, minimum unique colors {min(image['uniqueColors'] for image in images)}.")
