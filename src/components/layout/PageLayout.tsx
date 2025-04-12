import { ReactNode } from 'react';

type PageLayoutProps = {
  children: ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#1a1a1b]">
      {children}
    </div>
  );
}
