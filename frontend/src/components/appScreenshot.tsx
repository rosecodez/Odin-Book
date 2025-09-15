import homeScreenshot from '../assets/homeScreenshot.png';
import React from 'react';
const AppScreenshot: React.FC = () => { 
    return (
        <img src={homeScreenshot} alt="Image Placeholder" className="w-full max-w-[600px] h-auto rounded-lg shadow-lg"/>
    )
}
export default AppScreenshot;