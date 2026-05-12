function Moustache({ pct }) {
  return (
    <svg
      viewBox="0 0 60 18"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: pct, display: 'block' }}
    >
      <path d="M30 9 C26 3 14 1 5 6 C1 9 2 15 8 13 C14 11 20 8 26 9.5 C28 10.2 29.2 10.2 30 9 Z" />
      <path d="M30 9 C34 3 46 1 55 6 C59 9 58 15 52 13 C46 11 40 8 34 9.5 C32 10.2 30.8 10.2 30 9 Z" />
    </svg>
  );
}

export default function HubertLogo({ sidebarVariant = false }) {
  const fontSize = sidebarVariant ? '1.7rem' : '2.4rem';
  const nudgeUp  = sidebarVariant ? '0.22em' : '0.20em';
  const svgWidth = '92%';

  return (
    <span
      className="inline-flex items-center select-none text-teal"
      style={{ fontFamily: "'Lilita One', cursive", fontSize, lineHeight: 1 }}
      aria-label="Hubert"
    >
      <span className="relative inline-block" style={{ lineHeight: 1 }}>
        <span style={{ display: 'inline-block' }}>H</span>

        <span
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
          <Moustache pct={svgWidth} />
        </span>
      </span>

      ubert
    </span>
  );
}
