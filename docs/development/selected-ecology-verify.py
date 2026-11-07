"""Verify retained B06 identities, hashes and observed browser invariants; does not rerun Chromium."""
from pathlib import Path
import hashlib
import json
import math
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = ROOT / "docs/development/selected-ecology-evidence"
SLUGS = "simple-birth-rates daisyworld termites shepherds rabbits-grass-weeds invasive-plants ants heatbugs flocking fireflies".split()

def read(name):
    return json.loads((EVIDENCE / name).read_text())

def trace(slug, side, phase):
    return read(f"{slug}-{side}-{phase}.json")

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

manifest = json.loads((ROOT / "docs/development/selected-ecology-sources.json").read_text())
selection = json.loads((ROOT / "experiments/catalog/selection/selection.json").read_text())["models"]
assert [row["slug"] for row in manifest] == SLUGS
for row in manifest:
    slug = row["slug"]
    selected = next(item for item in selection if item["slug"] == slug)
    assert row["catalogPath"] == selected["catalogPath"]
    source = ROOT / f"experiments/{slug}/source.nlogox"
    assert digest(source) == row["sha256"]
    code = ET.parse(source).getroot().findtext("code")
    assert hashlib.sha256(code.encode()).hexdigest() == row["codeSha256"]
    for phase in ["setup", "progress"]:
        original = trace(slug, "source", phase)
        assert original["sha256"] == row["sha256"]
        assert original["version"] == "NetLogo 7.0.4"
        assert "Chrome/156." in original["userAgent"]
        assert (EVIDENCE / f"{slug}-source-{phase}.png").is_file()
    setup = trace(slug, "target", "setup")
    progress = trace(slug, "target", "progress")
    dark = trace(slug, "target", "desktop-dark")
    light_mobile = trace(slug, "target", "mobile-light")
    dark_mobile = trace(slug, "target", "mobile-dark")
    assert int(setup["monitors"][0].splitlines()[1]) == 0
    expected = 100 if slug == "termites" else 50 if slug in ["ants", "shepherds"] else 10
    assert int(progress["monitors"][0].splitlines()[1]) == expected
    for phase, observed in [("setup", setup), ("progress", progress), ("desktop-dark", dark), ("mobile-light", light_mobile), ("mobile-dark", dark_mobile)]:
        assert not observed["overflow"]
        assert all("error" not in item for item in observed["readback"])
        assert observed["readback"][0]["nonblack"] > 0
        assert all(len(asset["sha256"]) == 64 for asset in observed["assets"])
        assert (EVIDENCE / f"{slug}-target-{phase}.png").is_file()
    assert progress["readback"][0]["rgbaFNV32"] == dark["readback"][0]["rgbaFNV32"]
    assert light_mobile["readback"][0]["rgbaFNV32"] == dark_mobile["readback"][0]["rgbaFNV32"]
    mobile = read(f"{slug}-target-mobile-controls.json")
    assert int(mobile["step"]["clock"]) == 1
    assert int(mobile["paused"]["clock"]) > 1
    assert int(mobile["reset"]["clock"]) == 0
    assert not mobile["reset"]["overflow"]
    assert not mobile["reset"]["duplicates"]

for line in (ROOT / "examples/selected-ecology/SHA256SUMS").read_text().splitlines():
    sha, path = line.split("  ", 1)
    assert digest(ROOT / path) == sha

# Compare source-derived deterministic observations, never cross-RNG trajectories.
heating = 72 * math.log((1 - 0.4) * 0.8) + 80
assert abs(trace("daisyworld", "source", "thermal-recurrence")["globals"]["global-temperature"] - heating * 0.75) < 1e-10
source_wood = [trace("termites", "source", p) for p in ["setup", "progress"]]
assert all(d["tick"] is None for d in source_wood)
assert source_wood[0]["patchColors"]["45"] == source_wood[1]["patchColors"]["45"]
wood = [trace("termites", "target", p)["monitors"][0].splitlines() for p in ["setup", "progress"]]
assert int(wood[0][3]) + int(wood[0][5]) == int(wood[1][3]) + int(wood[1][5])
assert "Maximum call stack size exceeded" in read("termites-source-empty-recursion-error.json")["observation"]["text"]
for slug, phase in [("rabbits-grass-weeds", "zero-plot-error"), ("fireflies", "empty-ticking")]:
    assert "SET-PLOT-Y-RANGE" in trace(slug, "source", phase)["text"]
assert trace("rabbits-grass-weeds", "source", "extinction-preflight")["tick"] == 0
assert trace("fireflies", "source", "empty-go")["tick"] == 3
assert "No heading is defined" in trace("flocking", "source", "coincident-towards")["text"]
assert "observer: [180 180]" in trace("flocking", "source", "heading-tie")["text"]
a = trace("flocking", "source", "no-vision-before")["turtles"]
b = trace("flocking", "source", "no-vision-after")["turtles"]
assert [(t["id"], t["heading"]) for t in a] == [(t["id"], t["heading"]) for t in b]
assert read("invasive-plants-source-partial-forward-position.json")["observed"][0]["x"] == 16
assert trace("invasive-plants", "source", "draw-resistance")["patchTotals"] == {"infestation": 0, "resistance": 100}
assert trace("heatbugs", "source", "heat-up")["patchTotals"]["temp"] == 250000
assert trace("heatbugs", "source", "deep-freeze")["patchTotals"]["temp"] == 0
assert read("keyboard-focus.json")["focusVisible"]
print("B06 retained evidence: ten identities/source hashes, five frozen scripts, seventy primary images, desktop/mobile themes, mobile controls and source invariants verified. Independent approval remains pending.")
