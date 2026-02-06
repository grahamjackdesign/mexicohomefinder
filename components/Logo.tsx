import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'icon';
  theme?: 'light' | 'dark';
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

function Logo({ 
  variant = 'full', 
  theme = 'light',
  className = '', 
  width,
  height,
  priority = false 
}: LogoProps) {
  // Select the appropriate logo based on variant and theme
  let logoSrc: string;
  
  if (variant === 'icon') {
    // Icon version works on both light and dark backgrounds
    logoSrc = '/Favicon_MHF.svg';
  } else {
    // Full logo has different versions for light vs dark backgrounds
    logoSrc = theme === 'dark' ? '/MHF_logo_on_dark.svg' : '/MHF_logo_final.svg';
  }
  
  const defaultWidth = variant === 'icon' ? 40 : 200;
  const defaultHeight = variant === 'icon' ? 40 : 50;
  
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <Image
        src={logoSrc}
        alt="Mexico Home Finder"
        width={width || defaultWidth}
        height={height || defaultHeight}
        priority={priority}
        className="object-contain"
      />
    </Link>
  );
}

export default Logo;
