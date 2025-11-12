import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  title?: string;
  subtitle?: string;
};

const Placeholder: React.FC<Props> = ({ title = 'En construcción', subtitle }) => {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="max-w-xl w-full text-center p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
        <h1 className="text-2xl font-semibold mb-2">{title}</h1>
        {subtitle ? (
          <p className="text-slate-300">{subtitle}</p>
        ) : (
          <p className="text-slate-300">
            Esta pantalla aún no está implementada. Pronto estará lista. 
          </p>
        )}
        <div className="mt-6 text-sm">
          <Link to="/app/dashboard" className="underline opacity-80 hover:opacity-100">
            Volver al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Placeholder;
