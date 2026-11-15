"use client";

import { useCallback, useRef } from "react";

export function useDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openDialog = useCallback(() => dialogRef.current?.showModal(), []);
  const closeDialog = useCallback(() => dialogRef.current?.close(), []);

  return { dialogRef, openDialog, closeDialog };
}
