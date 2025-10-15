"use client"

import { motion, Variants } from "framer-motion"

const draw: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
        const delay = i * 0.5
        return {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: {
                    delay,
                    type: "spring",
                    duration: 1.5,
                    bounce: 0,
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 0.5
                },
                opacity: {
                    delay,
                    duration: 0.01,
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 2.5
                },
            },
        }
    },
}

export default function PathDrawing() {
    return (
        <div className="bg-gray-950 rounded-2xl p-8 flex items-center justify-center">
            <motion.svg
                width="400"
                height="400"
                viewBox="0 0 600 600"
                initial="hidden"
                animate="visible"
                className="max-w-[400px]"
            >
                <motion.circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="#ff0088"
                    variants={draw}
                    custom={1}
                    strokeWidth={10}
                    strokeLinecap="round"
                    fill="transparent"
                />
                <motion.line
                    x1="220"
                    y1="30"
                    x2="360"
                    y2="170"
                    stroke="#8df0cc"
                    variants={draw}
                    custom={2}
                    strokeWidth={10}
                    strokeLinecap="round"
                />
                <motion.line
                    x1="220"
                    y1="170"
                    x2="360"
                    y2="30"
                    stroke="#8df0cc"
                    variants={draw}
                    custom={2.5}
                    strokeWidth={10}
                    strokeLinecap="round"
                />
                <motion.rect
                    width="140"
                    height="140"
                    x="410"
                    y="30"
                    rx="20"
                    stroke="#0d63f8"
                    variants={draw}
                    custom={3}
                    strokeWidth={10}
                    strokeLinecap="round"
                    fill="transparent"
                />
                <motion.circle
                    cx="100"
                    cy="300"
                    r="80"
                    stroke="#0d63f8"
                    variants={draw}
                    custom={2}
                    strokeWidth={10}
                    strokeLinecap="round"
                    fill="transparent"
                />
                <motion.line
                    x1="220"
                    y1="230"
                    x2="360"
                    y2="370"
                    stroke="#ff0088"
                    custom={3}
                    variants={draw}
                    strokeWidth={10}
                    strokeLinecap="round"
                />
                <motion.line
                    x1="220"
                    y1="370"
                    x2="360"
                    y2="230"
                    stroke="#ff0088"
                    custom={3.5}
                    variants={draw}
                    strokeWidth={10}
                    strokeLinecap="round"
                />
                <motion.rect
                    width="140"
                    height="140"
                    x="410"
                    y="230"
                    rx="20"
                    stroke="#8df0cc"
                    custom={4}
                    variants={draw}
                    strokeWidth={10}
                    strokeLinecap="round"
                    fill="transparent"
                />
                <motion.circle
                    cx="100"
                    cy="500"
                    r="80"
                    stroke="#8df0cc"
                    variants={draw}
                    custom={3}
                    strokeWidth={10}
                    strokeLinecap="round"
                    fill="transparent"
                />
                <motion.line
                    x1="220"
                    y1="430"
                    x2="360"
                    y2="570"
                    stroke="#0d63f8"
                    variants={draw}
                    custom={4}
                    strokeWidth={10}
                    strokeLinecap="round"
                />
                <motion.line
                    x1="220"
                    y1="570"
                    x2="360"
                    y2="430"
                    stroke="#0d63f8"
                    variants={draw}
                    custom={4.5}
                    strokeWidth={10}
                    strokeLinecap="round"
                />
                <motion.rect
                    width="140"
                    height="140"
                    x="410"
                    y="430"
                    rx="20"
                    stroke="#ff0088"
                    variants={draw}
                    custom={5}
                    strokeWidth={10}
                    strokeLinecap="round"
                    fill="transparent"
                />
            </motion.svg>
        </div>
    )
}
