import { ProjectList } from "../../components/projects/ProjectList";

export const metadata = {
  title: "Daftar Proyek | SIVANA",
  description: "Kelola proyek perencanaan infrastruktur EV Anda.",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-50">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-brand-light/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand-primary/5 blur-3xl pointer-events-none" />

      {/* Page Header with Glass Effect */}
      <div className="relative sticky top-0 z-10 glass-panel border-b-0">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-brand-dark tracking-tight">Daftar Proyek</h1>
          <p className="text-brand-primary/80 mt-2 text-lg">
            Kelola dan pantau semua proyek perencanaan Anda di satu tempat.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-0">
        <ProjectList />
      </div>
    </main>
  );
}
