// // src/components/Navbar.jsx
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import NotificationBell from './NotificationBell';

// function safeParseUser() {
//   const raw = localStorage.getItem('user');
//   if (!raw) return null;
//   try {
//     return JSON.parse(raw);
//   } catch (err) {
//     // If it's not valid JSON, treat it as a simple username string
//     return { name: String(raw), role: null, id: null };
//   }
// }

// export default function Navbar(){
//   const navigate = useNavigate();
//   const user = safeParseUser();
//   const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/'); };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
//       <div className="container">
//         <Link className="navbar-brand" to="/">BioDeck</Link>
//         <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navMenu">
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse" id="navMenu">
//           <ul className="navbar-nav ms-auto align-items-center">
//             {!user && (
//               <>
//                 <li className="nav-item"><Link className="nav-link" to="/signup">Sign up</Link></li>
//                 <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
//               </>
//             )}

//             {user && (
//               <>
//                 {/* Show bell only to founders */}
//                 {user.role === 'founder' && (
//                   <li className="nav-item me-2 d-flex align-items-center">
//                     <NotificationBell />
//                   </li>
//                 )}

//                 <li className="nav-item me-2">
//                   <span className="nav-link">
//                     {user.name} {user.role ? `(${user.role})` : ''}
//                   </span>
//                 </li>

//                 <li className="nav-item">
//                   <button className="btn btn-outline-secondary btn-sm" onClick={logout}>Logout</button>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }


// client/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';

function safeParseUser() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    return { name: String(raw), role: null, id: null };
  }
}

export default function Navbar(){
  const navigate = useNavigate();
  const user = safeParseUser();
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/'); };

  // derive initials for avatar
  const initials = user?.name ? user.name.split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase() : '';

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">BioDeck</Link>

        <div className="d-flex align-items-center ms-auto">
          {/* Show bell only to founders */}
          {user && user.role === 'founder' && <NotificationBell />}

          {/* If logged in show profile dropdown */}
          {user ? (
            <div className="dropdown">
              <button
                className="btn btn-light d-flex align-items-center gap-2"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{borderRadius: 999}}
              >
                <div className="avatar-sm d-flex align-items-center justify-content-center text-white bg-primary fw-bold">
                  {initials || <i className="bi bi-person-fill"></i>}
                </div>
              </button>

              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                <li className="dropdown-item-text">
                  <div className="fw-semibold">{user.name}</div>
                  <div className="small text-muted">{user.email || ''}</div>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={() => navigate(user.role === 'founder' ? '/founder' : '/investor')}>
                    Dashboard
                  </button>
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={logout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link className="btn btn-outline-primary" to="/signup">Sign up</Link>
              <Link className="btn btn-primary" to="/login">Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
