import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-900">KanbanBoard</h1>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-900 transition">
            Sign in
          </Link>
          <Link to="/register" className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2 rounded-xl transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-28">
        <span className="bg-blue-100 text-blue-900 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          Project Management
        </span>
        <h2 className="text-5xl font-bold text-gray-900 max-w-3xl leading-tight">
          Manage Projects &amp; <br />
          <span className="text-blue-900">Collaborate</span> With Your Team
        </h2>
        <p className="mt-6 text-gray-500 max-w-xl text-lg leading-relaxed">
          A complete project management platform where teams can create projects,
          organize tasks and track progress using Kanban boards.
        </p>
        <div className="flex gap-4 mt-10">
          <Link
            to="/register"
            className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 py-3.5 rounded-xl transition shadow-lg"
          >
            Start for Free
          </Link>
          <Link
            to="/login"
            className="border border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold px-8 py-3.5 rounded-xl transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: '', title: 'Kanban Boards', desc: 'Visualize your workflow with drag-and-drop task management.' },
            { icon: '', title: 'Project Tracking', desc: 'Create and manage multiple projects all in one place.' },
            { icon: '', title: 'Task Management', desc: 'Add, prioritize and move tasks across columns effortlessly.' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 text-center">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-blue-900 text-lg">{f.title}</h3>
              <p className="text-gray-500 text-sm mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-400 border-t border-gray-100">
        © {new Date().getFullYear()} KanbanBoard. All rights reserved.
      </footer>

    </div>
  );
}
