import { useLayoutEffect } from "react";
import { animateOnScroll } from "../animations/scrollAnimation";

export default function About() {
    useLayoutEffect(() => {
        animateOnScroll();
    }, []);
    
    return (
        <div className="about">
            <div className="animate-on-scroll">
                <div className="flex flex-col md:flex-row justify-center items-center gap-[50px] px-4 py-10">
                    <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left max-w-xl">
                        <h1 className="text-[36px] md:text-[50px] font-bold pb-[30px]">
                            Built with love by a self-taught developer
                        </h1>
                        <p> Odin Book is a personal project made with care and curiosity. Whether you're here to post a photo from your walk,
                        catch up on what your friends are doing, or just scroll and relax, this is your space to do it at your own pace. </p>
                    </div>

                    <img
                        src="https://images.unsplash.com/photo-1550789813-472d2a9cd237?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Photo by Ken Oyama on Unsplash"
                        className="w-[250px] md:w-[350px] lg:w-[400px] rounded-xl shadow-md" />
                </div>    
            </div>
            
            <div className="animate-on-scroll">
                <div className="animate-on-scroll flex flex-col md:flex-row justify-center items-center gap-[50px] px-4 py-10">
                    <img src="https://images.unsplash.com/photo-1724217981585-f28f2375f3ab?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="w-[250px] md:w-[350px] lg:w-[400px] rounded-xl shadow-md"/>

                    <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left max-w-xl">
                        <h1 className="text-[36px] md:text-[50px] font-bold pb-[30px]">
                            Share your favorite photos
                        </h1>
                        <p> Discover fresh moments, meet new people, and explore different perspectives, all in one simple, cozy space. </p>
                    </div>
                </div>
            </div>
            

            <div className="animate-on-scroll">
                <div className="animate-on-scroll flex flex-col md:flex-row justify-center items-center gap-[50px] px-4 py-10">
                    <h1 className="text-[36px] md:text-[50px] font-bold pb-[30px]">
                        Follow friends and creators
                    </h1>
                    <img src="https://images.unsplash.com/photo-1568615944078-821ced977caa?q=80&w=739&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="w-[250px] md:w-[350px] lg:w-[400px] rounded-xl shadow-md"/>
                    
                </div>
            </div>
            
            
            <div className="animate-on-scroll">
                <div className="animate-on-scroll flex flex-col md:flex-row justify-center items-center gap-[50px] px-4 py-10">
                    <img src="https://images.unsplash.com/photo-1506223213794-a78f522c26f3?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        className="w-[250px] md:w-[350px] lg:w-[400px] rounded-xl shadow-md"
                    />
                    <h1 className="text-[50px]">
                        Find something new</h1>
                </div>
            </div>
            
        </div>
    );
}
