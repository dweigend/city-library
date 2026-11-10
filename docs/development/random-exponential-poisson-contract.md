# Exponential and Poisson draws

Exponential and Poisson draws use the same explicit random stream as the rest of a model. This contract defines the two existing `random.number` overloads for the standard Mulberry profile, including their exact draw schedules. Public examples in `tests/public-contracts/random-distributions/` assert the draw schedule and continuation behavior.

## Scope and shared owner

Implement standard Mulberry only through random.number({distribution: "exponential" | "poisson", mean?}). No MT, gamma, alternative namespace, model-private sampler or new continuation field. Defaults mean1. Both families use the existing uniform stream exclusively, preserving the normal companion exactly. Existing state/copy/local/reseed semantics and uniform/normal schedules remain unchanged. The first concrete exponential/Poisson algorithms below fill revision agent-loom-random/1; later schedule changes require an explicit revision decision.

Recognized own undefined fields mean omission. Reuse descriptor-safe closed options; inapplicable/unknown/accessor/symbol keys reject before drawing. Means must be numbers and finite; exponential mean>=0, Poisson mean in[0,100000]. Wrong primitive types throw TypeError, invalid numeric ranges throw RangeError. Mean +0 or -0 returns positive0 without drawing. Invalid inputs do not consume draws or clear normal cache. Every sampled result must be finite; overflow throws RangeError after consumption, without rollback. No output clamp, Gaussian approximation, arbitrary count/rejection cap or alternate stream is authorized. Distribution requests do not affect World ticks or membership.

## Exponential and product branch

Exponential positive mean consumes exactly one U in[0,1) and evaluates **(-mean) * Math.log(1-U)** in that order. Preserve finite Number underflow and the formula's signed zero for positive mean/U0. No log1p substitution changes the accepted formula's low-bit behavior.

For positive Poisson mean below30, set threshold=Math.exp(-mean), product=1, count=0. A do-first loop increments count then multiplies product by one U; continue while product>threshold, return count-1. Equality stops; U0 stops. Tiny positive means whose threshold rounds to1 still draw once and return0. Mean0 remains the no-draw special case. Product underflow can stop normally; no retry cap transfers from normal sampling.

## High-mean PTRS closure

For mean>=30 choose the printed **PTRS** recipe on p7 of Hörmann's April1992 WU preprint of the 1993 paper, DOI10.1016/0167-6687(93)90997-4. Primary source: [Hörmann, transformed rejection for Poisson variates](https://doi.org/10.1016/0167-6687(93)90997-4). Explicitly choose **+mean+0.43**, rather than Table1/PTRD's +0.445. Independently write the implementation from this mathematical contract; do not copy third-party code or retain the paper. This is no native NetLogo RNG parity claim.

Compute b=0.931+2.53*Math.sqrt(mean), a=-0.059+0.02483*b, vr=0.9277-3.6224/(b-2), invAlpha=1.1239+1.1328/(b-3.4), logMean=Math.log(mean).

Each proposal consumes TWO uniform draws in order: u=draw()-0.5, v=draw(); us=0.5-Math.abs(u). If us==0, reject after both draws and restart before division. Otherwise k=Math.floor((2*a/us+b)*u+mean+0.43). Follow the printed test order: accept if us>=0.07 && v<=vr; otherwise reject/restart if k<0, then if us<0.013 && v>us. Otherwise accept iff Math.log(v*invAlpha/(a/(us*us)+b)) <= -mean+k*logMean-logFactorial(k). V0 is legal: its logarithm is -Infinity and the usual acceptance comparison applies after earlier rejections. No Gaussian-cache use or retry cap. Validate the accepted output as a nonnegative finite safe integer; actual Mulberry grid and admitted mean range keep the finite candidate domain bounded without an extra public count cap.

### Log-factorial evaluation

The paper's short Stirling approximation is not an exact factorial identity. Record this separate numerical closure: construct a deterministic table for integer0..255 by table[0]=0 and table[k]=table[k-1]+Math.log(k). For k>=256 use z=1/k, z2=z*z and

`(k+0.5)*Math.log(k)-k+0.9189385332046727 + z*(1/12+z2*(-1/360+z2*(1/1260+z2*(-1/1680))))`.

This is a binary64 approximation to log(k!), not exact real arithmetic or a promise of platform-independent libm rounding. The omitted asymptotic term at this threshold is far below binary64 roundoff; focused independent tests must compare the table/large branch to separately evaluated finite-log sums and fixed mathematical fixtures. Test actual high-mean masses/mean/variance with declared deterministic sample sizes/tolerances, plus independent acceptance-boundary and endpoint/consumption fixtures. Do not weaken the five frozen scripts if their scientific assertions fail.
