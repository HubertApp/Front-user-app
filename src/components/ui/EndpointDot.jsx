export default function EndpointDot({ kind = 'start', className = '' }) {
  if (kind === 'start') {
    return <span className={`w-[9px] h-[9px] rounded-full bg-teal shrink-0 ${className}`} />;
  }
  if (kind === 'end') {
    return <span className={`w-[9px] h-[9px] rounded-[2px] bg-ink shrink-0 ${className}`} />;
  }
  return (
    <span
      className={`w-[9px] h-[9px] rounded-full bg-white shrink-0 ${className}`}
      style={{ boxShadow: '0 0 0 2px var(--color-teal)' }}
    />
  );
}
