"use client"

import { Modal } from "./modal"
import { Button } from "./button"

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    isDestructive?: boolean
}

export function ConfirmationModal({
                                      isOpen,
                                      onClose,
                                      onConfirm,
                                      title,
                                      message,
                                      confirmText = "Confirm",
                                      cancelText = "Cancel",
                                      isDestructive = false,
                                  }: ConfirmationModalProps) {
    const handleConfirm = () => {
        onConfirm()
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                <p className="text-card-foreground">{message}</p>
                <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button variant={isDestructive ? "destructive" : "default"} onClick={handleConfirm}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
