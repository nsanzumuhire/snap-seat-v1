
import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function ResponsiveContainer({
  children,
  className,
  as: Component = 'div',
}: ResponsiveContainerProps) {
  return (
    <Component 
      className={cn(
        'w-full px-4 sm:px-6 md:px-8 mx-auto',
        'max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl',
        className
      )}
    >
      {children}
    </Component>
  );
}

export function SectionContainer({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        'py-8 sm:py-12 md:py-16 lg:py-20',
        className
      )}
      {...props}
    >
      <ResponsiveContainer>
        {children}
      </ResponsiveContainer>
    </section>
  );
}
