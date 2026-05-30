import type { PhishingAnalysisResult } from './phishingAnalyzer';

/** Recomendaciones de seguridad generadas dinamicamente segun el nivel de riesgo. */
export function getSecurityRecommendations(analysis: PhishingAnalysisResult): string[] {
  if (analysis.color === 'emerald' || analysis.risk === 'Seguro' || analysis.risk === 'Bajo') {
    return [
      'Este sitio parece seguro para navegar bajo los criterios heurísticos aplicados.',
      'Verifica siempre que la URL coincida con el dominio oficial de la organizacion.',
      'Mantén tu navegador y antivirus actualizados como capa adicional de proteccion.',
      'Evita introducir credenciales si llegaste al enlace desde un email no solicitado.',
    ];
  }

  if (analysis.color === 'yellow' || analysis.risk === 'Medio') {
    return [
      'Procede con extrema precaucion: el enlace presenta indicadores de riesgo moderado.',
      'No ingreses datos personales, financieros ni credenciales de acceso.',
      'Verifica la autenticidad del sitio contactando directamente a la entidad oficial.',
      'Considera bloquear la URL y reportarla al equipo de seguridad de tu organizacion.',
      'Acceso restringido automaticamente hasta completar una verificacion manual adicional.',
    ];
  }

  return [
    'NO navegues en este sitio: alta probabilidad de phishing o fraude.',
    'No ingreses ninguna informacion personal, bancaria o credenciales.',
    'Reporta este sitio como sospechoso a tu equipo de TI o autoridad competente.',
    'Bloquea la URL de inmediato usando la funcion de bloqueo de la plataforma.',
    'Elimina el mensaje o correo que contenia este enlace sin interactuar con el.',
    'Acceso bloqueado automaticamente por politica de seguridad del analisis.',
  ];
}
