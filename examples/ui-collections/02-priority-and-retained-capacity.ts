import { collectionDiagram, defineUI, scientificPalette, type Observation } from '../../ui/index.ts';
import { model as charging } from '../../models/des-ev-charging/model.ts';
import { model as office } from '../../models/des-civic-office/model.ts';
import { assert, equal, button, settle } from '../ui-authoring/assertions.ts';

export function chargingScene(state: Observation<typeof charging>) {
  return collectionDiagram([
    { id: 'queue', label: 'Priority queue', kind: 'items', order: 'supplied', color: scientificPalette.waiting,
      items: state.waitingVehicles.map(number => ({ id: `vehicle:${number}`, shape: state.vehicles[number - 1]!.priority < 0 ? 'diamond' as const : 'rectangle' as const })) },
    { id: 'charging', label: 'Charging units', kind: 'capacity', used: state.active, capacity: state.parameters.chargers, unit: 'vehicles' },
  ]);
}
export function officeScene(state: Observation<typeof office>) {
  return collectionDiagram([
    { id: 'waiting', label: 'Waiting residents', kind: 'items', order: 'supplied',
      items: state.waitingResidents.map(number => ({ id: `resident:${number}` })) },
    { id: 'clerks', label: 'Clerk capacity', kind: 'capacity', used: state.busy, capacity: state.parameters.clerks, unit: 'seats' },
  ]);
}
export const ui = defineUI(charging, {
  actions: [{ label: 'Priority arrival', run: instance => instance.addVehicle(-1) }],
  views: [{ type: 'spatial', label: 'Canonical priority queue', data: chargingScene }],
});
const ev = charging.create({ chargers: 1, vehicles: 3 }); ev.addVehicle(-1);
equal(ev.read().waitingVehicles, [4, 2, 3], 'Resource supplies priority order rather than admission order');
equal(chargingScene(ev.read()).agents.filter(agent => agent.selectable !== false).map(agent => agent.id), ['vehicle:4', 'vehicle:2', 'vehicle:3'], 'Helper preserves actual priority request order');
equal(chargingScene(ev.read()).agents.find(agent => agent.id === 'vehicle:4')?.shape, 'diamond', 'Priority marker is an explicit shape distinction');
ev.abandonWaiting();
equal(chargingScene(ev.read()).agents.filter(agent => agent.selectable !== false).map(agent => agent.id), ['vehicle:4', 'vehicle:3'], 'Cancellation follows actual model action, not UI reconstruction');
const civic = office.create({ residents: 3, clerks: 2, serviceMinutes: 5 }); civic.setClerks(1);
equal(civic.read().waitingResidents, [3], 'Office exposes detached actual Resource waiting owners');
const retained = officeScene(civic.read());
assert(retained.description?.includes('2') && retained.description.includes('1') && retained.description.includes('seats'), 'Exact retained used/capacity and original unit remain visible');
assert(/excess|above|over/i.test(retained.description ?? ''), 'Capacity excess is explicit, not clamped away');
assert(retained.agents.filter(agent => agent.selectable !== false).every(agent => agent.id === 'resident:3'), 'Capacity decorations do not fabricate person-to-seat assignments');
const owners = civic.read().waitingResidents; owners.length = 0;
equal(civic.read().waitingResidents, [3], 'Waiting owners are detached snapshots');

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const mounted = bind(office, { views: [{ type: 'spatial', label: 'Retained service', data: officeScene }] }).mount(container);
  try {
    await settle(container); button(container, 'Setup').click(); await settle(container);
    assert(container.querySelector('canvas')?.getAttribute('aria-label')?.includes('seats'), 'The common canvas retains explicit capacity units');
  } finally { mounted.dispose(); }
}
