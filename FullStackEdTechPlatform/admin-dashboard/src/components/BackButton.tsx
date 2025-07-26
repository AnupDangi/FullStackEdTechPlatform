"use client";
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/") return null;
  return (
    <div className="fixed top-4 left-4 z-50">
      <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
        <ArrowLeft className="w-5 h-5" />
      </Button>
    </div>
  );
} 