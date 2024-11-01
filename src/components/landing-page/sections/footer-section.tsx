import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  const footerLinks = {
    company: [
      { label: "About", href: "#" },
      { label: "Services", href: "#" },
      { label: "Blog", href: "#" },
    ],
    product: [
      { label: "Features", href: "#" },
      { label: "API", href: "#" },
      { label: "Customers", href: "#" },
    ],
    channels: [
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Search", href: "#" },
    ],
  };

  return (
    <footer className="border-t bg-gray-50">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/logo.jpg"
                alt="DashCore Logo"
                width={48}
                height={48}
                className="h-12 w-12"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              DashCore, a carefully crafted and powerful HTML5 template,
              it&apos;s perfect to showcase your startup or software
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 lg:col-span-3">
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                Company
              </h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                Product
              </h3>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                Channels
              </h3>
              <ul className="space-y-2">
                {footerLinks.channels.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="mb-4 text-sm text-muted-foreground md:mb-0">
            © 2024 5studios.net. All Rights Reserved
          </p>
          <div className="flex space-x-4">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
