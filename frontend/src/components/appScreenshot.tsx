import homeScreenshot from '../assets/homeScreenshot.png';
import React from 'react';
const AppScreenshot: React.FC = () => { 
    return (
        <img src={homeScreenshot} alt="Image Placeholder" className="max-w-full w-[800px] h-auto rounded-lg shadow-lg"/>
    )
}
export default AppScreenshot;