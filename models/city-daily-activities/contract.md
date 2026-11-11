# Daily Activities contract

Revision 2, decided on 2026-11-10 before the runtime change. The four scripts in `tests/public-contracts/city-daily-activities/` define setup, one complete default day with person-hour accounting, remote-work/service-location/closing-time experiments, and validation/snapshots. Revision-1 files are archived in [evidence/revision-1-contracts](evidence/revision-1-contracts/).

## City question

How do commuting distance, remote work and where and how long services are open decide which errands still fit into a day?

Scientific connection: Hägerstrand (1970, *What About People in Regional Science?*) describes daily life as paths in space and time limited by capability, coupling and authority constraints: people need time to travel, must be present together with others, and can only use facilities while they are open. This model keeps exactly those three ideas with fixed schedules and straight-line travel. It does not reproduce time-geography algorithms such as space-time prisms.

## Space, people and time

One step is 15 minutes; a day has 96 steps and starts at 00:00. Places (km): work (2, 0), school (−2, 1.5), central services (2, −1), local services (−3, −1). Neighborhoods: near (−1, 0), middle (−3, 0), far (−5, 0). Household *i* (0-based) lives in neighborhood i mod 3 (near, middle, far) and has one adult and one child. Travel takes ceil(straight-line distance / 3 km) steps (12 km/h).

| Input | Default | Bounds | Meaning |
| --- | --- | --- | --- |
| householdCount | 6 | integer 1–30 | Households (setup) |
| remoteWork | false | boolean | Adults work at home (live) |
| servicesLocation | central | central, local | Which service center adults use (live) |
| servicesCloseHour | 18 | 16–22, step 0.25 | Service closing time in hours (live) |

## Daily plans

At the start of every day (tick divisible by 96) each person receives a plan from the current inputs. Live changes therefore apply from the next day.

- **Child:** travel home → school arriving at 08:00, school until 14:00, travel back.
- **Adult, commuting:** travel home → work arriving at 08:00, work until 16:00. Then, if the adult can arrive at services and stay one hour before closing (arrival + 1 h ≤ servicesCloseHour), travel there, stay one hour and travel home; otherwise travel home directly and count one missed errand.
- **Adult, remote work:** work at home 08:00–16:00, then the same service rule starting from home at 16:00 (then return home), or stay home and count a missed errand.

Each step adds 0.25 person-hours to the activity of the slot that has just elapsed (home, work, school, services or travel). Remote work counts as work. A trip completes at the end of its last travel slot. Observations report people at the current clock time; a traveler's position is interpolated along a straight line.

## Actions

`setRemoteWork(value)` and `setServicePolicy(changes)` (servicesLocation, servicesCloseHour) validate before mutation. Omitted keys keep values; undefined, unknown keys and wrong types throw TypeError; range and step errors RangeError.

## Exact assertions

- Setup: 12 residents at home at 00:00, no trips.
- Default day (96 steps): 30 trips, 6 errands done, 0 missed, 12 travel person-hours (adults 8, children 4), 288 person-hours accounted. Far adults leave at 07:15, near adults at 07:45. At 07:30 (tick 30) four adults and two children are traveling.
- Remote work, central services: 24 trips per day and 11 travel person-hours. Remote work with local services: 7 travel person-hours. Commuting with local services: 11.5 travel person-hours.
- Commuting with services closing at 17:00: all 6 errands missed, 24 trips, 10 travel person-hours.
- Remote work with closing at 17:30: the two far-neighborhood adults miss their errand, the other four succeed.

## Reuse and provenance

Reuses World/run, storage.history, parseParameters/updateParameters/validateStepCount and defineUI. Schedules, speeds and places are synthetic. No route network, congestion, household coordination or individual preferences.

Current verification and acceptance status is tracked centrally in [city simulation models](../../docs/development/city-simulation-models.md#current-revision-status).
