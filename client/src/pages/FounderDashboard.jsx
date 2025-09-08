// import React, { useEffect, useState } from 'react';
// import API from '../api';
// import { Link } from 'react-router-dom';

// export default function FounderDashboard(){
//   const [decks,setDecks] = useState([]);
//   const [investors,setInvestors] = useState([]);
//   const [selectedDeck,setSelectedDeck] = useState(null);
//   const [selectedInvestor,setSelectedInvestor] = useState('');

//   const user = JSON.parse(localStorage.getItem('user') || 'null');

//   useEffect(()=>{ load(); loadInvestors(); },[]);

//   const load = async () => {
//     try {
//       const { data } = await API.get('/decks');
//       setDecks(data);
//     } catch (err) { console.error(err); }
//   };

//   const loadInvestors = async () => {
//     try {
//       const { data } = await API.get('/users/investors');
//       setInvestors(data);
//     } catch (err) { console.error(err); }
//   };

//   const grant = async (deckId) => {
//     if (!selectedInvestor) return alert('Select investor');
//     try {
//       await API.post(`/decks/${deckId}/grant`, { investorId: selectedInvestor });
//       alert('Access granted');
//       load();
//     } catch (err) { alert(err.response?.data?.message || 'Error'); }
//   };

//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3>Founder Dashboard</h3>
//         <Link to="/founder/upload" className="btn btn-success">Upload Deck</Link>
//       </div>

//       <div className="mb-3">
//         <label className="form-label">Select investor to grant access (select then click Grant on a deck)</label>
//         <select className="form-select" value={selectedInvestor} onChange={e=>setSelectedInvestor(e.target.value)}>
//           <option value="">-- choose investor --</option>
//           {investors.map(inv=> <option key={inv._id} value={inv._id}>{inv.name} — {inv.email}</option>)}
//         </select>
//       </div>

//       <div className="row">
//         {decks.map(d=> (
//           <div className="col-md-4" key={d._id}>
//             <div className="card mb-3">
//               <div className="card-body">
//                 <h5>{d.title}</h5>
//                 <p className="small text-muted">Views: {d.views}</p>
//                 <p>{d.description}</p>
//                 <a className="btn btn-sm btn-primary me-2" href={`/uploads/${d.filename}`} target="_blank">Download</a>
//                 <button className="btn btn-sm btn-outline-secondary me-2" onClick={()=>{ setSelectedDeck(d._id); grant(d._id); }}>Grant</button>
//                 <div className="mt-2">
//                   <small className="text-muted">Allowed: {d.allowedInvestors?.length || 0}</small>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// client/src/pages/FounderDashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

function StatsCard({ title, value, small }) {
  return (
    <div className="col-sm-4 mb-3">
      <div className="card h-100 border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="text-muted mb-1">{title}</h6>
              <h3 className="mb-0">{value}</h3>
            </div>
            {small && <div className="text-end text-muted small">{small}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function GrantModal({ show, onClose, onConfirm, deck, investor }) {
  if (!show) return null;
  return (
    <div style={{position:'fixed', inset:0, zIndex:2500}} className="d-flex align-items-center justify-content-center">
      <div className="modal-backdrop fade show" />
      <div className="card shadow-lg" style={{width:480, zIndex:2600}}>
        <div className="card-body">
          <h5 className="card-title">Grant access</h5>
          <p className="small text-muted mb-3">
            You're granting <strong>{investor?.name || 'selected investor'}</strong> access to the deck <strong>{deck?.title}</strong>.
          </p>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-success" onClick={onConfirm}>Confirm grant</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FounderDashboard() {
  const [decks, setDecks] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [selectedInvestor, setSelectedInvestor] = useState('');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filterNDA, setFilterNDA] = useState('all');
  const [modal, setModal] = useState({ show: false, deck: null });
  const [message, setMessage] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    load();
    loadInvestors();
    // eslint-disable-next-line
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { data } = await API.get('/decks');
      setDecks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadInvestors() {
    try {
      const { data } = await API.get('/users/investors');
      setInvestors(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  function openGrant(deck) {
    if (!selectedInvestor) {
      setMessage({ type: 'warning', text: 'Select an investor from the dropdown before granting access.' });
      setTimeout(()=>setMessage(null), 3000);
      return;
    }
    setModal({ show: true, deck });
  }

  async function confirmGrant() {
    const deckId = modal.deck._id;
    try {
      await API.post(`/decks/${deckId}/grant`, { investorId: selectedInvestor });
      setMessage({ type: 'success', text: 'Access granted successfully.' });
      setModal({ show: false, deck: null });
      await load();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Could not grant access' });
    } finally {
      setTimeout(()=>setMessage(null), 3000);
    }
  }

  // computed stats
  const totalDecks = decks.length;
  const totalViews = decks.reduce((s,d)=>s + (d.views||0), 0);
  const totalAllowed = decks.reduce((s,d)=>s + (d.allowedInvestors?.length || 0), 0);

  // filtering/search
  const filtered = decks.filter(d => {
    if (filterNDA === 'nda' && !d.requiresNDA) return false;
    if (filterNDA === 'no-nda' && d.requiresNDA) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (d.title||'').toLowerCase().includes(q) || (d.description||'').toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Founder Dashboard</h2>
          <div className="small text-muted">Welcome back, {user?.name || 'Founder'} — manage your decks and investor access.</div>
        </div>
        <div className="d-flex gap-2">
          <Link to="/founder/upload" className="btn btn-success">Upload Deck</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="row mb-4">
        <StatsCard title="Total decks" value={totalDecks} />
        <StatsCard title="Total views" value={totalViews} />
        <StatsCard title="Allowed investors" value={totalAllowed} small="Active grants" />
      </div>

      {/* Controls */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-md-4">
              <label className="form-label small mb-1">Choose investor</label>
              <select className="form-select" value={selectedInvestor} onChange={e => setSelectedInvestor(e.target.value)}>
                <option value="">-- choose investor --</option>
                {investors.map(inv => <option key={inv._id} value={inv._id}>{inv.name} — {inv.email}</option>)}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small mb-1">Search decks</label>
              <input className="form-control" placeholder="Search title or description..." value={query} onChange={e=>setQuery(e.target.value)} />
            </div>

            <div className="col-md-2">
              <label className="form-label small mb-1">Filter NDA</label>
              <select className="form-select" value={filterNDA} onChange={e=>setFilterNDA(e.target.value)}>
                <option value="all">All decks</option>
                <option value="nda">Requires NDA</option>
                <option value="no-nda">No NDA</option>
              </select>
            </div>

            <div className="col-md-2 text-end">
              <label className="form-label small mb-1">&nbsp;</label>
              <div>
                <button className="btn btn-outline-secondary me-2" onClick={load}>Refresh</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`alert alert-${message.type} mb-3`} role="alert">
          {message.text}
        </div>
      )}

      {/* Deck grid */}
      <div className="row">
        {loading && <div className="text-center py-4 w-100 text-muted">Loading decks…</div>}
        {!loading && filtered.length === 0 && (
          <div className="text-center text-muted py-4 w-100">No decks found. Upload your first deck to get started.</div>
        )}

        {filtered.map(d => (
  <div key={d._id} className="col-md-6 col-lg-4 mb-4">
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h5 className="mb-1">{d.title}</h5>
            <div className="small text-muted">Views: {d.views || 0}</div>
          </div>
          <div className="text-end">
            <div className="small text-muted">Allowed</div>
            <div className="fw-semibold">{d.allowedInvestors?.length || 0}</div>
          </div>
        </div>

        <p className="mb-3 text-muted">{d.description || 'No description'}</p>

        <div className="mt-auto d-flex justify-content-start gap-2">
          <a
            className="btn btn-sm btn-primary"
            href={`/uploads/${d.filename}`}
            target="_blank"
            rel="noreferrer"
          >
            Download
          </a>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => openGrant(d)}
          >
            Grant
          </button>
          <Link to={`/deck/${d._id}`} className="btn btn-sm btn-outline-primary">
            Open
          </Link>
        </div>
      </div>
    </div>
  </div>
))}


      </div>

      <GrantModal
        show={modal.show}
        deck={modal.deck}
        investor={investors.find(i=>i._id === selectedInvestor)}
        onClose={()=>setModal({ show:false, deck:null })}
        onConfirm={confirmGrant}
      />
    </div>
  );
}
