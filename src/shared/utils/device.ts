// Intenta sacar un nombre "bonito" del dispositivo/navegador
export function getDeviceName(): string {
  // Chrome/Edge modernos
  // @ts-expect-error userAgentData no está tipado en todos los TS
  const uaData = navigator.userAgentData as { platform?: string; brands?: { brand: string; version: string }[] } | undefined;
  if (uaData?.platform) {
    const brand = uaData.brands?.[0]?.brand?.replace(/\s+/g, '') ?? 'Browser';
    return `${uaData.platform}-${brand}`; // ej: "Windows-Chromium"
  }

  // Fallback estándar
  const platform = (navigator.platform || 'Web').replace(/\s+/g, '');
  const ua = (navigator.userAgent || '').toLowerCase();
  const isMobile = /mobile|android|iphone|ipad/.test(ua) ? 'Mobile' : 'Desktop';
  return `${platform}-${isMobile}`;
}
