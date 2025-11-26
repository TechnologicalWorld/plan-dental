import React from "react";

export type IndicadoresState = {
  higiene: { placa: string; calculo: string; gingivitis: string };
  enfermedadPeriodontal: { leve: boolean; moderada: boolean; severa: boolean };
  malOclusion: { angleI: boolean; angleII: boolean; angleIII: boolean };
  fluorosis: { leve: boolean; moderada: boolean; severa: boolean };
  cpo: { C: number | ""; P: number | ""; O: number | ""; total?: number | "" };
  ceo: { c: number | ""; e: number | ""; o: number | ""; total?: number | "" };
};

const initialValue: IndicadoresState = {
  higiene: { placa: "", calculo: "", gingivitis: "" },
  enfermedadPeriodontal: { leve: false, moderada: false, severa: false },
  malOclusion: { angleI: false, angleII: false, angleIII: false },
  fluorosis: { leve: false, moderada: false, severa: false },
  cpo: { C: "", P: "", O: "", total: "" },
  ceo: { c: "", e: "", o: "", total: "" },
};

export default function IndicadoresSaludBucal({
  value = initialValue,
  onChange,
}: {
  value?: IndicadoresState;
  onChange: (v: IndicadoresState) => void;
}) {
  const v = value;

  const set = (patch: Partial<IndicadoresState>) => onChange({ ...v, ...patch });

  const setHigiene = (k: keyof IndicadoresState["higiene"], val: string) =>
    set({ higiene: { ...v.higiene, [k]: val } });

  const setBool = (scope: "enfermedadPeriodontal" | "malOclusion" | "fluorosis", k: string, val: boolean) =>
    set({ [scope]: { ...(v as any)[scope], [k]: val } } as any);

  const setCPO = (k: keyof IndicadoresState["cpo"], val: string) =>
    set({ cpo: { ...v.cpo, [k]: val === "" ? "" : Number(val) } });
  const setCEO = (k: keyof IndicadoresState["ceo"], val: string) =>
    set({ ceo: { ...v.ceo, [k]: val === "" ? "" : Number(val) } });

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-slate-700">
      <div className="text-center font-semibold mb-3">INDICADORES DE SALUD BUCAL</div>

      <div className="grid grid-cols-3 gap-4">
        {/* Higiene oral */}
        <div className="border border-slate-700 rounded-lg p-3">
          <div className="font-medium mb-2 text-sky-300">HIGIENE ORAL SIMPLIFICADA</div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <div className="opacity-70">PLACA (0-1-2-3)</div>
              <input
                value={v.higiene.placa}
                onChange={(e) => setHigiene("placa", e.target.value)}
                className="w-full mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1"
              />
            </div>
            <div>
              <div className="opacity-70">CÁLCULO (0-1-2-3)</div>
              <input
                value={v.higiene.calculo}
                onChange={(e) => setHigiene("calculo", e.target.value)}
                className="w-full mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1"
              />
            </div>
            <div>
              <div className="opacity-70">GINGIVITIS (0-1)</div>
              <input
                value={v.higiene.gingivitis}
                onChange={(e) => setHigiene("gingivitis", e.target.value)}
                className="w-full mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1"
              />
            </div>
          </div>
        </div>

        {/* Enfermedad periodontal + mal oclusión */}
        <div className="border border-slate-700 rounded-lg p-3 space-y-3">
          <div>
            <div className="font-medium mb-1 text-sky-300">ENFERMEDAD PERIODONTAL</div>
            {(["leve", "moderada", "severa"] as const).map((k) => (
              <label key={k} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={(v.enfermedadPeriodontal as any)[k]}
                  onChange={(e) => setBool("enfermedadPeriodontal", k, e.target.checked)}
                />
                {k.toUpperCase()}
              </label>
            ))}
          </div>
          <div>
            <div className="font-medium mb-1 text-sky-300">MAL OCLUSIÓN</div>
            {(
              [
                ["angleI", "ANGLE I"],
                ["angleII", "ANGLE II"],
                ["angleIII", "ANGLE III"],
              ] as const
            ).map(([k, label]) => (
              <label key={k} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={(v.malOclusion as any)[k]}
                  onChange={(e) => setBool("malOclusion", k, e.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Fluorosis + índices CPO/ceo */}
        <div className="border border-slate-700 rounded-lg p-3 space-y-3">
          <div>
            <div className="font-medium mb-1 text-sky-300">FLUOROSIS</div>
            {(["leve", "moderada", "severa"] as const).map((k) => (
              <label key={k} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={(v.fluorosis as any)[k]}
                  onChange={(e) => setBool("fluorosis", k, e.target.checked)}
                />
                {k.toUpperCase()}
              </label>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border border-slate-700 rounded p-2">
              <div className="text-center text-sm font-medium">ÍNDICES CPO</div>
              {(["C", "P", "O", "total"] as const).map((k) => (
                <div key={k} className="flex items-center justify-between text-sm">
                  <span>{k}</span>
                  <input
                    value={(v.cpo as any)[k] ?? ""}
                    onChange={(e) => setCPO(k as any, e.target.value)}
                    className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 ml-2"
                  />
                </div>
              ))}
            </div>
            <div className="border border-slate-700 rounded p-2">
              <div className="text-center text-sm font-medium">ÍNDICES ceo</div>
              {(["c", "e", "o", "total"] as const).map((k) => (
                <div key={k} className="flex items-center justify-between text-sm">
                  <span>{k}</span>
                  <input
                    value={(v.ceo as any)[k] ?? ""}
                    onChange={(e) => setCEO(k as any, e.target.value)}
                    className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 ml-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

IndicadoresSaludBucal.initialValue = initialValue;
