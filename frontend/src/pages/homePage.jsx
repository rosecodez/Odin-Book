import React from "react";
import { useState, useEffect } from "react";
import Header from "../components/header";
import PageContent from "../components/pageContent";
import Footer from "../components/footer";
export default function Home() {
    return(
        <div>
            <Header />
            <PageContent />
            <Footer />
        </div>
    )
}