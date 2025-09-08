import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function InvestorDashboard(){
  const [decks,setDecks] = useState([]);
  const [userId] = useState(JSON.parse(localStorage.getItem('user') || '{}').id);

  useEffect(()=>{ load(); },[]);

  const load = async () => {
    try {
      const { data } = await API.get('/decks');
      setDecks(data);
    } catch (err) { console.error(err); }
  };

  const requestAccess = async (deckId) => {
    // Simple MVP: we just alert founder by adding their id to allowedInvestors via grant endpoint is founder-only.
    // For a proper flow you'd POST a request and notify the founder; for now show message.
    alert('Request access: founder will need to grant access from their dashboard (MVP).');
  };

  return (
    <div>
      <h3>Investor Dashboard</h3>
      <div className="row">
        {decks.map(d=> (
          <div className="col-md-4" key={d._id}>
            <div className="card mb-3">
              <div className="card-body">
                <h5>{d.title}</h5>
                <p className="small text-muted">Founder: {d.founder?.name}</p>
                <p>{d.description}</p>
                <Link to={`/deck/${d._id}`} className="btn btn-primary btn-sm me-2">View</Link>
                {d.requiresNDA && !(d.allowedInvestors || []).includes(userId) && (
                  <button className="btn btn-outline-secondary btn-sm" onClick={()=>requestAccess(d._id)}>Request Access</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
