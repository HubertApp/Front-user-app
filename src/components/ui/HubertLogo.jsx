function Moustache({ pct = '200%' }) {
  return (
    <svg
      viewBox="0 155 490.444 175"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: pct, display: 'block' }}
    >
      <path d="M480.986,215.947c-1.4,1.1-2.9,2.2-4.5,3.3l0,0l0,0c-7.9,5.1-18.5,9.2-32.8,9.9c-41.3,2.1-77.6-68.9-135.5-66c-14.8,0.7-35.3,4.3-63,31.8c-27.7-27.6-48.1-31.1-63-31.8c-57.9-2.9-94.2,68.1-135.5,66c-14.3-0.7-25-4.8-32.8-9.9l0,0l0,0c-1.6-1.1-3.1-2.2-4.5-3.3c-13.2-8.4-8.9,7.2-8,10.3c12.1,37.3,43.3,97.1,119.7,100.9c60.8,3.1,102.7-24.7,124.1-55.4c21.4,30.6,63.3,58.4,124.1,55.4c76.4-3.8,107.6-63.6,119.7-100.9C489.986,223.147,494.286,207.547,480.986,215.947z" />
    </svg>
  );
}

export default function HubertLogo({ sidebarVariant = false, size, iconOnly = false }) {
  const fontSize = size ?? (sidebarVariant ? '1.7rem' : '2rem');
  const nudgeUp = sidebarVariant ? '0.14em' : '0.12em';

  return (
    <span
      className="inline-flex items-center select-none text-teal"
      style={{ fontFamily: "'Lilita One', cursive", fontSize, lineHeight: 1 }}
      aria-label="Hubert"
    >
      <span className="relative inline-block" style={{ lineHeight: 1 }}>
        <span style={{ display: 'inline-block' }}>H</span>
        <span
          className="hubert-moustache"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: nudgeUp,
            pointerEvents: 'none',
          }}
        >
          <Moustache />
        </span>
      </span>
      {!iconOnly && 'ubert'}
    </span>
  );
}
