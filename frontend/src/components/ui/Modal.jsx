import { AnimatePresence, motion } from "framer-motion";

export default function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/45"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 14, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 14, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute left-1/2 top-1/2 w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-line bg-surface shadow-soft"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-serif text-xl">
                {title}
              </h2>
              <button
                type="button"
                className="rounded-xl border border-line px-3 py-2 text-sm hover:bg-surface-2 transition-colors"
                onClick={onClose}
              >
                Close
              </button>
            </div>
            <div className="max-h-[72vh] overflow-auto px-5 py-5">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

