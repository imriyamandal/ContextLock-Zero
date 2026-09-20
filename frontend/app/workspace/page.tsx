"use client";

import React from "react";
import { UnifiedWorkspace } from "@/components/UnifiedWorkspace";
import { VetraAppShell } from "@/components/VetraAppShell";

export default function WorkspacePage() {
  return (
    <VetraAppShell pageTitle="Command Center" pageDescription="Unified 3-panel decision intelligence workspace">
      <UnifiedWorkspace />
    </VetraAppShell>
  );
}
