import { ResetPasswordComponent } from "@/components/auth/reset-password-component";
import Image from "next/image";

export default function ResetPasswordPage() {
  const backgroundImageUrl = "/assets/auth-background.svg";

  return (
    <main
      className="flex min-h-screen w-full items-center justify-center p-4"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <ResetPasswordComponent />
    </main>
  );
}
