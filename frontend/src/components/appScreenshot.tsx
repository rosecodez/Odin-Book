import homeScreenshot from '../assets/homeScreenshot.png';
import React from 'react';
const AppScreenshot: React.FC = () => { 
    return (
        <img src={homeScreenshot} alt="Image Placeholder" className="w-[800px] h-[600px] bg-base-200 rounded-lg flex items-center justify-center text-base-content text-xl font-semibold"/>
    )
}
export default AppScreenshot;