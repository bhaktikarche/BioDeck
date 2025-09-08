import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function DeckUpload(){
  const [file,setFile] = useState(null);
  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [requiresNDA,setRequiresNDA] = useState(true);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Select a file');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title);
    fd.append('description', description);
    fd.append('requiresNDA', requiresNDA);
    try {
      await API.post('/decks/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      nav('/founder');
    } catch (err) {
      alert(err.response?.data?.message || 'Upload error');
    }
  };

  return (
    <div className="card mx-auto" style={{maxWidth:700}}>
      <div className="card-body">
        <h4>Upload Deck</h4>
        <form onSubmit={submit}>
          <div className="mb-2"><input className="form-control" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required /></div>
          <div className="mb-2"><textarea className="form-control" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} /></div>
          <div className="mb-2"><input type="file" className="form-control" onChange={e=>setFile(e.target.files[0])} required /></div>
          <div className="form-check mb-2">
            <input className="form-check-input" type="checkbox" checked={requiresNDA} onChange={e=>setRequiresNDA(e.target.checked)} id="ndaCheck" />
            <label className="form-check-label" htmlFor="ndaCheck">Require NDA to view</label>
          </div>
          <button className="btn btn-success">Upload</button>
        </form>
      </div>
    </div>
  );
}
