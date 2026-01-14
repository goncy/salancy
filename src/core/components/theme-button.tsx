"use client";

import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";

function ThemeButton() {
    function modeChange() {
        const isDark = document.documentElement.getAttribute('data-theme') == 'dark'

        if (!isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            return;
        }

        document.documentElement.removeAttribute('data-theme')
    }

    return (
        <Button
            aria-label="Abrir preguntas frecuentes"
            className="relative"
            size="icon"
            variant="outline"
            onClick={modeChange}
        >
            <Moon />
        </Button>
    );
}

export { ThemeButton }