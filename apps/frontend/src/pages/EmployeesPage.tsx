import { useEffect, useState } from "react";
import { getEmployees } from "../api/employees.api";
import type { EmployeeResponseDto } from "../types/employee";

export function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch(() => setError("Failed to load employees"));
  }, []);

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section>
      <h1>Employees</h1>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.firstName} {employee.lastName}
          </li>
        ))}
      </ul>
    </section>
  );
}
