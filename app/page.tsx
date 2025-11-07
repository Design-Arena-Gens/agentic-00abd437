import { DataTable } from "../components/DataTable";
import { generateCustomers } from "../lib/data";

export default function Page() {
  const customers = generateCustomers(60);
  return (
    <main className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of customer accounts and revenue</p>
        </div>
        <a
          href="#"
          className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
        >
          New customer
        </a>
      </header>

      <section>
        <DataTable rows={customers} />
      </section>
    </main>
  );
}
