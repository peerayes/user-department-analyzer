"use client";

import { TransformedData } from "@/types/user.types";
import { useEffect, useState } from "react";

export default function Home() {
  const [departmentData, setDepartmentData] = useState<TransformedData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/departments");

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setDepartmentData(data);
      } catch (err) {
        setError("Error loading department data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading department data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Department Data Analysis</h1>

      {departmentData && Object.entries(departmentData).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(departmentData).map(([department, data]) => (
            <div key={department} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">{department}</h2>

              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Demographics</h3>
                <p>Male: {data.male}</p>
                <p>Female: {data.female}</p>
                <p>Age Range: {data.ageRange}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Hair Colors</h3>
                <ul className="list-disc pl-5">
                  {Object.entries(data.hair).map(([color, count]) => (
                    <li key={color}>
                      {color}: {count}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">User Postal Codes</h3>
                <div className="max-h-40 overflow-y-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Name</th>
                        <th className="text-left">Postal Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(data.addressUser).map(
                        ([name, postalCode]) => (
                          <tr key={name} className="border-b">
                            <td className="py-1">{name}</td>
                            <td className="py-1">{postalCode}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xl">No department data available</p>
      )}
    </main>
  );
}
