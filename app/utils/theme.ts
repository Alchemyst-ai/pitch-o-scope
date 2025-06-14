export const theme = {
  // Background Gradient
  backgroundGradient: 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950',
  
  // Gradient Accents
  titleGradient: 'bg-gradient-to-br from-[#ffee00] to-[#f04848] text-transparent bg-clip-text',
  buttonGradient: 'bg-gradient-to-br from-[#dbb13d] to-[#f04848]',
  overlayGradient: 'bg-gradient-to-br from-orange-500/15 to-orange-500/5',
  
  // Accent Colors
  accentText: 'text-orange-500',
  gradientSeparator: 'bg-gradient-to-r from-orange-400 to-orange-600',
  
  // Glassmorphism
  glassCard: 'bg-gray-900/30 backdrop-blur-xl',
  glassInput: 'bg-gray-800/40 backdrop-blur-xl',
  glassBorder: 'border border-white/20',
  
  // Typography
  headingText: 'text-white',
  bodyText: 'text-gray-300',
  
  // Interactive States
  hoverEffect: 'transition-all duration-200 transform hover:scale-[1.02] hover:brightness-110',
};

export const combineClasses = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
}; 