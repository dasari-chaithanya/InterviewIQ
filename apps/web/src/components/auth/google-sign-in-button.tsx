"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { useGoogleLoginMutation } from "@/hooks/auth/use-auth-mutations";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (element: HTMLElement, options: Record<string, string>) => void;
        };
      };
    };
  }
}

export function GoogleSignInButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mutate: loginWithGoogle } = useGoogleLoginMutation();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const renderButton = () => {
    if (!clientId || !window.google || !containerRef.current) return;
    containerRef.current.replaceChildren();
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: ({ credential }) => loginWithGoogle(credential),
    });
    window.google.accounts.id.renderButton(containerRef.current, {
      theme: "outline",
      size: "large",
      width: "360",
    });
  };

  useEffect(() => {
    renderButton();
  }, [clientId]);

  if (!clientId) return null;

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={renderButton} />
      <div ref={containerRef} className="flex justify-center w-full min-h-[44px]" />
    </>
  );
}