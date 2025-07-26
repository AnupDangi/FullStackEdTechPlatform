"use client";
import { Card } from "../../components/ui/card";

interface Student {
  _id: string;
  name: string;
  email: string;
  paymentDone?: boolean;
  paymentMethod?: string;
  enrolledAt?: string;
}

interface AnalyticsTableProps {
  students: Student[];
}

export function AnalyticsTable({ students }: AnalyticsTableProps) {
  if (!students || students.length === 0) {
    return <div className="text-gray-500 p-4">No students found.</div>;
  }

  return (
    <Card className="overflow-x-auto rounded-xl p-4">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Payment</th>
            <th className="text-left p-2">Enrolled At</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id} className="border-t">
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.email}</td>
              <td className="p-2">
                {s.paymentDone === undefined
                  ? "—"
                  : s.paymentDone
                  ? <span className="text-green-600">Paid</span>
                  : <span className="text-yellow-600">Free</span>
                }
                {s.paymentMethod && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({s.paymentMethod})
                  </span>
                )}
              </td>
              <td className="p-2">{s.enrolledAt ? new Date(s.enrolledAt).toISOString().slice(0, 10) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
} 