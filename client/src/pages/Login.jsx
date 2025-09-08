// client/src/pages/Login.jsx
import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [form, setForm] = useState({ email:'', password:'' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Please enter email and password.');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      // store token; if "remember" is unchecked we still persist for simplicity — you can change later
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.role === 'founder') nav('/founder'); else nav('/investor');
    } catch (err) {
      setError(err.response?.data?.message || 'Login error — check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center gx-4">
        {/* Left illustration on wide screens */}
        <div className="col-lg-5 d-none d-lg-block">
          <div className="card border-0 shadow-sm">
            <img
              src="https://media.licdn.com/dms/image/v2/D5612AQF_8eAHKXqR4Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1683548752819?e=2147483647&v=beta&t=KMTnsTmutKG1Hwk8As3brCwGUIrjfjOvdzJyJkuacbY"
              alt="login-hero"
              className="img-fluid rounded-start hero-illustration"
            />
            <div className="card-body">
              <h4 className="fw-bold mb-1">Welcome back</h4>
              <p className="text-muted mb-0">Sign in to access your BioDeck dashboard — manage decks, track interest and get feedback.</p>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card p-4 shadow-sm">
            <div className="mb-3">
              <h3 className="h4 mb-0">Sign in</h3>
              <small className="text-muted">Enter your details to continue</small>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Your password"
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(s => !s)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="rememberMe" checked={remember} onChange={e=>setRemember(e.target.checked)} />
                  <label className="form-check-label small" htmlFor="rememberMe">Remember me</label>
                </div>
                <div>
                  <Link to="#" onClick={(e)=>e.preventDefault()} className="small">Forgot password?</Link>
                </div>
              </div>

              <div className="d-grid mb-2">
                <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </div>

              <div className="text-center mb-2">
                <small className="text-muted">Or continue with</small>
              </div>

              <div className="d-flex gap-2 justify-content-center mb-3">
                <button className="btn btn-outline-secondary btn-sm" onClick={(e)=>e.preventDefault()}>
                  <i className="bi bi-google me-2"></i> Google
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={(e)=>e.preventDefault()}>
                  <i className="bi bi-github me-2"></i> GitHub
                </button>
              </div>

              <div className="text-center">
                <small className="text-muted">
                  Don’t have an account? <Link to="/signup">Create account</Link>
                </small>
              </div>
            </form>
          </div>

          {/* Mobile quick link */}
          <div className="mt-3 d-lg-none text-center">
            <small className="text-muted">Don’t have an account? <Link to="/signup">Create account</Link></small>
          </div>
        </div>
      </div>
    </div>
  );
}
