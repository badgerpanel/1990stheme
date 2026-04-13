'use client';

import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = `
      font-family: 'VT323', 'MS Sans Serif', monospace
      cursor-pointer select-none inline-flex items-center justify-center
      active:border-t-[#808080] active:border-l-[#808080]
      active:border-b-white active:border-r-white
      disabled:opacity-50 disabled:cursor-not-allowed
    `.replace(/\n/g, ' ').trim();

    const sizeStyles = {
      default: 'px-4 py-1 text-sm min-h-[28px]',
      sm: 'px-2 py-0.5 text-xs min-h-[22px]',
      lg: 'px-6 py-2 text-base min-h-[34px]',
      icon: 'h-[28px] w-[28px] p-0',
    };

    const variantStyles = {
      default: 'bg-[#c0c0c0] text-black border-2 border-t-white border-l-white border-b-[#000] border-r-[#000] shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#fff]',
      destructive: 'bg-[#c0c0c0] text-red-700 font-bold border-2 border-t-white border-l-white border-b-[#000] border-r-[#000]',
      outline: 'bg-[#c0c0c0] text-black border-2 border-[#808080]',
      ghost: 'bg-transparent text-black hover:bg-[#000080] hover:text-white border-none',
      link: 'bg-transparent text-[#000080] underline border-none p-0 h-auto',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block animate-spin">&#9201;</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
