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
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            {service.name} — ${service.price}
          </li>
        ))}
      </ul>
    </section>
  );
}
