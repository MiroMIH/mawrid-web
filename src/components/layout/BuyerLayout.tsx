import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function BuyerLayout() {
  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      <Navbar />
      <main className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
