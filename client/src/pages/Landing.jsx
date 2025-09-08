// import React from 'react';
// import { Link } from 'react-router-dom';

// export default function Landing(){
//   return (
//     <div className="p-5 bg-white rounded-3 shadow-sm">
//       <div className="row align-items-center">
//         <div className="col-md-6">
//           <h1>BioDeck — pitch, protect, present</h1>
//           <p className="lead">Upload your pitch deck, control access with NDA, and connect with investors.</p>
//           <Link className="btn btn-primary me-2" to="/signup">Get early access</Link>
//           <Link className="btn btn-outline-secondary" to="/login">Login</Link>
//         </div>
//         <div className="col-md-6 text-center">
//           <img src="https://placehold.co/500x300" alt="hero" className="img-fluid rounded" />
//         </div>
//       </div>
//     </div>
//   );
// }


// client/src/pages/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing(){
  return (
    <div className="container py-5">
      {/* HERO */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-6">
          <h1 className="display-5 fw-bold">BioDeck — pitch, protect, present</h1>
          <p className="lead text-muted mb-4">
            Upload your pitch deck, control access with NDA, and get introduced to investors who actually match your stage and sector.
            Secure storage, simple sharing controls, and clear analytics — all built for founders.
          </p>

          <div className="d-flex gap-2">
            <Link to="/signup" className="btn btn-primary btn-lg">Get early access</Link>
            <Link to="/login" className="btn btn-outline-secondary btn-lg">Login</Link>
          </div>

          <div className="row mt-4 g-3">
            <div className="col-6 col-md-6">
              <div className="p-3 bg-light rounded">
                <strong>Secure</strong>
                <div className="small text-muted">Encrypted uploads, NDA gating</div>
              </div>
            </div>
            <div className="col-6 col-md-6">
              <div className="p-3 bg-light rounded">
                <strong>Discover</strong>
                <div className="small text-muted">Connect with compatible investors</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 text-center">
          <img src="https://media.licdn.com/dms/image/v2/D5612AQF_8eAHKXqR4Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1683548752819?e=2147483647&v=beta&t=KMTnsTmutKG1Hwk8As3brCwGUIrjfjOvdzJyJkuacbY" alt="hero" className="img-fluid rounded shadow-sm" style={{ height: "450px", objectFit: "cover" }} />
        </div>
      </div>

      {/* FEATURES */}
      <div className="mb-5 text-center">
        <h2 className="h4">Why founders love BioDeck</h2>
        <p className="text-muted mb-4">Everything you need to pitch, protect your IP, and track investor interest — without the noise.</p>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <img src="https://ancgroup.com/wp-content/uploads/2022/06/AppliedNetwork-Blog-data-secure-internet-security-and-data-protection-concept-blockchain-and-cybersecurity-2.jpg" className="card-img-top" alt="Secure storage" />
              <div className="card-body">
                <h5 className="card-title">Secure Storage</h5>
                <p className="card-text text-muted">Store decks privately, require NDAs, and control who sees your strategy.</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <img src="https://moneyispriority.com/wp-content/uploads/2024/03/vfr-1024x725.png" className="card-img-top" alt="Matching" />
              <div className="card-body">
                <h5 className="card-title">Targeted Connections</h5>
                <p className="card-text text-muted">See investors who match your stage and vertical — get introductions that matter.</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <img src="https://static.vecteezy.com/system/resources/previews/004/579/158/non_2x/enterprise-data-analytics-and-business-investment-free-vector.jpg" className="card-img-top" alt="Analytics" />
              <div className="card-body">
                <h5 className="card-title">Deck Analytics</h5>
                <p className="card-text text-muted">Track views, active investors, and which slides pique interest.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="mb-5">
        <h3 className="h5">How it works</h3>
        <div className="row g-4 mt-3">
          <div className="col-md-4">
            <div className="p-3 border rounded h-100">
              <h6 className="mb-2">1. Create profile</h6>
              <p className="small text-muted mb-0">Sign up as a founder, add company details and your fundraising goals.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 border rounded h-100">
              <h6 className="mb-2">2. Upload deck</h6>
              <p className="small text-muted mb-0">Upload your pitch and choose whether an NDA is required for viewers.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 border rounded h-100">
              <h6 className="mb-2">3. Get matched</h6>
              <p className="small text-muted mb-0">Investors view your deck; you get notified and can collect feedback.</p>
            </div>
          </div>
        </div>
      </div>

      {/* STATS + CTA */}
      <div className="row align-items-center bg-white p-4 rounded shadow-sm">
        <div className="col-md-8">
          <h4 className="mb-1">Ready to get better investor conversations?</h4>
          <p className="text-muted mb-0">Start with a secure deck and let BioDeck surface the right interest.</p>
        </div>
        <div className="col-md-4 text-md-end mt-3 mt-md-0">
          <Link to="/signup" className="btn btn-primary btn-lg">Create account</Link>
        </div>
      </div>
    </div>
  );
}
