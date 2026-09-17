import { useEffect, useState } from "react";
import { getAppointments } from "../api/appointments.api";
import type { AppointmentResponseDto } from "../types/appointment";

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAppointments()
      .then(setAppointments)
      .catch(() => setError("Failed to load appointments"));
  }, []);

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section>
      <h1>Appointments</h1>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            #{appointment.id} — {appointment.startTime} to{" "}
            {appointment.endTime} ({appointment.status})
          </li>
        ))}
      </ul>
    </section>
  );
}
