import FintrackLogo from '../assets/images/FintrackLogo.png';

const Banner = () => {
    return (
        <div className="bg-primary flex flex-row w-[100%] py-[1%] px-[2%]">
            <img src={FintrackLogo} alt="logo" className="w-[15%]" />
        </div>
    );
}

export default Banner;