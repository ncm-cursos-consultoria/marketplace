"use client";

import React from 'react';
// 1. Importar do 'nextjs-progressbar' (o pacote correto)
import NextNProgressBar from 'nextjs-progressbar'; 

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      {/* 2. Usar o nome 'NextNProgressBar' (com 'B' maiúsculo) */}
      <NextNProgressBar
        color="#2563eb"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
    </>
  );
};

export default ProgressBarProvider;