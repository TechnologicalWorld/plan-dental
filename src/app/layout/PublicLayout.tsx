import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen grid place-items-center bg-[#0f625f]">
      <Outlet />
    </div>
  );
}