import React from "react";

export type ToothSegment = "TOP" | "RIGHT" | "BOTTOM" | "LEFT" | "CENTER";
export type ColoredSegments = Partial<Record<ToothSegment, string>>;

function segTitle(s: ToothSegment) {
  switch (s) {
    case "TOP": return "Oclusal / Incisal (superior)";
    case "RIGHT": return "Distal";
    case "BOTTOM": return "Lingual/Palatina (inferior)";
    case "LEFT": return "Mesial";
    case "CENTER": return "Central (cámara)";
  }
}

export default function ToothCell({
  toothCode,
  imgSrc,
  coloredSegments = {},
  onClickAny,
  onClickSegment,
}: {
  toothCode: string;
  imgSrc?: string;
  coloredSegments?: ColoredSegments;
  onClickAny?: () => void;
  onClickSegment?: (segment: ToothSegment) => void;
}) {
  const size = 40;
  const cx = 20, cy = 20, rOuter = 18, rInner = 7;

  const pathTop    = `M ${cx},${cy} L ${cx},${cy - rOuter} A ${rOuter},${rOuter} 0 0 1 ${cx + rOuter},${cy} L ${cx},${cy} Z`;
  const pathRight  = `M ${cx},${cy} L ${cx + rOuter},${cy} A ${rOuter},${rOuter} 0 0 1 ${cx},${cy + rOuter} L ${cx},${cy} Z`;
  const pathBottom = `M ${cx},${cy} L ${cx},${cy + rOuter} A ${rOuter},${rOuter} 0 0 1 ${cx - rOuter},${cy} L ${cx},${cy} Z`;
  const pathLeft   = `M ${cx},${cy} L ${cx - rOuter},${cy} A ${rOuter},${rOuter} 0 0 1 ${cx},${cy - rOuter} L ${cx},${cy} Z`;

  const segs: { key: ToothSegment; d?: string }[] = [
    { key: "TOP", d: pathTop },
    { key: "RIGHT", d: pathRight },
    { key: "BOTTOM", d: pathBottom },
    { key: "LEFT", d: pathLeft },
  ];

  const baseFill = "rgba(200,200,200,0.3)";
  const hoverFill = "rgba(56,189,248,0.5)";

  return (
    <div className="flex flex-col items-center gap-1">
      {imgSrc && (
        <div className="w-8 h-8 flex items-center justify-center cursor-pointer" onClick={onClickAny}>
          <img
            src={imgSrc}
            alt={`Diente ${toothCode}`}
            className="w-full h-full object-contain pointer-events-none select-none"
          />
        </div>
      )}

      {/* Círculo con 5 partes */}
      <div className="relative">
        <svg 
          viewBox={`0 0 ${size} ${size}`} 
          width={size} 
          height={size}
          className="block cursor-pointer"
        >
          {/* Fondo circular */}
          <circle cx={cx} cy={cy} r={rOuter} fill="rgba(148,163,184,0.1)" />

          {/* Cuadrantes TOP, RIGHT, BOTTOM, LEFT */}
          {segs.map((s) => {
            const fill = coloredSegments[s.key] ?? baseFill;
            return (
              <path
                key={s.key}
                d={s.d!}
                fill={fill}
                className="cursor-pointer transition-colors"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onClickSegment?.(s.key); 
                }}
                onMouseEnter={(e) => { 
                  if (!coloredSegments[s.key]) (e.currentTarget as any).style.fill = hoverFill; 
                }}
                onMouseLeave={(e) => { 
                  if (!coloredSegments[s.key]) (e.currentTarget as any).style.fill = baseFill; 
                }}
              >
                <title>{segTitle(s.key)}</title>
              </path>
            );
          })}

          {/* Centro */}
          <circle
            cx={cx} cy={cy} r={rInner}
            fill={coloredSegments.CENTER ?? baseFill}
            className="cursor-pointer transition-colors"
            onClick={(e) => { 
              e.stopPropagation(); 
              onClickSegment?.("CENTER"); 
            }}
            onMouseEnter={(e) => { 
              if (!coloredSegments.CENTER) (e.currentTarget as any).style.fill = hoverFill; 
            }}
            onMouseLeave={(e) => { 
              if (!coloredSegments.CENTER) (e.currentTarget as any).style.fill = baseFill; 
            }}
          />

          {/* Bordes */}
          <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="rgba(100,100,100,0.6)" strokeWidth={1}/>
          <circle cx={cx} cy={cy} r={rInner} fill="none" stroke="rgba(100,100,100,0.6)" strokeWidth={0.8}/>
        </svg>
      </div>

      {/* Número del diente DEBAJO */}
      <div className="text-[10px] text-slate-300 font-medium">{toothCode}</div>
    </div>
  );
}