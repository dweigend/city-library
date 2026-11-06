/** NetLogo DNA Protein Synthesis: source-specific sequences and event procedures. */
import { Agent, Graph, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export type Strand = "original" | "duplicate";
export type DNAPreset =
  | "from user-created-code"
  | "no genes (short strand)"
  | "no genes (long strand)"
  | "1 short gene"
  | "1 long gene"
  | "2 sequential genes"
  | "2 nested genes"
  | "3 sequential genes"
  | "random (short strand)"
  | "random (long strand)";
export interface DNAParameters {
  seed: number;
  initialDNAString: DNAPreset;
  userCreatedCode: string;
  nucleotidesAffected: number;
  mutationType: "deletion" | "insertion" | "substitution";
  showGenes: boolean;
}
export const inputs: Inputs<DNAParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  initialDNAString: {
    kind: "choice",
    default: "1 long gene",
    options: [
      "from user-created-code",
      "no genes (short strand)",
      "no genes (long strand)",
      "1 short gene",
      "1 long gene",
      "2 sequential genes",
      "2 nested genes",
      "3 sequential genes",
      "random (short strand)",
      "random (long strand)",
    ],
  },
  userCreatedCode: { kind: "text", default: "AAAAA" },
  nucleotidesAffected: {
    kind: "number",
    default: 1,
    min: 1,
    max: 6,
    integer: true,
  },
  mutationType: {
    kind: "choice",
    default: "substitution",
    options: ["deletion", "insertion", "substitution"],
  },
  showGenes: { kind: "boolean", default: true },
};
const aminoAcidKey: Readonly<Record<string, string>> = {
  UUU: "Phe",
  UUC: "Phe",
  UUA: "Leu",
  UUG: "Leu",
  CUU: "Leu",
  CUC: "Leu",
  CUA: "Leu",
  CUG: "Leu",
  AUU: "Ile",
  AUC: "Ile",
  AUA: "Ile",
  AUG: "Met",
  GUU: "Val",
  GUC: "Val",
  GUA: "Val",
  GUG: "Val",
  UCU: "Ser",
  UCC: "Ser",
  UCA: "Ser",
  UCG: "Ser",
  CCU: "Pro",
  CCC: "Pro",
  CCA: "Pro",
  CCG: "Pro",
  ACU: "Thr",
  ACC: "Thr",
  ACA: "Thr",
  ACG: "Thr",
  GCU: "Ala",
  GCC: "Ala",
  GCA: "Ala",
  GCG: "Ala",
  UAU: "Tyr",
  UAC: "Tyr",
  UAA: "Stop",
  UAG: "Stop",
  CAU: "His",
  CAC: "His",
  CAA: "Gln",
  CAG: "Gln",
  AAU: "Asn",
  AAC: "Asn",
  AAA: "Lys",
  AAG: "Lys",
  GAU: "Asp",
  GAC: "Asp",
  GAA: "Glu",
  GAG: "Glu",
  UGU: "Cys",
  UGC: "Cys",
  UGA: "Stop",
  UGG: "Trp",
  CGU: "Arg",
  CGC: "Arg",
  CGA: "Arg",
  CGG: "Arg",
  AGU: "Ser",
  AGC: "Ser",
  AGA: "Arg",
  AGG: "Arg",
  GGU: "Gly",
  GGC: "Gly",
  GGA: "Gly",
  GGG: "Gly",
};
export function complementaryMRNABase(base: string): string {
  return (
    ({ A: "U", T: "A", U: "A", G: "C", C: "G" } as Record<string, string>)[
      base
    ] ?? ""
  );
}
export function mrnaStringFromDNAString(dna: string): string {
  return [...dna].map(complementaryMRNABase).join("");
}
export function whichProteinForThisCodon(codon: string): string {
  const value = aminoAcidKey[codon];
  if (value === undefined)
    throw new RangeError("Source codon is absent from the amino-acid table.");
  return value;
}
interface MoleculeData {
  who: number;
  breed:
    | "gene"
    | "nucleotide"
    | "promoter"
    | "terminator"
    | "mrna"
    | "mrna-nucleotide"
    | "trna"
    | "trna-nucleotide"
    | "amino-acid"
    | "protein"
    | "tag";
  strand: Strand;
  geneNumber: number;
  code: string;
  value: string;
  place: number;
  startPosition: number;
  endPosition: number;
  capType: "start" | "stop";
  traveling: boolean;
  released: boolean;
  hidden: boolean;
  color: string;
}
type Molecule = Agent<MoleculeData>;
const presets: Partial<Record<DNAPreset, string>> = {
  "no genes (short strand)": "ATTATATCGTAG",
  "no genes (long strand)":
    "GATATTTGGTAGCCCGAGAAGTGGTTTTTCAGATAACAGAGGTGGAGCAGCTTTTAG",
  "1 short gene": "ATTATGTGGTAG",
  "1 long gene": "GGGATGGACACCTTATCATTTGCTACTAGCGACCAGTTTGAGTAGCTTCGTCGGTGA",
  "2 sequential genes":
    "AGTATGAAAACCCACGAGTGGTAGCCCGAGATTGAGATGTGGTTTTTCAGATAACAG",
  "2 nested genes": "GTTATGAGGGGGACCCGAGATGTGGTTTTTGAAATAGACAAGTAGACCCTAATAGAC",
  "3 sequential genes":
    "GATATGTGGTAGCCCGAGATGTGGTTTTTCAGATAACAGATGTGGAGCAGCTTTTAG",
};
const instructions = [
  "Explore protein synthesis from DNA and effects of mutations.",
  "Setup creates a single unwound DNA strand in the nucleus.",
  "Run and press 1. transcribe to display the next original mRNA.",
  "Press 2. release to move mRNA from nucleus to ribosome.",
  "Press 3. translate to pair tRNA with mRNA triplets.",
  "Press 4. release to produce the amino-acid chain.",
  "Repeat steps 1–4 to cycle through all original genes.",
  "Replicate DNA to create the duplicate strand.",
  "The chosen number and type of mutations affect the replicated DNA.",
  "Use steps 6–9 to produce proteins from duplicate genes.",
  "Choose user-created code to explore a custom sequence of A, G, T and C.",
] as const;
export function create(options: Partial<DNAParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const space = { x: 31, y: 16, boundary: "wrap" } as const;
  const world = World.add(space, { random });
  const grid = Grid.add(space);
  const backbones = Graph.add<Molecule>();
  world.add(grid);
  let who = 0;
  let originalDNAString = "";
  let duplicateDNAString = "";
  let originalDisplayMRNACounter = 0;
  let duplicateDisplayMRNACounter = 0;
  let currentInstruction = 1;
  let message = "";
  const triggered = new Set<number>();
  const completed = new Set<number>();
  const history: {
    tick: number;
    originalProteins: number;
    duplicateProteins: number;
  }[] = [];
  const all = () => world.agents as readonly Molecule[];
  const molecules = (kind: Molecule["breed"], strand?: Strand) =>
    all().filter(
      (p) => p.breed === kind && (strand === undefined || p.strand === strand),
    );
  const shuffled = (values: readonly Molecule[]) =>
    random.sample(values, {
      count: values.length,
      compatibility: "legacy-shuffle",
    });
  const yDNA = (strand: Strand) => (strand === "original" ? 1 : -2);
  const yRibosome = (strand: Strand) => (strand === "original" ? 4 : -7);
  function addMolecule(
    breed: Molecule["breed"],
    strand: Strand,
    geneNumber = 0,
    x = 0,
    y = 0,
    overrides: Partial<MoleculeData> = {},
  ) {
    // Source x=[0,30], y=[-8,7] is translated to the centered library Space.
    const p = world.add(
      Agent.add<MoleculeData>(
        {
          who: who++,
          breed,
          strand,
          geneNumber,
          code: "",
          value: "",
          place: 0,
          startPosition: 0,
          endPosition: 0,
          capType: "start",
          traveling: false,
          released: false,
          hidden: false,
          color: "#dedede",
          ...overrides,
        },
        { position: { x: x - 15, y: y + 0.5 } },
      ),
    );
    backbones.nodes.add(p);
    return p;
  }
  function link(parent: Molecule, child: Molecule) {
    backbones.edges.add({ from: parent, to: child, directed: true });
  }
  function randomBaseLetterDNA() {
    return ["A", "G", "T", "C"][
      random.number({ min: 0, max: 4, integer: true })
    ]!;
  }
  function replaceNonNucleotideCharacter(character: string) {
    return /^[ATCG]$/.test(character) ? character : randomBaseLetterDNA();
  }
  function dnaStringWithNonNucleotideCharactersReplaced(dna: string) {
    // The source replaces every character before truncating to 64, consuming those draws.
    return [...dna].map(replaceNonNucleotideCharacter).join("").slice(0, 64);
  }
  function setupDNAString() {
    if (settings.initialDNAString === "from user-created-code")
      originalDNAString = dnaStringWithNonNucleotideCharactersReplaced(
        settings.userCreatedCode,
      );
    else if (settings.initialDNAString.startsWith("random")) {
      const length =
        settings.initialDNAString === "random (short strand)" ? 12 : 56;
      originalDNAString = Array.from({ length }, randomBaseLetterDNA).join("");
    } else originalDNAString = presets[settings.initialDNAString]!;
  }
  function buildGenesFromDNA(strand: Strand, dna: string) {
    let geneNumber = 0;
    for (let index = 2; index < dna.length; index++)
      if (dna.slice(index - 2, index + 1) === "ATG") {
        geneNumber++;
        const code = "ATG" + dna.slice(index + 1);
        addMolecule("gene", strand, geneNumber, 0, yDNA(strand), {
          code,
          startPosition: index,
          endPosition: originalDNAString.length,
          hidden: true,
        });
      }
    // Source iterates ALL genes here, including existing original genes during replication.
    for (const gene of shuffled(molecules("gene"))) {
      for (let i = 0; i < Math.floor(gene.code.length / 3); i++) {
        if (["TAG", "TGA", "TAA"].includes(gene.code.slice(i * 3, i * 3 + 3))) {
          gene.endPosition = i * 3;
          gene.code = gene.code.slice(0, i * 3);
          break;
        }
      }
    }
  }
  function makeANucleotideChainForDNAString(strand: Strand, dna: string) {
    for (let index = 0; index < dna.length; index++)
      addMolecule("nucleotide", strand, 0, 1 + index * 0.45, yDNA(strand), {
        value: dna[index]!,
        place: index,
        color: (
          { A: "#63bd56", T: "#ec5f5f", C: "#5a9be4", G: "#e5cc4b" } as Record<
            string,
            string
          >
        )[dna[index]!]!,
      });
  }
  function attachTag(parent: Molecule, value: string) {
    const tag = addMolecule(
      "tag",
      parent.strand,
      parent.geneNumber,
      parent.x + 15,
      parent.y - 0.5 + 0.6,
      { value, hidden: parent.hidden, color: parent.color },
    );
    link(parent, tag);
    return tag;
  }
  function buildMRNAForEachGene(strand: Strand) {
    for (const gene of shuffled(molecules("gene", strand))) {
      const x = 0.1 + gene.startPosition * 0.45;
      gene.move({ to: { x: x - 15, y: yDNA(strand) + 0.5 } });
      const promoter = addMolecule(
        "promoter",
        strand,
        gene.geneNumber,
        x,
        yDNA(strand),
        { color: "#6cc777" },
      );
      const terminator = addMolecule(
        "terminator",
        strand,
        gene.geneNumber,
        x + gene.code.length * 0.45,
        yDNA(strand),
        { color: "#ef7777" },
      );
      link(gene, promoter);
      link(gene, terminator);
      attachTag(promoter, `start:${gene.geneNumber}`);
      attachTag(terminator, `end:${gene.geneNumber}`);
      const code = mrnaStringFromDNAString(gene.code);
      const start = addMolecule(
        "mrna",
        strand,
        gene.geneNumber,
        x,
        yDNA(strand),
        { code, capType: "start", color: "#efb85c" },
      );
      const end = addMolecule(
        "mrna",
        strand,
        gene.geneNumber,
        x + code.length * 0.45,
        yDNA(strand),
        { code, capType: "stop", color: "#efb85c" },
      );
      link(gene, start);
      link(start, end);
      for (let i = 0; i < code.length; i++) {
        const nucleotide = addMolecule(
          "mrna-nucleotide",
          strand,
          gene.geneNumber,
          x + i * 0.45,
          yDNA(strand),
          { value: code[i]!, place: i, color: "#efb85c" },
        );
        link(start, nucleotide);
        attachTag(nucleotide, code[i]!);
      }
    }
  }
  function buildTRNAForThisTriplet(
    mrna: Molecule,
    triplet: string,
    place: number,
  ) {
    const x = mrna.x + 15 + 0.45 + place * 3 * 0.45;
    const trna = addMolecule(
      "trna",
      mrna.strand,
      mrna.geneNumber,
      x,
      yRibosome(mrna.strand) + 1,
      { place, color: "#bda0e8" },
    );
    const amino = addMolecule(
      "amino-acid",
      mrna.strand,
      mrna.geneNumber,
      x,
      yRibosome(mrna.strand) + 2,
      { place, value: whichProteinForThisCodon(triplet), color: "#e4cc7c" },
    );
    link(trna, amino);
    attachTag(amino, amino.value);
    for (let i = 0; i < 3; i++) {
      const nucleotide = addMolecule(
        "trna-nucleotide",
        mrna.strand,
        mrna.geneNumber,
        x - 0.45 + i * 0.45,
        yRibosome(mrna.strand),
        { place: i, value: triplet[i]!, color: "#bda0e8" },
      );
      link(trna, nucleotide);
    }
  }
  function buildProteinFromMRNA(strand: Strand) {
    for (const mrna of shuffled(
      molecules("mrna", strand).filter((p) => p.capType === "start"),
    ))
      for (let index = 0; index < Math.floor(mrna.code.length / 3); index++) {
        const triplet = [...mrna.code.slice(index * 3, index * 3 + 3)]
          .map(complementaryMRNABase)
          .join("");
        buildTRNAForThisTriplet(mrna, triplet, index);
      }
  }
  function placeDNA(strand: Strand) {
    for (const p of all().filter(
      (p) =>
        p.strand === strand &&
        ["gene", "nucleotide", "promoter", "terminator"].includes(p.breed),
    ))
      p.move({ to: { x: p.x, y: yDNA(strand) + 0.5 } });
  }
  function placeTRNAs(strand: Strand) {
    for (const p of molecules("trna", strand))
      p.move({ to: { x: p.x, y: yRibosome(strand) + 1.5 } });
  }
  function hideGenes(strand: Strand) {
    for (const p of all().filter(
      (p) =>
        p.strand === strand && ["promoter", "terminator"].includes(p.breed),
    )) {
      p.hidden = true;
      for (const q of backbones.neighbors(p, { direction: "out" }))
        q.hidden = true;
    }
  }
  function hideMRNA(strand: Strand) {
    for (const p of all().filter(
      (p) =>
        p.strand === strand && ["mrna", "mrna-nucleotide"].includes(p.breed),
    )) {
      p.hidden = true;
      for (const q of backbones.neighbors(p, { direction: "out" }))
        if (q.breed === "tag") q.hidden = true;
    }
  }
  function hideTRNA(strand: Strand) {
    for (const p of all().filter(
      (p) =>
        p.strand === strand &&
        ["trna", "trna-nucleotide", "amino-acid"].includes(p.breed),
    )) {
      p.hidden = true;
      for (const q of backbones.neighbors(p, { direction: "out" }))
        if (q.breed === "tag") q.hidden = true;
    }
  }
  function visualizeAllGenes() {
    for (const p of all().filter((p) =>
      ["promoter", "terminator"].includes(p.breed),
    )) {
      p.hidden = !settings.showGenes;
      for (const q of backbones.neighbors(p, { direction: "out" }))
        q.hidden = p.hidden;
    }
  }
  function setupStartingDNA() {
    setupDNAString();
    buildGenesFromDNA("original", originalDNAString);
    makeANucleotideChainForDNAString("original", originalDNAString);
    placeDNA("original");
    buildMRNAForEachGene("original");
    buildProteinFromMRNA("original");
    placeTRNAs("original");
    hideMRNA("original");
    hideTRNA("original");
    hideGenes("original");
  }
  function displayUserMessageNoGenes() {
    message =
      "There are no genes in this strand of DNA. A specific sequence of 3 nucleotides is required for a gene";
  }
  function geneNumberForThisStrand(strand: Strand) {
    return strand === "original"
      ? originalDisplayMRNACounter
      : duplicateDisplayMRNACounter;
  }
  function showNextMRNA(strand: Strand) {
    const genes = molecules("gene", strand);
    if (genes.length === 0) displayUserMessageNoGenes();
    let counter = geneNumberForThisStrand(strand) + 1;
    if (counter > genes.length) counter = 1;
    if (strand === "original") originalDisplayMRNACounter = counter;
    else duplicateDisplayMRNACounter = counter;
    for (const p of shuffled(
      molecules("mrna", strand).filter((p) => p.capType === "start"),
    )) {
      const displacement = yDNA(strand) + 0.5 - p.y;
      p.hidden = p.geneNumber !== counter;
      p.traveling = false;
      p.released = false;
      p.move({ by: { x: 0, y: displacement } });
      for (const q of backbones.neighbors(p, { direction: "out" })) {
        q.hidden = p.hidden;
        q.move({ by: { x: 0, y: displacement } });
        for (const tag of backbones.neighbors(q, { direction: "out" })) {
          tag.hidden = p.hidden;
          tag.move({ by: { x: 0, y: displacement } });
        }
      }
    }
  }
  function showNextTRNA(strand: Strand) {
    const geneNumber = geneNumberForThisStrand(strand);
    if (
      !molecules("mrna", strand).some(
        (p) =>
          p.capType === "start" && p.released && p.geneNumber === geneNumber,
      )
    )
      return;
    for (const p of shuffled(molecules("trna", strand))) {
      p.hidden = p.geneNumber !== geneNumber;
      for (const q of backbones.neighbors(p, { direction: "out" })) {
        q.hidden = p.hidden;
        for (const tag of backbones.neighbors(q, { direction: "out" }))
          tag.hidden = p.hidden;
      }
    }
  }
  function makeProtein(strand: Strand) {
    const geneNumber = geneNumberForThisStrand(strand);
    const aminoAcids = molecules("amino-acid", strand)
      .filter((p) => p.geneNumber === geneNumber)
      .sort((a, b) => a.who - b.who);
    const value = aminoAcids.map((p) => "-" + p.value).join("");
    if (!molecules("protein", strand).some((p) => p.value === value))
      addMolecule("protein", strand, geneNumber, 0, 0, { value, hidden: true });
  }
  function releaseNextProtein(strand: Strand) {
    const geneNumber = geneNumberForThisStrand(strand);
    let make = false;
    for (const mrna of molecules("mrna", strand).filter(
      (p) => p.capType === "start" && p.released && p.geneNumber === geneNumber,
    )) {
      for (const trna of shuffled(molecules("trna", strand))) {
        for (const q of backbones.neighbors(trna, { direction: "out" })) {
          if (trna.geneNumber === geneNumber) {
            make = true;
            q.hidden = q.breed !== "amino-acid";
            for (const tag of backbones.neighbors(q, { direction: "out" }))
              tag.hidden = q.hidden;
          } else {
            q.hidden = true;
            for (const tag of backbones.neighbors(q, { direction: "out" }))
              tag.hidden = true;
          }
        }
        trna.hidden = true;
      }
      if (make) makeProtein(mrna.strand);
    }
  }
  function releaseNextMRNAFromNucleus(strand: Strand) {
    // Source marks BOTH cap types, including hidden other genes, as traveling.
    for (const p of molecules("mrna", strand)) {
      p.traveling = true;
      p.released = false;
    }
  }
  function moveMRNAMoleculesOutOfNucleus() {
    for (const p of shuffled(
      molecules("mrna").filter((p) => p.traveling && p.capType === "start"),
    )) {
      const target = yRibosome(p.strand) + 0.5;
      const displacement =
        p.strand === "original"
          ? p.y < target
            ? 0.1
            : 0
          : p.y > target
            ? -0.1
            : 0;
      p.move({ by: { x: 0, y: displacement } });
      for (const child of backbones.neighbors(p, { direction: "out" })) {
        child.move({ by: { x: 0, y: displacement } });
        for (const tag of backbones.neighbors(child, { direction: "out" }))
          tag.move({ by: { x: 0, y: displacement } });
      }
      if (
        (p.strand === "original" && p.y >= target) ||
        (p.strand === "duplicate" && p.y <= target)
      ) {
        p.traveling = false;
        p.released = true;
        completed.add(p.strand === "original" ? 2 : 7);
      }
    }
  }
  function resetCompletedEvents(event: number) {
    const steps = event < 5 ? [1, 2, 3, 4] : [6, 7, 8, 9];
    for (const step of steps) if (step >= event) completed.delete(step);
  }
  function transcribe(strand: Strand) {
    const event = strand === "original" ? 1 : 6;
    triggered.add(event);
    resetCompletedEvents(event);
  }
  function releaseMRNA(strand: Strand) {
    const event = strand === "original" ? 2 : 7;
    if (completed.has(event - 1)) {
      triggered.add(event);
      resetCompletedEvents(event);
    }
  }
  function translate(strand: Strand) {
    const event = strand === "original" ? 3 : 8;
    if (completed.has(event - 1)) {
      triggered.add(event);
      resetCompletedEvents(event);
    }
  }
  function releaseProtein(strand: Strand) {
    const event = strand === "original" ? 4 : 9;
    if (completed.has(event - 1)) {
      triggered.add(event);
      resetCompletedEvents(event);
    }
  }
  function go() {
    visualizeAllGenes();
    for (const strand of ["original", "duplicate"] as const) {
      const first = strand === "original" ? 1 : 6;
      if (triggered.has(first)) {
        showNextMRNA(strand);
        triggered.delete(first);
        completed.add(first);
        for (let step = first + 1; step <= first + 3; step++)
          completed.delete(step);
      }
      if (triggered.has(first + 1) && completed.has(first)) {
        releaseNextMRNAFromNucleus(strand);
        triggered.delete(first + 1);
        completed.delete(first + 2);
        completed.delete(first + 3);
      }
      if (triggered.has(first + 2) && completed.has(first + 1)) {
        showNextTRNA(strand);
        triggered.delete(first + 2);
        completed.add(first + 2);
        completed.delete(first + 3);
      }
      if (triggered.has(first + 3) && completed.has(first + 2)) {
        releaseNextProtein(strand);
        triggered.delete(first + 3);
        completed.add(first + 3);
      }
    }
    moveMRNAMoleculesOutOfNucleus();
  }
  function makeDuplicateDNAString() {
    const available = originalDNAString.length - settings.nucleotidesAffected;
    // NetLogo random with zero produces zero; negative arguments produce non-positive values.
    const target =
      available === 0
        ? 0
        : available > 0
          ? random.number({ min: 0, max: available, integer: true })
          : -random.number({ min: 0, max: -available, integer: true });
    if (target < 0 || target >= originalDNAString.length)
      throw new RangeError(
        "Source replication target is outside the DNA string.",
      );
    let value = originalDNAString;
    if (settings.mutationType === "deletion") {
      for (let i = 0; i < settings.nucleotidesAffected; i++) {
        if (target >= value.length)
          throw new RangeError(
            "Source deletion target is outside the DNA string.",
          );
        value = value.slice(0, target) + value.slice(target + 1);
      }
    } else if (settings.mutationType === "substitution") {
      for (let i = 0; i < settings.nucleotidesAffected; i++) {
        if (target + i >= value.length)
          throw new RangeError(
            "Source substitution target is outside the DNA string.",
          );
        value =
          value.slice(0, target + i) +
          randomBaseLetterDNA() +
          value.slice(target + i + 1);
      }
    } else {
      let tail = value.slice(target);
      for (let i = 0; i < settings.nucleotidesAffected; i++)
        tail = randomBaseLetterDNA() + tail;
      value = value.slice(0, target) + tail;
    }
    duplicateDNAString = value;
  }
  function replicateDNA() {
    // Source retains existing proteins; duplicate molecular structures and tags are removed.
    for (const p of all().filter(
      (p) => p.strand === "duplicate" && p.breed !== "protein",
    ))
      p.delete();
    makeDuplicateDNAString();
    buildGenesFromDNA("duplicate", duplicateDNAString);
    makeANucleotideChainForDNAString("duplicate", duplicateDNAString);
    placeDNA("duplicate");
    buildMRNAForEachGene("duplicate");
    buildProteinFromMRNA("duplicate");
    placeTRNAs("duplicate");
    hideMRNA("duplicate");
    hideTRNA("duplicate");
    hideGenes("duplicate");
  }
  function showInstruction(index: number) {
    if (index >= 1 && index <= instructions.length) {
      currentInstruction = index;
      message = instructions[index - 1]!;
    }
  }
  function nextInstruction() {
    showInstruction(currentInstruction + 1);
  }
  function previousInstruction() {
    showInstruction(currentInstruction - 1);
  }
  function showProteinProduction() {
    message = [
      "Proteins Produced",
      ...molecules("protein", "original").map(
        (p) => `Orig.Gene #${p.geneNumber} > Protein: ${p.value}`,
      ),
      ...molecules("protein", "duplicate").map(
        (p) => `Copy.Gene #${p.geneNumber} > Protein: ${p.value}`,
      ),
    ].join("\n");
    return message;
  }
  function record() {
    history.push({
      tick: world.tick.value,
      originalProteins: molecules("protein", "original").length,
      duplicateProteins: molecules("protein", "duplicate").length,
    });
  }
  function setup() {
    backbones.delete();
    for (const p of all()) p.delete();
    world.tick.reset();
    who = 0;
    triggered.clear();
    completed.clear();
    history.length = 0;
    originalDNAString = "";
    duplicateDNAString = "";
    originalDisplayMRNACounter = 0;
    duplicateDisplayMRNACounter = 0;
    setupStartingDNA();
    visualizeAllGenes();
    showInstruction(1);
    record();
  }
  function advance(count = 1) {
    stepCount(count);
    for (let i = 0; i < count; i++) {
      run(world, go);
      record();
    }
  }
  function setParameters(update: Partial<Omit<DNAParameters, "seed">>) {
    if (Object.hasOwn(update, "seed"))
      throw new TypeError("Seed is setup-only.");
    settings = parameters(inputs, { ...settings, ...update });
  }
  function snapshot(p: Molecule) {
    return {
      id: p.id,
      who: p.who,
      breed: p.breed,
      strand: p.strand,
      geneNumber: p.geneNumber,
      code: p.code,
      value: p.value,
      place: p.place,
      startPosition: p.startPosition,
      endPosition: p.endPosition,
      capType: p.capType,
      traveling: p.traveling,
      released: p.released,
      hidden: p.hidden,
      x: p.x,
      y: p.y,
      heading: p.heading,
      color: p.color,
      size: p.breed === "tag" ? 0 : 4,
    };
  }
  function read() {
    return {
      tick: world.tick.value,
      width: 31,
      height: 16,
      stopped: false,
      parameters: { ...settings },
      originalDNAString,
      duplicateDNAString,
      originalDisplayMRNACounter,
      duplicateDisplayMRNACounter,
      currentInstruction,
      instructionCount: instructions.length,
      message,
      completedEvents: [...completed],
      triggeredEvents: [...triggered],
      originalGenes: molecules("gene", "original").map(snapshot),
      duplicateGenes: molecules("gene", "duplicate").map(snapshot),
      mrnas: molecules("mrna")
        .filter((p) => p.capType === "start")
        .map(snapshot),
      proteins: molecules("protein").map(snapshot),
      history: history.map((p) => ({ ...p })),
      agents: all().map(snapshot),
      cells: grid.fields.map((f) => ({
        id: f.id,
        x: f.x,
        y: f.y,
        color:
          f.y > 2.5
            ? "#17345a"
            : f.y > 0.5
              ? "#102542"
              : f.y > -2.5
                ? "#153e2a"
                : "#102d22",
      })),
    };
  }
  setup();
  return {
    advance,
    read,
    setup,
    setupStartingDNA,
    setupDNAString,
    buildGenesFromDNA,
    makeANucleotideChainForDNAString,
    buildMRNAForEachGene,
    buildProteinFromMRNA,
    buildTRNAForThisTriplet,
    placeDNA,
    placeTRNAs,
    attachTag,
    visualizeAllGenes,
    hideGenes,
    hideMRNA,
    hideTRNA,
    showNextMRNA,
    showNextTRNA,
    displayUserMessageNoGenes,
    releaseNextProtein,
    makeProtein,
    releaseNextMRNAFromNucleus,
    moveMRNAMoleculesOutOfNucleus,
    resetCompletedEvents,
    transcribe,
    releaseMRNA,
    translate,
    releaseProtein,
    replicateDNA,
    makeDuplicateDNAString,
    randomBaseLetterDNA,
    replaceNonNucleotideCharacter,
    dnaStringWithNonNucleotideCharactersReplaced,
    complementaryMRNABase,
    mrnaStringFromDNAString,
    whichProteinForThisCodon,
    geneNumberForThisStrand,
    showInstruction,
    nextInstruction,
    previousInstruction,
    showProteinProduction,
    go,
    setParameters,
    world,
    grid,
    backbones,
  };
}
export const model = {
  title: "DNA Protein Synthesis",
  inputs,
  create,
} satisfies Definition<DNAParameters, ReturnType<typeof create>>;
