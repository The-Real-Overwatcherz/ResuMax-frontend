"use client";

import { useState, useEffect, type FC } from "react";
import { motion, LayoutGroup } from "framer-motion";

/* ---------- Types ---------- */
interface TabItem {
    id: string;
    label: string;
}

interface ContinuousTabsProps {
    tabs?: TabItem[];
    defaultActiveId?: string;
    activeId?: string;
    onChange?: (id: string) => void;
}

/* ---------- Defaults ---------- */
const DEFAULT_TABS: TabItem[] = [
    { id: "home", label: "Home" },
    { id: "interactions", label: "Interactions" },
    { id: "resources", label: "Resources" },
    { id: "docs", label: "Docs" },
];

export const ContinuousTabs: FC<ContinuousTabsProps> = ({
    tabs = DEFAULT_TABS,
    defaultActiveId = "home",
    activeId,
    onChange,
}) => {
    const [active, setActive] = useState<string>(activeId || defaultActiveId);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (activeId !== undefined) {
            setActive(activeId);
        }
    }, [activeId]);

    const handleChange = (id: string) => {
        setActive(id);
        onChange?.(id);
    };

    if (!isMounted) return null;

    return (
        <LayoutGroup>
            <nav
            className="relative flex items-center gap-1 sm:gap-2 p-1"
            >
                {tabs.map((tab) => {
                    const isActive = active === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleChange(tab.id)}
                            className="relative px-4 py-2 sm:px-6 sm:py-3 rounded-full outline-none"
                        >
                            {/* Active pill */}
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    transition={{
                                        type: "spring",
                                        stiffness: 380,
                                        damping: 30,
                                        mass: 0.9,
                                    }}
                                    className="
                      absolute inset-0 rounded-full
                      bg-white
                      shadow-[0_0_15px_rgba(255,255,255,0.2)]
                    "
                                />
                            )}

                                <motion.span
                                    layout="position"
                                    className={`relative z-10 text-[13px] sm:text-sm font-bold tracking-wide uppercase transition-colors duration-200
                        ${isActive
                                            ? "text-black"
                                            : "text-[#888] hover:text-white"
                                        }
                      `}
                            >
                                {tab.label}
                            </motion.span>
                        </button>
                    );
                })}
            </nav>
        </LayoutGroup>
    );
};