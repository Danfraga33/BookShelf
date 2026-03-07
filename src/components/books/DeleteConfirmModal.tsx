import { useState } from "react";
import Modal from "~/components/ui/Modal";
import Button from "~/components/ui/Button";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemName: string;
  itemType?: string;
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  itemName,
  itemType = "book",
}: DeleteConfirmModalProps) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Delete ${itemType}`}>
      <p className="text-text-secondary mb-6">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-text-primary">"{itemName}"</span>?
        This cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Modal>
  );
}
