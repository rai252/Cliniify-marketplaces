// Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 py-3">
        <p className="text-center text-gray-500">
          &copy; {new Date().getFullYear()} Cliniify Marketplace. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;