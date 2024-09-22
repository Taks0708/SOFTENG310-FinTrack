import FintrackLogo from '../assets/images/FintrackLogo.png';

const Banner = () => {
    const handleSignOut = () => {
        // Removes the token from localStorage
        localStorage.removeItem("token");
        
        // Redirect to the login page
        window.location.href = "/login";
    };
    
    return (
        <div className="bg-primary flex flex-row w-[100%] py-[1%] px-[2%]">
            <img src={FintrackLogo} alt="logo" className="w-[15%]" />

            <button
                className="absolute top-50 right-10 bg-primary-red text-white text-button px-3 py-3 min-w-[200px] rounded-full hover:bg-primary-red-dark active:bg-primary-red-darker"
                // User signed out upon clicking button
                onClick={handleSignOut}
            >
                Sign Out
            </button>
        </div>
    );
}

export default Banner;