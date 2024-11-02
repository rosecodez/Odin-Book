import React, { useState } from "react";
import { useEffect } from "react";

export default function Header() {
    return(
    <header className="flex flex-row items-center justify-between pb-[40px] text-xl">
        <div id="header-left-panel" className="flex gap-6 font-medium flex-wrap">
            <a href="/">
                <p>Odin book</p>
            </a>
        </div>

        <div id="header-left-panel" className="flex gap-6 font-medium flex-wrap">
            <a href="/profile" className="text-black  decoration-2 decoration-sky-500 underline-offset-8">
                <p>Profile</p>
            </a>
        </div>

    </header>
    )    
}