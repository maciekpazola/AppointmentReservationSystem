import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createCustomer } from "../api/customers.api";

export function RegisterPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await createCustomer({
        firstName,
        lastName,
        email,
        password,
      });

      navigate("/login");
    } catch {
      setError("Could not register. Please check your details and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container mt-5">
      <h1 className="mb-4">Register</h1>

      <form onSubmit={handleSubmit} className="col-md-6 mx-auto">

        <div className="form-floating mb-3">
          <input
            id="firstName"
            className="form-control"
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
          <label htmlFor="firstName">
            First name
          </label>
        </div>


        <div className="form-floating mb-3">
          <input
            id="lastName"
            className="form-control"
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
          />
          <label htmlFor="lastName">
            Last name
          </label>
        </div>


        <div className="form-floating mb-3">
          <input
            id="email"
            className="form-control"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <label htmlFor="email">
            Email
          </label>
        </div>


        <div className="form-floating mb-3">
          <input
            id="password"
            className="form-control"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
          <label htmlFor="password">
            Password
          </label>
        </div>


        <div className="form-floating mb-3">
          <input
            id="confirmPassword"
            className="form-control"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={6}
            required
          />
          <label htmlFor="confirmPassword">
            Confirm password
          </label>
        </div>


        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}


        <button
          className="btn btn-primary btn-lg rounded-5"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

      </form>
    </section>
  );
}