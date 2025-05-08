import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import { Endpoints } from "@/apis/endpoints";

export default function Footer() {
  return (
    <footer className="mt-40 bg-gradient-to-b from-[#1D0D25] to-[#4c2463] py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center">
              <Image
                src="/assets/logo.png"
                alt="Buddy Logo"
                width={72}
                height={72}
                className="mr-2"
              />
              <h3 className="text-2xl font-bold">Buddy</h3>
            </div>
            <p className="text-gray-300">
              Your trusted platform for connecting with skilled service
              providers. We ensure quality, reliability, and convenience for all
              your service needs.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  Browse Services
                </Link>
              </li>
              <li>
                <Link
                  href="/bookings"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/help-center"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Contact Us</h3>
            <p className="text-sm text-gray-300">Email:</p>
            <a
              href="mailto:ThemaarConsultancy@buddy.com"
              className="text-sm text-gray-300 hover:text-white"
            >
              ThemaarConsultancy@buddy.com
            </a>
            <p className="mt-2 text-sm text-gray-300">Phone:</p>
            <a
              href="tel:+96897528919"
              className="text-sm text-gray-300 hover:text-white"
            >
              +96897528919
            </a>
          </div>
          <div className="space-y-4">
            <h3 className="mb-4 text-lg font-bold">Policies</h3>
            <Link
              href={Endpoints.PRIVACY_POLICY}
              className="text-sm text-gray-300 hover:text-white"
            >
              <p className="text-sm text-gray-300">Privacy Policy</p>
            </Link>
            <Link
              href={Endpoints.REFUND_POLICY}
              className="text-sm text-gray-300 hover:text-white"
            >
              <p className="text-sm text-gray-300">Refund Policy</p>
            </Link>
          </div>
          {/* <div>
            <h3 className="mb-4 text-lg font-bold">Connect With Us</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-300">
                Follow us on social media for updates, tips, and service
                provider highlights.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="https://facebook.com/buddyservices"
                  target="_blank"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  <Facebook className="h-6 w-6" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="https://twitter.com/buddyservices"
                  target="_blank"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link
                  href="https://instagram.com/buddyservices"
                  target="_blank"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  <Instagram className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </div>
            </div>
          </div> */}
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} Themaar Consultancy All Right
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
