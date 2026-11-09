# Synthetic M/M/1 countercheck results

Executed with `bun scripts/des-mm1-check.ts` on 2026-11-09T09:03:29.064Z. This is target-runtime evidence for an idealized queue, not city calibration or whole-Salabim equivalence. The design was declared before inspecting results.

Assumptions: stationary Poisson arrivals at 0.5/minute, independent exponential services at 1/minute, one work-conserving nonpreemptive FIFO server, unlimited waiting room, no abandonment or blocking, stable utilization 0.5. One explicitly seeded Random stream supplies successive independent-distribution draws. Analytical targets follow the birth-death derivation in [Salabim research](salabim-concepts.md).

Eight replications use seeds 1001–1008, warm-up 10,000 minutes and observation 50,000 minutes. Every customer admitted before the observation end is drained to completion. Time averages integrate only the observation window. Waiting/residence averages include all arrivals in that window, including those finishing later. Replication estimates are the sampling units; successive event observations are not treated as independent.

| Metric | Analytic target | Replication mean | Replication SD | SE | 95% t7 interval | Target in interval | Fixed tolerance | Gate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| utilization | 0.5 | 0.497047 | 0.002981 | 0.001054 | [0.494555, 0.499538] | no | ±0.02 | pass |
| L | 1 | 0.994129 | 0.014446 | 0.005107 | [0.982052, 1.006205] | yes | ±0.1 | pass |
| Lq | 0.5 | 0.497082 | 0.012327 | 0.004358 | [0.486776, 0.507388] | yes | ±0.08 | pass |
| W | 2 | 1.998031 | 0.027328 | 0.009662 | [1.975184, 2.020877] | yes | ±0.15 | pass |
| Wq | 1 | 0.999026 | 0.023768 | 0.008403 | [0.979156, 1.018897] | yes | ±0.12 | pass |

Confidence intervals use the two-sided 95% Student t multiplier 2.364624251 with 7 degrees of freedom. Interval inclusion is reported rather than used as a deterministic pass criterion; the predeclared fixed engineering tolerances are separate, broad defect-detection gates. Estimates remain subject to finite-run error and the pseudorandom stream assumptions.

The utilization interval excludes its analytic target. This is reported without changing seeds, horizon or tolerances; a nominal confidence interval can miss its target, and eight replications do not establish precise coverage.

| Seed | Admitted in observation | Events | Utilization | L | Lq | W | Wq | Maximum clipped-area relative error |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1001 | 24802 | 59676 | 0.497148 | 0.990869 | 0.493721 | 1.996958 | 0.994979 | 0.000e+0 |
| 1002 | 24739 | 59466 | 0.497487 | 0.995284 | 0.497798 | 2.011580 | 1.006100 | 0.000e+0 |
| 1003 | 24711 | 59612 | 0.497620 | 0.993872 | 0.496252 | 2.010945 | 1.004095 | 0.000e+0 |
| 1004 | 25091 | 60128 | 0.502704 | 1.017337 | 0.514633 | 2.027267 | 1.025534 | 0.000e+0 |
| 1005 | 24724 | 59880 | 0.492596 | 0.992384 | 0.499788 | 2.006925 | 1.010734 | 0.000e+0 |
| 1006 | 25057 | 60310 | 0.496673 | 0.998373 | 0.501700 | 1.992203 | 1.001117 | 0.000e+0 |
| 1007 | 24926 | 59856 | 0.494097 | 0.964898 | 0.470801 | 1.935687 | 0.944438 | 1.508e-16 |
| 1008 | 24968 | 60032 | 0.498048 | 1.000011 | 0.501963 | 2.002682 | 1.005212 | 0.000e+0 |

Each replication independently checks occupancy conservation after every event and the exact finite-window identity between time-integrated occupancy, waiting and service and the sum of each customer's clipped intervals (relative arithmetic tolerance 1e-10). These deterministic invariants are distinct from the statistical comparisons. No unfinished customer is discarded. No parameter was fitted to these results.
