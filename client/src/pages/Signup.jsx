import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'founder',
    company: { name: '', website: '', bio: '' }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  const onChange = (path, value) => {
    if (path.startsWith('company.')) {
      const key = path.split('.')[1];
      setForm(prev => ({ ...prev, company: { ...prev.company, [key]: value } }));
    } else {
      setForm(prev => ({ ...prev, [path]: value }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!agree) return setError('You must agree to the Terms to continue.');
    if (!form.name.trim() || !form.email.trim() || !form.password) return setError('Please fill required fields.');

    setLoading(true);
    try {
      const { data } = await API.post('/auth/signup', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.role === 'founder') nav('/founder'); else nav('/investor');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error signing up. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return { label: '', score: 0 };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const labels = ['Very weak', 'Weak', 'Okay', 'Good', 'Strong'];
    return { label: labels[score], score };
  };

  const strength = passwordStrength();

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center gx-5">
        <div className="col-lg-5 d-none d-lg-block">
          <div className="card shadow-sm border-0">
            <img
              src="https://media.licdn.com/dms/image/v2/D5612AQF_8eAHKXqR4Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1683548752819?e=2147483647&v=beta&t=KMTnsTmutKG1Hwk8As3brCwGUIrjfjOvdzJyJkuacbY"
              alt="signup-hero"
              className="img-fluid rounded-start hero-illustration"
            />
            <div className="card-body">
              <h4 className="fw-bold">Welcome to BioDeck</h4>
              <p className="text-muted mb-0">Securely share your pitch, control access with NDAs, and discover investor interest — all from one dashboard.</p>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="h4 mb-0">Create your account</h3>
              {/* removed top-right login link to move it to bottom */}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={submit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full name</label>
                  <input
                    className="form-control"
                    value={form.name}
                    onChange={e => onChange('name', e.target.value)}
                    placeholder="e.g. Jane Doe"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={e => onChange('email', e.target.value)}
                    placeholder="you@company.com"
                    required
                  />
                </div>

                <div className="col-md-8">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      value={form.password}
                      onChange={e => onChange('password', e.target.value)}
                      placeholder="Choose a strong password"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(s => !s)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {form.password && (
                    <div className="mt-2 d-flex align-items-center gap-2">
                      <div className="progress flex-grow-1" style={{height: 8}}>
                        <div
                          className={`progress-bar ${strength.score >= 3 ? 'bg-success' : strength.score >= 2 ? 'bg-warning' : 'bg-danger'}`}
                          role="progressbar"
                          style={{width: `${(strength.score / 4) * 100}%`}}
                        />
                      </div>
                      <small className="text-muted" style={{width: 90, textAlign: 'right'}}>{strength.label}</small>
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={form.role}
                    onChange={e => onChange('role', e.target.value)}
                  >
                    <option value="founder">Founder</option>
                    <option value="investor">Investor</option>
                  </select>
                </div>

                {form.role === 'founder' && (
                  <div className="col-12">
                    <div className="card border-0 bg-light p-3">
                      <h6 className="mb-2">Company information</h6>
                      <div className="row g-2">
                        <div className="col-md-6">
                          <input
                            className="form-control"
                            placeholder="Company name"
                            value={form.company.name}
                            onChange={e => onChange('company.name', e.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            className="form-control"
                            placeholder="Website (optional)"
                            value={form.company.website}
                            onChange={e => onChange('company.website', e.target.value)}
                          />
                        </div>
                        <div className="col-12 mt-2">
                          <textarea
                            className="form-control"
                            rows="2"
                            placeholder="Short company description (optional)"
                            value={form.company.bio}
                            onChange={e => onChange('company.bio', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="col-12 d-flex align-items-center">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="agreeTerms"
                      checked={agree}
                      onChange={e => setAgree(e.target.checked)}
                    />
                    <label className="form-check-label small" htmlFor="agreeTerms">
                      I agree to the <a href="#" onClick={(e)=>e.preventDefault()}>Terms</a> and <a href="#" onClick={(e)=>e.preventDefault()}>Privacy Policy</a>.
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  <button className="btn btn-primary btn-lg w-100" disabled={loading}>
                    {loading ? 'Creating account…' : 'Create account'}
                  </button>
                </div>

                {/* moved Login link to bottom */}
                <div className="col-12 text-center mt-2">
                  <small className="text-muted">
                    Already have an account? <Link to="/login">Login</Link>
                  </small>
                </div>

                <div className="col-12 text-center">
                  <small className="text-muted">By creating an account you agree to our terms. Need help? <a href="#" onClick={(e)=>e.preventDefault()}>Contact us</a></small>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-3 d-lg-none text-center">
            <small className="text-muted">Already a member? <Link to="/login">Login</Link></small>
          </div>
        </div>
      </div>
    </div>
  );
}
