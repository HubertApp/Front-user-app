import { useState, useEffect } from 'react';

export default function UserAvatar({ user, size = 40, className = '', style = {} }) {
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => {
    setPhotoFailed(false);
  }, [user?.photo]);

  const initial = user?.pseudo ? user.pseudo.charAt(0).toUpperCase() : '?';
  const showPhoto = !!user?.photo && !photoFailed;

  const baseStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: size * 0.4,
    overflow: 'hidden',
    flexShrink: 0,
    ...style,
  };

  if (showPhoto) {
    return (
      <img
        src={user.photo}
        alt={user.pseudo || 'Photo de profil'}
        className={className}
        style={baseStyle}
        onError={() => setPhotoFailed(true)}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        ...baseStyle,
        background: 'linear-gradient(135deg, #FAEFD8, #E6DCC5)',
        color: '#0E1A24',
      }}
    >
      {initial}
    </div>
  );
}
