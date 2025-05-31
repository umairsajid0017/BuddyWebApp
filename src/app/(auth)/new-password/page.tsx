import { NewPasswordComponent } from "@/components/auth/new-password-component";
import backgroundSvg from '@/components/ui/assets/background-pattern.svg';

export default function NewPasswordPage() {
  const backgroundImageUrl = backgroundSvg;

  return (
    <main
      className="flex min-h-screen w-full items-center justify-center p-4"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <NewPasswordComponent />
    </main>
  );
} 