'use client';

import { cn } from '@/lib/utils';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'muted' | 'gold';
  className?: string;
  children: React.ReactNode;
}

const variantStyles = {
  h1: 'font-heading text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight',
  h2: 'font-heading text-3xl md:text-4xl font-semibold leading-tight',
  h3: 'font-heading text-2xl md:text-3xl font-medium',
  h4: 'font-heading text-xl md:text-2xl font-medium',
  body: 'font-sans text-base leading-relaxed',
  'body-sm': 'font-sans text-sm leading-relaxed',
  caption: 'font-sans text-xs leading-normal',
  label: 'font-sans text-sm font-medium tracking-wide uppercase',
};

const colorStyles = {
  primary: 'text-[#EAEAEA]',
  secondary: 'text-[#A8A8A8]',
  muted: 'text-[#7A7A7A]',
  gold: 'text-[#F4C542]',
};

export default function Typography({
  variant = 'body',
  color = 'primary',
  className,
  children,
}: TypographyProps) {
  const Component = variant.startsWith('h') ? variant : 'p';
  
  return (
    <Component className={cn(variantStyles[variant], colorStyles[color], className)}>
      {children}
    </Component>
  );
}

// Convenience components
export function H1({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Typography variant="h1" className={className}>{children}</Typography>;
}

export function H2({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Typography variant="h2" className={className}>{children}</Typography>;
}

export function H3({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Typography variant="h3" className={className}>{children}</Typography>;
}

export function Body({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Typography variant="body" className={className}>{children}</Typography>;
}

export function Caption({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Typography variant="caption" color="muted" className={className}>{children}</Typography>;
}

export function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <Typography variant="label" className={className}>{children}</Typography>;
}