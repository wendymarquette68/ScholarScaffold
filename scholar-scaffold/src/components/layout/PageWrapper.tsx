import React from 'react';

interface PageWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function PageWrapper({ title, subtitle, children }: PageWrapperProps) {
  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
