import React, { useMemo } from "react";
import ToothCell, { type ColoredSegments, type ToothSegment } from "./ToothCell";
import type { PiezaDental } from "../odontograma.service";

const filas = {
  supDer: ["18","17","16","15","14","13","12","11"],
  supIzq: ["21","22","23","24","25","26","27","28"],
  infDer: ["48","47","46","45","44","43","42","41"],
  infIzq: ["31","32","33","34","35","36","37","38"],
};

export default function DentalChart({
  piezas,
  coloredByPos,
  onClickPieza,
  onClickZona,
}: {
  piezas: PiezaDental[];
  coloredByPos?: Record<string, ColoredSegments>;
  onClickPieza: (pieza: PiezaDental) => void;
  onClickZona: (pieza: PiezaDental, segment: ToothSegment) => void;
}) {
  const byPos = useMemo(() => new Map(piezas.map((p) => [p.posicion, p])), [piezas]);

  const Bloque = ({ arr }: { arr: string[] }) => (
    <div className="flex gap-3 justify-center">
      {arr.map((pos) => {
        const p = byPos.get(pos) || ({ posicion: pos } as PiezaDental);
        const imgSrc = `/teeth/${pos}.png`;
        const colored = coloredByPos?.[pos] ?? {};
        return (
          <ToothCell
            key={pos}
            toothCode={pos}
            imgSrc={imgSrc}
            coloredSegments={colored}
            onClickAny={() => onClickPieza(p)}
            onClickSegment={(seg) => onClickZona(p, seg)}
          />
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Superior */}
      <div className="grid grid-cols-2 gap-8 border-b-2 border-slate-600 pb-6">
        <Bloque arr={filas.supDer} />
        <Bloque arr={filas.supIzq} />
      </div>

      {/* Inferior */}
      <div className="grid grid-cols-2 gap-8 pt-2">
        <Bloque arr={filas.infDer} />
        <Bloque arr={filas.infIzq} />
      </div>
    </div>
  );
}