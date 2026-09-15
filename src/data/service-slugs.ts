/**
 * Single source of truth for service slugs.
 *
 * Plain string list, no imports — src/lib/valid-slugs.ts imports this
 * directly so the middleware bundle never pulls in data/services.ts
 * (which drags in Lucide icons). src/data/services.ts imports this too
 * and asserts its `services` array stays in sync (see the guard at the
 * bottom of that file), so a slug added to one list and not the other
 * fails the build instead of 404ing in production.
 */
export const SERVICE_SLUGS = [
  'cost-estimating',
  'architectural-services',
  'structural-engineering',
  'project-management',
  '3d-rendering-services',
  'shop-drawing-services',
  'permit-set-services',
  'electrical-estimating-services',
  'rebar-detailing-services',
  'blueprint-estimation',
  'quantity-surveyor-services',
  'building-estimating',
  'industrial-estimating',
  'residential-estimating',
] as const;
