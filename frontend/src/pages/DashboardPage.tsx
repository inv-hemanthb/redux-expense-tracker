import BaseLayout from "../components/layout/BaseLayout";

export default function DashboardPage() {
    return (
        <BaseLayout headerMode="app">
            <section className="space-y-6">
                <div className="rounded-2xl border border-indigo-500/20 bg-white/70 p-6 shadow-lg shadow-indigo-500/10 backdrop-blur dark:bg-slate-900/60">
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle mt-2">Track your expenses and insights from here.</p>
                </div>
            </section>
        </BaseLayout>
    );
}