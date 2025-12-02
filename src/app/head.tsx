// src/app/head.tsx
export default function Head() {
  return (
    <>
      <title>Kumar Shivraj Bhakat | AI/ML Engineer</title>
      <meta name="description" content="Portfolio of Kumar Shivraj Bhakat — AI/ML Engineer, Artist, Rapper, Sports Enthusiast." />

      {/* Primary favicon (PNG in /public/profile.png) */}
      <link rel="icon" type="image/png" sizes="any" href="/profile.png" />

      {/* Optional: explicit sizes (if you provide different sizes) */}
      {/* <link rel="icon" type="image/png" sizes="32x32" href="/profile-32.png" /> */}

      {/* Apple touch icon for iOS */}
      <link rel="apple-touch-icon" href="/profile.png" />

      {/* Fallback (keep or remove depending on whether you have /public/favicon.ico) */}
      <link rel="shortcut icon" href="/favicon.ico" />
    </>
  );
}
