// src/components/NotificationBell.jsx
import React, { useEffect, useState, useRef } from 'react';
import API from '../api';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef();

  useEffect(() => {
    load();
    const iv = setInterval(load, 30000); // poll every 30s
    return () => clearInterval(iv);
  }, []);

  async function load() {
    try {
      setLoading(true);
      const { data } = await API.get('/users/notifications');
      // The server may return { notifications: [...] } (new) OR an array of feedbacks (old)
      // Normalize to an array of items either way:
      let items = [];
      if (Array.isArray(data.notifications)) {
        items = data.notifications;
      } else if (Array.isArray(data)) {
        items = data;
      } else if (Array.isArray(data.feedbacks)) {
        items = data.feedbacks;
      } else if (Array.isArray(data)) {
        items = data;
      }
      setNotifs(items || []);
    } catch (err) {
      console.error('load notifications', err);
      setNotifs([]);
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id) {
    try {
      await API.post(`/users/notifications/${id}/mark`);
      setNotifs(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error('mark read', err);
      alert(err.response?.data?.message || 'Could not mark read');
    }
  }

  // click outside to close
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const unreadCount = notifs.length;

  // helpers to read fields safely for both old/new shapes
  const getActor = (n) => {
    // new shape uses n.actor; old feedback used n.investor
    return n.actor || n.investor || null;
  };
  const getDeck = (n) => {
    return n.deck || (n.deck === undefined ? null : n.deck);
  };
  const getCreatedAt = (n) => n.createdAt || n.createdAt === 0 ? n.createdAt : null;
  const getKind = (n) => n.kind || (n.comment ? 'feedback' : 'view');

  return (
    <div className="position-relative me-3" ref={ref}>
      <button className="btn btn-link position-relative p-1" onClick={() => setOpen(!open)} title="Feedback notifications">
        <i className="bi bi-bell" style={{fontSize: '1.2rem'}}></i>
        {unreadCount > 0 && (
          <span className="badge bg-danger rounded-pill position-absolute" style={{top:0,right:0,fontSize:'0.65rem'}}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="card shadow-sm" style={{position:'absolute', right:0, width: 360, zIndex: 2000}}>
          <div className="card-body" style={{maxHeight: '360px', overflowY: 'auto'}}>
            <h6 className="mb-2">Feedback ({unreadCount})</h6>

            {loading && <div className="text-muted">Loading...</div>}
            {!loading && unreadCount === 0 && <div className="text-muted small">No new feedback</div>}

            {notifs.map(n => {
              const actor = getActor(n);
              const deck = getDeck(n);
              const kind = getKind(n);
              const created = getCreatedAt(n) ? new Date(n.createdAt).toLocaleString() : '';
              const message = kind === 'view' ? (n.message || `${actor?.name || actor?.email || 'Someone'} viewed your deck.`) : (n.comment || n.message || '');

              return (
                <div key={n._id} className="mb-2 border-bottom pb-2">
                  <div className="d-flex justify-content-between">
                    <strong style={{fontSize:'0.95rem'}}>
                      {kind === 'view' ? 'Deck viewed' : 'New feedback'}
                    </strong>
                    <small className="text-muted">{created}</small>
                  </div>

                  <div className="small text-muted">
                    {actor ? `From: ${actor.name || actor.email}` : 'From: unknown'}
                    {deck?.title ? ` — Deck: ${deck.title}` : ''}
                  </div>

                  <div className="mt-1">{message.length > 150 ? message.slice(0,150) + '…' : message}</div>

                  <div className="mt-2 d-flex justify-content-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => { if (deck && deck._id) window.location.href = `/deck/${deck._id}`; else if (deck && deck.id) window.location.href = `/deck/${deck.id}`; else window.location.reload(); }}
                    >
                      Open
                    </button>
                    <button className="btn btn-sm btn-success" onClick={() => markRead(n._id)}>Mark read</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
