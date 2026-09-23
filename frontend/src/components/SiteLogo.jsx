import React, { useState } from 'react';

export default function SiteLogo() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="logo-fallback" aria-label="Namma Voice">
        NV
      </span>
    );
  }

  return (
    <img
      src="/logo.png"
      alt="Namma Voice logo"
      className="site-logo"
      onError={() => setFailed(true)}
    />
  );
}
