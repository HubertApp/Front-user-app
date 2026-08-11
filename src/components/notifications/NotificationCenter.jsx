import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../services/notificationService';

function timeAgo(isoDate) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
}

export default function NotificationCenter() {
  const { notifications, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const seenIdsRef = useRef(new Set());
  const wasOpenRef = useRef(false);

  // Tant que le centre est ouvert, on retient les notifs affichées : à la
  // fermeture (clic dehors, re-clic sur la cloche, ou démontage du
  // composant), elles sont marquées lues même si l'utilisateur n'a cliqué
  // sur aucune d'entre elles individuellement.
  useEffect(() => {
    if (open) {
      notifications.forEach((n) => seenIdsRef.current.add(n.id));
    }
  }, [open, notifications]);

  useEffect(() => {
    if (wasOpenRef.current && !open) {
      seenIdsRef.current.forEach((id) => markAsRead(id));
      seenIdsRef.current.clear();
    }
    wasOpenRef.current = open;
  }, [open, markAsRead]);

  useEffect(() => {
    return () => {
      if (wasOpenRef.current) {
        seenIdsRef.current.forEach((id) => markAsRead(id));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.length;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="pressable relative w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center"
        aria-label="Notifications"
      >
        <i className="fa-regular fa-bell text-[15px] text-ink" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-danger border-2 border-white" />
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white border border-line rounded-2xl shadow-lg overflow-hidden z-50"
          style={{ boxShadow: '0 12px 32px -12px rgba(15,26,36,0.25)' }}
        >
          <div className="px-4 py-3 border-b border-line-soft">
            <p className="text-sm font-bold text-ink">Notifications</p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-[12.5px] text-muted text-center py-6 px-4">
                Vous n'avez aucune notification.
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className="w-full text-left flex items-start gap-3 px-4 py-3 border-b border-line-soft last:border-b-0 hover:bg-warm-bg transition-colors"
                >
                  <span className="w-8 h-8 rounded-[10px] bg-teal-soft text-teal-hover inline-flex items-center justify-center text-[13px] shrink-0 mt-0.5">
                    <i className="fa-solid fa-bell" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-ink leading-snug">{n.content}</p>
                    <p className="text-[10.5px] text-soft font-mono mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
