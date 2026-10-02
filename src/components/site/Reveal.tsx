import { motion, type HTMLMotionProps } from "framer-motion";

export function Reveal({ delay = 0, y = 30, ...props }: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    />
  );
}

export function Pending({ label = "Awaiting confirmation" }: { label?: string }) {
  return <span className="pending-tag">{label}</span>;
}
