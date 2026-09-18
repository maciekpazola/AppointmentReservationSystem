import { useEffect, useState } from "react";
import { getServices } from "../api/services.api";
import type { ServiceResponseDto } from "../types/service";

export function ServicesPage() {
  const [services, setServices] = useState<ServiceResponseDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch(() => setError("Failed to load services"));
  }, []);

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section>
      <h1>Services</h1>
      <div>
        {services.map((service) => (
          <div className="card">
          <div key={service.id}>
            <div className="card-body">
              <h5 className="card-title">{service.name}</h5>
              <p className="card-text">${service.price}</p>
            </div>
          </div>
          </div>
        ))}
      </div>
    </section>
  );
}
