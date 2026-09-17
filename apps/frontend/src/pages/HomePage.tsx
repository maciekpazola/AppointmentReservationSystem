import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export function HomePage() {
  const { user, logout } = useAuth();

  return (
    <section>
      <h1>Appointment Reservation System</h1>
      <p>
        Logged in as {user?.email} ({user?.role})
      </p>
      <nav>
        <Link to="/appointments">Appointments</Link>{" "}
        <Link to="/services">Services</Link>{" "}
        <Link to="/employees">Employees</Link>
      </nav>
      <button type="button" onClick={logout}>
        Log out
      </button>
    </section>
  );
}
