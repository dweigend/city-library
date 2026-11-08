# Erosion

Status: **complete** · Checked: 2026-11-05 · Mini-text: 130 words

The scientific question is whether downhill water transport can reorganize terrain into drainage patterns. In NetLogo's Erosion model, rain adds water to patches, flow moves toward lower neighboring water levels and proportional erosion lowers source-cell elevation while boundaries drain material. The selected literature connects this mechanism to coupled runoff and landscape change: detachment-limited drainage modeling connects flow with evolving topography [1]; landscape-evolution research exposes process and scale assumptions [2]; spatial soil-evolution modeling adds depth and hillslope responses absent here [3]. The source calls its flow scheme naive; simplified routing, erosion and sediment treatment omit many hydraulic processes and prevent direct prediction of real catchments. The original NetLogo behavior is the baseline for reimplementation. This simulation offers a controlled thought experiment, and agreement with its output does not establish empirical validation.

## Model provenance

[Selected NetLogo Web model](https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Earth%20Science/Erosion.nlogox) · [Served source snapshot](evidence/social-urban/erosion.nlogox)

For the model itself: * Dunham, G., Tisue, S. and Wilensky, U. (2004). NetLogo Erosion model. http://ccl.northwestern.edu/netlogo/models/Erosion. Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

Scientific origin recorded in Info: Here is an eroded volcano in Kamchatka with a strong resemblance to this model: https://www.google.com/maps/@52.544312,157.338467,7882m/data=!3m1!1e3?dg=dbrw&newdg=1 Thanks to Greg Dunham and Seth Tisue for their work on this model.

Source revision: Served NetLogo Web snapshot retrieved 2026-11-05; {'version': 'NetLogo 7.0.4', 'snapToGrid': 'true'}. SHA-256: `f7aa10a27576e9bf059a64474e38818a388e3c36932c52250bc506c20c733465`.

This literature dossier is separate from runtime execution, empirical validation and independent implementation approval.

## Scientific publications

### [1] A detachment‐limited model of drainage basin evolution

Alan D. Howard (1994). *Water Resources Research*. [Canonical record](https://doi.org/10.1029/94wr00757). DOI: 10.1029/94wr00757.

Model relevance: detachment-limited drainage modeling connects flow with evolving topography.

Verification: [abstract](https://api.crossref.org/works/10.1029%2F94WR00757), 2026-11-05. Public Crossref registrant metadata; publisher-deposited abstract available. Exact title, complete author list, year, venue and DOI checked against the saved DOI-registrant record. Initials are retained where the primary record supplies initials; no names expanded by guesswork. Full text not claimed. [Saved evidence](evidence/social-urban/howard-crossref.json).

### [2] Modelling landscape evolution

Gregory E. Tucker; Gregory R. Hancock (2010). *Earth Surface Processes and Landforms*. [Canonical record](https://doi.org/10.1002/esp.1952). DOI: 10.1002/esp.1952.

Model relevance: landscape-evolution research exposes process and scale assumptions.

Verification: [abstract](https://api.crossref.org/works/10.1002%2Fesp.1952), 2026-11-05. Public Crossref registrant metadata; publisher-deposited abstract available. Exact title, complete author list, year, venue and DOI checked against the saved DOI-registrant record. Initials are retained where the primary record supplies initials; no names expanded by guesswork. Full text not claimed. [Saved evidence](evidence/social-urban/tuckerreview-verified.json).

### [3] The mARM3D spatially distributed soil evolution model: Three‐dimensional model framework and analysis of hillslope and landform responses

Sagy Cohen; Garry Willgoose; Greg Hancock (2010). *Journal of Geophysical Research: Earth Surface*. [Canonical record](https://doi.org/10.1029/2009jf001536). DOI: 10.1029/2009jf001536.

Model relevance: spatial soil-evolution modeling adds depth and hillslope responses absent here.

Verification: [abstract](https://api.crossref.org/works/10.1029%2F2009JF001536), 2026-11-05. Public Crossref registrant metadata; publisher-deposited abstract available. Exact title, complete author list, year, venue and DOI checked against the saved DOI-registrant record. Initials are retained where the primary record supplies initials; no names expanded by guesswork. Full text not claimed. [Saved evidence](evidence/social-urban/soil-verified.json).
