import { useEffect, useRef } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Força o browser a reconhecer o estado inicial antes de animar
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
