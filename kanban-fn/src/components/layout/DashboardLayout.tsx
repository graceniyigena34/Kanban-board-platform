import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 bg-blue-50">{children}</main>
      </div>
    </div>
  );
}
