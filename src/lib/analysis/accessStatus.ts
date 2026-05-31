export type EstadoAcceso = 'Pendiente' | 'Seguro' | 'Sospechoso';

export interface AccessStatusInput {
  risk: string;
  estado?: EstadoAcceso;
  color?: string;
  bloqueado?: boolean;
}

export interface DynamicAccessStatus {
  permitted: boolean;
  text: string;
  shortText: string;
  containerClasses: string;
  badgeClasses: string;
  textClasses: string;
  iconColorClasses: string;
}

/** Determina acceso permitido/bloqueado segun el motor de analisis heuristica. */
export function isAnalysisAccessPermitted({ risk, estado, color }: AccessStatusInput): boolean {
  if (estado === 'Seguro' || risk === 'Seguro' || risk === 'Bajo' || color === 'emerald') {
    return true;
  }
  if (
    estado === 'Sospechoso' ||
    risk === 'Medio' ||
    risk === 'Alto' ||
    risk === 'Critico' ||
    color === 'red' ||
    color === 'yellow'
  ) {
    return false;
  }
  return false;
}

export function getDynamicAccessStatus(input: AccessStatusInput): DynamicAccessStatus {
  const manualBlock = Boolean(input.bloqueado);
  const permitted = !manualBlock && isAnalysisAccessPermitted(input);

  if (permitted) {
    return {
      permitted: true,
      text: 'ACCESO PERMITIDO',
      shortText: 'Permitido',
      containerClasses:
        'bg-gradient-to-r from-emerald-950/70 via-emerald-900/40 to-emerald-950/70 border-emerald-500/60',
      badgeClasses: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50',
      textClasses: 'text-emerald-400',
      iconColorClasses: 'text-emerald-400',
    };
  }

  return {
    permitted: false,
    text: 'ACCESO BLOQUEADO',
    shortText: 'Bloqueado',
    containerClasses:
      'bg-gradient-to-r from-red-950/80 via-red-900/50 to-red-950/80 border-red-500/70',
    badgeClasses: 'bg-red-500/25 text-red-300 border-red-500/50',
    textClasses: 'text-red-400',
    iconColorClasses: 'text-red-400',
  };
}
