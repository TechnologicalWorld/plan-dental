import React, { useEffect, useState } from "react";
import Modal from "@/shared/ui/Modal";
import { fetchCitaDetalle } from "@/features/calendario/calendario.service";

type Props = {
  open: boolean;
  onClose: () => void;
  citaId?: number | null;
};

export default function EventInfoModal({ open, onClose, citaId }: Props) {
  const [loading, setLoading] = useState(false);
  const [detalle, setDetalle] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (!open || !citaId) return;
      setLoading(true);
      try {
        const d = await fetchCitaDetalle(citaId);
        setDetalle(d);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, citaId]);

  return (
    <Modal open={open} onClose={onClose} title="Detalle de la cita" widthClass="max-w-xl">
      {loading ? (
        <div>Cargando...</div>
      ) : !detalle ? (
        <div>No se encontró detalle.</div>
      ) : (
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div><span className="font-semibold">ID:</span> {detalle.idCita}</div>
            <div><span className="font-semibold">Estado:</span> {detalle.estado}</div>
            <div><span className="font-semibold">Tipo:</span> {detalle.tipoCita}</div>
            <div><span className="font-semibold">Fecha:</span> {String(detalle.fecha).slice(0,10)}</div>
            <div><span className="font-semibold">Hora:</span> {String(detalle.hora).match(/T(\d{2}:\d{2})/)?.[1] ?? String(detalle.hora).slice(0,5)}</div>
            <div><span className="font-semibold">Costo:</span> {detalle.costo}</div>
          </div>

          <div>
            <div className="font-semibold mb-1">Paciente(s)</div>
            <ul className="list-disc pl-5">
              {(detalle.pacientes ?? []).map((p: any) => (
                <li key={p.idUsuario_Paciente}>
                  {p.usuario?.nombre} {p.usuario?.paterno} (CI: {p.usuario?.ci})
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-semibold mb-1">Odontólogo(s)</div>
            <ul className="list-disc pl-5">
              {(detalle.odontologos ?? []).map((o: any) => (
                <li key={o.idUsuario_Odontologo}>
                  {o.usuario?.nombre} {o.usuario?.paterno} (CI: {o.usuario?.ci})
                </li>
              ))}
            </ul>
          </div>

          {Array.isArray(detalle.tratamientos) && detalle.tratamientos.length > 0 && (
            <div>
              <div className="font-semibold mb-1">Tratamientos</div>
              <ul className="list-disc pl-5">
                {detalle.tratamientos.map((t: any) => (
                  <li key={t.idTratamiento}>{t.nombre} — {t.precio}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
