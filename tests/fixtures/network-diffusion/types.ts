import type { Agent, RandomState } from "city-library";

export type DiffusionState = "unaware" | "active" | "settled";
export type DiffusionTopology = "communities" | "ring" | "hub";
export type ContactKind = "contact" | "bridge";

export interface NetworkDiffusionOptions {
  count?: number;
  seed?: number;
  transmission?: number;
  activeTicks?: number;
  topology?: DiffusionTopology;
  bridges?: boolean;
}
export type DiffusionParameters = Readonly<Required<NetworkDiffusionOptions>>;
export interface DiffusionAgentState {
  label: string;
  community: number;
  state: DiffusionState;
  activeAge: number;
}
export type DiffusionAgent = Agent<DiffusionAgentState>;
export interface DiffusionCounts { readonly unaware: number; readonly active: number; readonly settled: number }
export interface DiffusionHistoryPoint extends DiffusionCounts { readonly tick: number }
export interface DiffusionAgentObservation {
  readonly id: string;
  readonly label: string;
  readonly community: number;
  readonly state: DiffusionState;
  readonly activeAge: number;
  readonly degree: number;
  readonly alive: boolean;
  readonly attached: boolean;
  readonly selected: boolean;
  readonly x: number;
  readonly y: number;
  readonly heading: number;
}
export interface DiffusionEdgeObservation {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly directed: false;
  readonly kind: ContactKind;
}
export interface NetworkDiffusionSnapshot {
  readonly scenario: "diffusion";
  readonly id: string;
  readonly alive: boolean;
  readonly attached: boolean;
  readonly x: number;
  readonly y: number;
  readonly heading: number;
  readonly tick: number;
  readonly agentCount: number;
  readonly state: DiffusionState;
  readonly activeAge: number;
  readonly degree: number;
  readonly community: number;
  readonly parameters: DiffusionParameters;
  readonly counts: DiffusionCounts;
  readonly contactCount: number;
  readonly newActivations: number;
  readonly done: boolean;
  readonly randomState: RandomState;
  readonly agents: readonly DiffusionAgentObservation[];
  readonly edges: readonly DiffusionEdgeObservation[];
  readonly history: readonly DiffusionHistoryPoint[];
}
