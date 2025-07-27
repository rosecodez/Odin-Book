const Connect: React.FC = () => { 
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
                Connect with your friends
            </h1>


            <p className="text-base md:text-lg text-center text-base-content mt-2">
                Share what matters.
            </p>


            <a href="/signup" className="btn btn-primary link mt-8">
                Sign up today
            </a>
        </div>
    )
}
export default Connect;