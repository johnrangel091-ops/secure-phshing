import { Logo } from './Logo';

interface AppPageHeaderProps {
  title: string;
  subtitle: string;
}

/** Encabezado principal del area de contenido con logo de marca. */
export function AppPageHeader({ title, subtitle }: AppPageHeaderProps) {
  return (
    <div className="mb-6 lg:mb-8 flex items-start gap-4 sm:gap-5">
      <div className="flex-shrink-0 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/25 shadow-lg shadow-cyan-500/10">
        <Logo className="w-11 h-11 sm:w-14 sm:h-14" />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 leading-tight">
          {title}
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">{subtitle}</p>
      </div>
    </div>
  );
}
