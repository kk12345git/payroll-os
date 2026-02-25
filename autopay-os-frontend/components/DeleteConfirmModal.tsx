'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    itemName: string;
}

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    itemName,
}: DeleteConfirmModalProps) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-white/20 backdrop-blur-xl rounded-xl">
                                            <AlertTriangle className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-2xl font-bold">{title}</h2>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-all"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-slate-600 mb-4">{message}</p>
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <p className="font-semibold text-slate-800">{itemName}</p>
                                </div>
                                <p className="text-sm text-slate-500 mt-4">
                                    This action cannot be undone.
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 px-6 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="flex-1 py-3 px-6 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
