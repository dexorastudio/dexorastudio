import React from 'react';

interface CustomButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'full';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  target?: string;
  rel?: string;
  className?: string;
  ariaLabel?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'sm',
  href,
  type = 'button',
  onClick,
  disabled = false,
  target,
  rel,
  className = '',
  ariaLabel,
}) => {
  const baseStyles =
    'group relative inline-flex items-center justify-center gap-2.5 max-w-full font-medium tracking-wide whitespace-nowrap shrink-0 overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-[#C9A96E] focus-visible:outline-offset-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'bg-[#C9A96E] text-[#050505] hover:bg-[#E8D5AC] active:scale-[0.98] shadow-[0_8px_28px_rgba(201,169,110,0.18)]',
    secondary:
      'bg-[#111111]/85 text-[#F5F1E8] border border-[#D4D4D8]/25 hover:border-[#C9A96E]/70 hover:text-[#E8D5AC] hover:bg-[#202020]/90 active:scale-[0.98]',
    ghost:
      'bg-transparent text-[#D4D4D8] hover:text-[#E8D5AC] border border-transparent hover:border-[#D4D4D8]/15',
  };

  const radiusClass = rounded === 'full' ? 'rounded-full' : 'rounded-sm';

  const sizeStyles = {
    sm: `px-4 py-2 text-xs min-h-[40px] ${radiusClass}`,
    md: `px-5 sm:px-6 py-3 text-sm min-h-[44px] ${radiusClass}`,
    lg: `px-6 sm:px-8 py-3.5 text-sm sm:text-base min-h-[48px] ${radiusClass}`,
  };

  const combined = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const sheenOverlay =
    variant === 'primary' ? (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full"
      />
    ) : null;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        aria-label={ariaLabel}
        className={combined}
      >
        {sheenOverlay}
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={combined}
    >
      {sheenOverlay}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  );
};
