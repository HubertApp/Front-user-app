/**
 * EndpointDot — visual marker for stops on a route.
 *   kind="start" → solid teal circle
 *   kind="end"   → square (destination)
 *   kind="wp"    → ring (waypoint / intermediate)
 */
export default function EndpointDot({ kind = 'start', className = '' }) {
  if (kind === 'start') {
    return <span className={`w-[9px] h-[9px] rounded-full bg-teal shrink-0 ${className}`} />;
  }
  if (kind === 'end') {
    return <span className={`w-[9px] h-[9px] rounded-[2px] bg-ink shrink-0 ${className}`} />;
  }
  // waypoint
  return (
    <span
      className={`w-[9px] h-[9px] rounded-full bg-white shrink-0 ${className}`}
      style={{ boxShadow: '0 0 0 2px var(--color-teal)' }}
    />
  );
}
