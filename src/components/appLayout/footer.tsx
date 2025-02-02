export function Footer() {
  return (
    <footer className="border-t py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} Darpo.in. All rights reserved.
        </div>
        <div className="flex gap-4">
          <a
            href="/about"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            About
          </a>
          <a
            href="/contact"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}