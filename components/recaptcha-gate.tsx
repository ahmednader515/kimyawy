"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
}) as React.ComponentType<{
  sitekey: string;
  onChange: (token: string | null) => void;
  ref?: React.Ref<any>;
  theme?: "light" | "dark";
}>;

interface RecaptchaGateProps {
  children: React.ReactNode;
  storageKey?: string;
}

export function RecaptchaGate({ children, storageKey = "recaptcha_verified" }: RecaptchaGateProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<any>(null);

  useEffect(() => {
    // Check if user is already verified (stored in sessionStorage for security)
    const verified = sessionStorage.getItem(storageKey);
    if (verified === "true") {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }, [storageKey]);

  const handleRecaptchaChange = async (token: string | null) => {
    if (!token) {
      setRecaptchaToken(null);
      return;
    }

    setRecaptchaToken(token);
    setIsVerifying(true);

    try {
      // Verify token with server
      const response = await fetch("/api/auth/verify-recaptcha-gate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        // Store verification in sessionStorage (clears when browser closes)
        sessionStorage.setItem(storageKey, "true");
        setIsVerified(true);
      } else {
        // Reset reCaptcha on failure
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
        alert("فشل التحقق من reCaptcha. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error("Error verifying reCaptcha:", error);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
      alert("حدث خطأ أثناء التحقق. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Show loading state while checking verification
  if (isVerified === null) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-[9999]">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  // Show reCaptcha gate if not verified
  if (!isVerified) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-[9999]">
        <div className="bg-card border rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-brand" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">التحقق من الأمان</h2>
              <p className="text-muted-foreground">
                يرجى إكمال التحقق من reCaptcha للوصول إلى الموقع
              </p>
            </div>

            <div className="flex justify-center">
              {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  onChange={handleRecaptchaChange}
                  theme="light"
                />
              ) : (
                <div className="text-sm text-red-500 p-4 border border-red-300 rounded">
                  reCaptcha site key not configured. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your environment variables.
                </div>
              )}
            </div>

            {isVerifying && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">جاري التحقق...</span>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              هذا التحقق يساعدنا في حماية الموقع من الروبوتات والوصول غير المصرح به
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render children if verified
  return <>{children}</>;
}

