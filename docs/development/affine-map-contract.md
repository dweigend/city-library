# Affine coordinate mapping

An affine map lets a model place data from one rectangular coordinate range into another. `geometry.map(point,{from,to,mode?})` uses readonly `Bounds=[minX,maxX,minY,maxY]` values and keeps the calculation independent of agents, grids and rendering. The GIS examples supply concrete numerical fixtures; this operation does not project between coordinate reference systems.

The binding explicitly defines the default `uniform-centered`: scale=min(targetWidth/sourceWidth,targetHeight/sourceHeight),center the scaled source in the target. `independent-axes` uses separate positive ratios. Both bounds require finite endpoints and strictly positive finite widths/heights. Points outside source map outside without clipping. Return a detached frozen XY position; no World/Grid/Agent allocation or state/RNG/time effects. Reuse the existing geometry position helper so canonical Agent/Field positions work and explicit XYZ points reject. No GeoJSON magnitude/feature/position/property/text budgets apply to this generic affine method. No implicit geodesy,normalization or hidden context.

Use existing own-data option and finite-number conventions: wrong shapes/options TypeError; nonfinite numeric values,degenerate extents and nonfinite/unrepresentable intermediate arithmetic RangeError. Bounds are dense four-number arrays,read own data indices without executing accessors. Source/target/point remain untouched. No convenient additional signature or placeholder Planar types,contains,bounds,codec or CRS operation is added. Existing API behavior stays intact.

## Numerical boundaries

Positive finite scales and nonzero products that underflow to unrepresentable zero reject rather than silently collapse an axis; normal representable IEEE rounding remains. No claim of arbitrary-real arithmetic or CRS transformation. The actual original GIS Setup is still blocked before dataset load; source-fixture affine agreement is a mathematical contract check,not full model/browser parity.
