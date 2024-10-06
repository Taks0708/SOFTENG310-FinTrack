import { FaSortDown } from "react-icons/fa";
import { useState, useContext } from "react";
import TransactionContext from "../../context/TransactionContext";
import '../../assets/css/defaultButton.css';
import '../../assets/css/variables.css';

/*
 * When adding new currencies to the dropdown:
 * Remember to edit the border radius of the last item in the dropdown to match
 * Do this by adding "hover:rounded-bl-3xl hover:rounded-br-3xl" in the label class
*/

const CurrencyDropdown = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState('NZD');
    const { setCurrency } = useContext(TransactionContext);

    const handleOpen = () => {
        setIsOpen(!isOpen);
    }

    // grabs the id of the selected currency from the selection and sets it as the selected currency
    const handleSelect = (event) => {
        const { id } = event.target;
        setSelectedCurrency(id);
        setIsOpen(false);
        setCurrency(id);
    };

    return (
        <div className="mt-10 text-black">
            <button class="defaultButton" onClick={handleOpen}>
                <div className="flex flex-row gap-2 justify-center">
                    {selectedCurrency}
                    {isOpen ? <FaSortDown /> : <FaSortDown className='origin-[90%][50%] -rotate-90 translate-y-[2px] -translate-x-[2px]' />}
                </div>
            </button>
            {isOpen && (
                <div className='bg-white flex flex-col min-w-[280px] text-button-small text-white border-primary border-[2px] rounded-bl-3xl rounded-br-3xl' >
                    <form>
                        <div>
                            <input type="radio" id="NZD" className='peer hidden' onClick={handleSelect} />
                            <label htmlFor="NZD" className='w-[100%] select-none cursor-pointer text-center inline-block text-primary py-2 bg-transparent hover:bg-slate-200'>
                                NZD
                            </label>
                        </div>
                        <div>
                            <input type="radio" id="USD" className='peer hidden' onClick={handleSelect} />
                            <label htmlFor="USD" className='w-[100%] select-none cursor-pointer text-center inline-block text-primary py-2 bg-transparent hover:bg-slate-200'>
                                USD
                            </label>
                        </div>
                        <div>
                            <input type="radio" id="AUD" className='peer hidden' onClick={handleSelect} />
                            <label htmlFor="AUD" className='w-[100%] select-none cursor-pointer text-center inline-block text-primary py-2 bg-transparent hover:bg-slate-200'>
                                AUD
                            </label>
                        </div>
                        <div>
                            <input type="radio" id="GBP" className='peer hidden' onClick={handleSelect} />
                            <label htmlFor="GBP" className='w-[100%] select-none cursor-pointer text-center inline-block text-primary py-2 bg-transparent hover:bg-slate-200 hover:rounded-bl-3xl hover:rounded-br-3xl'>
                                GBP
                            </label>
                        </div>
                        <div>
                            <input type="radio" id="HKD" className='peer hidden' onClick={handleSelect} />
                            <label htmlFor="HKD" className='w-[100%] select-none cursor-pointer text-center inline-block text-primary py-2 bg-transparent hover:bg-slate-200 hover:rounded-bl-3xl hover:rounded-br-3xl'>
                                HKD
                            </label>
                        </div>
                    </form>
                </div>

            )}
        </div>
    );
}

export default CurrencyDropdown;