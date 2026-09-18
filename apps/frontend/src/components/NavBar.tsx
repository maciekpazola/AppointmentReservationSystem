import { useAuth } from "../auth/useAuth";
import { NavLink } from "react-router-dom";

export function NavBar() {
  const { user, logout } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `btn text-decoration-none border-light ${
      isActive ? "fw-bold" : "fw-normal"
    }`;
    
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className="d-flex gap-2">
          <NavLink className={navClass} to="/appointments">Appointments</NavLink>
          <NavLink className={navClass} to="/services">Services</NavLink>
          <NavLink className={navClass} to="/employees">Employees</NavLink>
        </div>
        
        <div className="d-flex gap-3">
          {!user ? (
            <>
              <NavLink className={navClass} to="/login">Login</NavLink>
              <NavLink className="btn btn-primary text-decoration-none rounded-5" to="/register">Register</NavLink>
            </>
          ) : (
            <NavLink className="btn btn-outline-danger text-decoration-none rounded-5 border-light" to="/" onClick={() => { logout(); }}>Logout</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
