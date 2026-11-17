"use client";

import { useEffect, useId, useRef } from "react";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./contact-success-dialog.module.scss";

interface ContactSuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ContactSuccessDialog({
  open,
  onClose,
}: ContactSuccessDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={onClose}
    >
      <CircleCheck className={styles.icon} size={64} aria-hidden="true" />
      <h2 id={titleId}>Congratulations!</h2>
      <p id={descriptionId}>
        Your thought has been sent, Eko Samuel will reach out to you
      </p>
      <Button type="button" onClick={() => dialogRef.current?.close()}>
        Done
      </Button>
    </dialog>
  );
}
