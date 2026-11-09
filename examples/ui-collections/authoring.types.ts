import { collectionDiagram, type CollectionRow } from '../../ui/index.ts';
// @ts-expect-error Identity and anonymous count are different discriminants.
const mixed: CollectionRow = { id: 'bad', label: 'Mixed', kind: 'items', items: [], count: 2 };
// @ts-expect-error Capacity quantities require their actual declared unit.
const unitless: CollectionRow = { id: 'bad', label: 'Unitless', kind: 'capacity', used: 1, capacity: 2 };
// @ts-expect-error An array order is not a queue policy inferred by UI.
const policy: CollectionRow = { id: 'bad', label: 'Wrong policy', kind: 'items', items: [], order: 'fifo' };
collectionDiagram([{ id: 'good', label: 'Canonical ID', kind: 'items', items: [{ id: 'person:1', shape: 'circle' }] }]);
void mixed; void unitless; void policy;
