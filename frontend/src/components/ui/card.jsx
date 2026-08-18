import * as React from 'react';
import { cn } from '@/utils/utils';

/* ---------- Card Container ---------- */

const Card = React.forwardRef(({
  className,
  hoverable,
  ...props
}, ref) => <div ref={ref} className={cn('rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-xs)]', hoverable && 'transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)]', className)} {...props} />);
Card.displayName = 'Card';

/* ---------- Card Header ---------- */
const CardHeader = React.forwardRef(({
  className,
  ...props
}, ref) => <div ref={ref} className={cn('flex flex-col gap-1.5 p-5 pb-0', className)} {...props} />);
CardHeader.displayName = 'CardHeader';

/* ---------- Card Title ---------- */
const CardTitle = React.forwardRef(({
  className,
  ...props
}, ref) => <h3 ref={ref} className={cn('text-base font-semibold text-[var(--text-primary)] leading-snug', className)} {...props} />);
CardTitle.displayName = 'CardTitle';

/* ---------- Card Description ---------- */
const CardDescription = React.forwardRef(({
  className,
  ...props
}, ref) => <p ref={ref} className={cn('text-sm text-[var(--text-secondary)]', className)} {...props} />);
CardDescription.displayName = 'CardDescription';

/* ---------- Card Content ---------- */
const CardContent = React.forwardRef(({
  className,
  ...props
}, ref) => <div ref={ref} className={cn('p-5', className)} {...props} />);
CardContent.displayName = 'CardContent';

/* ---------- Card Footer ---------- */
const CardFooter = React.forwardRef(({
  className,
  ...props
}, ref) => <div ref={ref} className={cn('flex items-center p-5 pt-0', className)} {...props} />);
CardFooter.displayName = 'CardFooter';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };