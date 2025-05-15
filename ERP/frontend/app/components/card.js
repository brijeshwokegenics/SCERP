// File: components/ui/card.js
import React from 'react';

const mergeClasses = (...classes) => classes.filter(Boolean).join(' ');

export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={mergeClasses(
        'rounded-2xl shadow-md bg-white border border-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={mergeClasses('p-4', className)} {...props}>
      {children}
    </div>
  );
}
