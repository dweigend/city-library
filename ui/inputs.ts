export interface Descriptor {
  kind: "number" | "boolean" | "choice" | "text";
  default: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  integer?: boolean;
  options?: readonly string[];
}
