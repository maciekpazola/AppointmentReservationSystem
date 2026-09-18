import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError(null);

    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <section className="container mt-5">
      <h1 className="mb-4">Log in</h1>

      <form onSubmit={handleSubmit} className="col-md-6 mx-auto needs-validation">

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

          <label 
          htmlFor="email">
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
            required
          />

          <label htmlFor="password">
            Password
          </label>
        </div>


        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}


        <button
          className="btn btn-primary btn-lg  rounded-5"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>

      </form>
    </section>
  );
}