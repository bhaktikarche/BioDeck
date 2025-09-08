import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

export default function DeckView(){
  const { id } = useParams();
  const [deck,setDeck] = useState(null);
   const [comment,setComment] = useState('');
  const [submitting,setSubmitting] = useState(false);
 
  useEffect(()=>{ load(); },[]);

  const load = async () => {
    try {
      const { data } = await API.get(`/decks/${id}/view`);
      setDeck(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error loading deck');
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert('Please write your feedback');
    setSubmitting(true);
    try {
      await API.post(`/decks/${id}/feedback`, { comment });
      alert('Feedback submitted — thank you!');
      setComment('');
      // optional: for investors we might not need to reload deck
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting feedback');
    } finally {
      setSubmitting(false);
    }
  };
  if (!deck) return <div>Loading...</div>;

  return (
     <div>
      <div className="card mb-4">
        <div className="card-body">
          <h4>{deck.title}</h4>
          <p className="text-muted">Founder: {deck.founder?.name}</p>
          <p>{deck.description}</p>
          <a className="btn btn-primary" href={`/uploads/${deck.filename}`} target="_blank" rel="noreferrer">Open file</a>
        </div>
      </div>

      {/* Feedback form (investors only) */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Give feedback</h5>
          <form onSubmit={submitFeedback}>
            <div className="mb-2">
              <textarea className="form-control" rows="4" placeholder="Write feedback for the founder..." value={comment} onChange={e=>setComment(e.target.value)} required></textarea>
            </div>
            <button className="btn btn-success" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
