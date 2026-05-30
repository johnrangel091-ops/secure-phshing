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
      text: 'Acceso: Permitido',
      shortText: 'Permitido',
      containerClasses:
        'bg-gradient-to-r from-emerald-950/40 to-emerald-900/20 border-emerald-500/40',
      badgeClasses: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      textClasses: 'text-emerald-400',
      iconColorClasses: 'text-emerald-400',
    };
  }

  return {
    permitted: false,
    text: 'Acceso: Bloqueado',
    shortText: 'Bloqueado',
    containerClasses:
      'bg-gradient-to-r from-red-950/50 to-red-900/20 border-red-500/40',
    badgeClasses: 'bg-red-500/15 text-red-400 border-red-500/30',
    textClasses: 'text-red-400',
    iconColorClasses: 'text-red-400',
  };
}
