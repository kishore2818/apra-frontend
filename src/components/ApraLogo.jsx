'use client';

export default function ApraLogo({ className = "w-10 h-10", variant = "default" }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-full shadow-xs ${className}`}>
      <img
        src="/images/logo.jpg"
        alt="APRA Logo"
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
}
