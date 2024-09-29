import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";

export default function TransactionDetailPopup({transaction, setShowDetails}){
  const [isEdit,setIsEdit]  = useState(false);
  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(transaction.amount);
  const [description, setDescription] = useState(transaction.description);
  
  //handles creating correct amount input
  const handleAmountInput = (e) => {
    //removes and save all non number chars in newGoal
    let value = e.target.value.replace(/[^0-9.-]/g, "");

    //removes all '-' apart from the one at the start 
    value = value.replace(/(?!^)-/g, '');
    
    //removes all dots after the first one
    let valueSplit = value.split(".");
    if(valueSplit.length > 1){
      value = valueSplit[0] +"."
      for(let i= 1; i<valueSplit.length; i++){
        value += valueSplit[i]
      }
    }

    setAmount(value);
  };

  //exits out of the current popup by setting the popup boolean to false in transaction.jsx
  const handleExit =() => {
     setShowDetails(false);
   }

  const handleEdit = () => {
    setIsEdit(true);
  }

  const handleSave = async() => {
    //after editting is completed make it so that the user can no longer edit the transaction details
    setIsEdit(false);

    //send new details to the back-end.
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User is not authenticated.");
      return;
    }

    const axiosInstance = axios.create({
      baseURL: "http://localhost:4000",
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("amount: ", amount);

    try {
      //Post request to create the transaction
      const response = await axiosInstance.put(`/transaction/${transaction.id}`, {
        title,
        amount,
        description,
      });
      console.log("Transaction" +transaction.id+" editted successfully.", response.data);
      // Update the balance after the transaction is created
    } catch(error) {
      console.error("Error occurred:", error);
    } finally {
      console.log("Im at finally");
      setShowDetails(false);
    }
    
    

    //after save has been completed update transaction list, and if it is no longer an expense change it to green

    //setShowDetails(false);
  }



  const handleCancel = () => {
    //resets details 
    setTitle(transaction.title);
    setAmount(transaction.amount);
    setDescription(transaction.description);  

    //gets out of editable state
    setIsEdit(false);

  }

  return(
    <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-3 rounded-2xl w-96 relative flex flex-col">
              
              <h2 className="text-sub-heading font-bold mx-auto pb-3">Transaction Details</h2>

              <div className= "flex flex-row">
                <h2 className="pl-2 text-body font-bold">Title: </h2>
                <input id = "TitleText" 
                className="pl-2 text-body" 
                value={title} 
                disabled = {!isEdit}
                onInput={(e) => setTitle(e.target.value)}/>
              </div>
              
              <div className= "flex flex-row">
                <h2 className="pl-2 text-body font-bold">Amount:</h2>
                <input id = 'amountText'  
                className="pl-2 text-body"
                value={amount}
                disabled = {!isEdit}
                onInput={(e) => handleAmountInput(e)}/>
              </div>
              
              <h2 className="pl-2 pb-2 text-body font-bold">Description</h2>
              

              <textarea id = 'descriptionText' 
                className="pl-4 font-size-12 font-medium resize-none"
                disabled = {!isEdit}
                rows="5"
                value={description}
                onInput={(e) => setDescription(e.target.value)}
              />

              <div className="">
              {
                isEdit ?  (
                  <>
                  <button id="editButton" className="mr-0 ml-auto pt-5 pr-2" onClick= {handleSave}>
                    <div className="bg-primary-dark hover:bg-primary-darker p-2 rounded-2xl w-20 relative">
                        <h1 className="text-button-small text-white">save</h1>
                    </div>
                  </button>

                  <button id="exitButton" className="mr-0 ml-auto pt-5" onClick= {handleCancel}>
                    <div  className="bg-primary-dark hover:bg-primary-darker p-2 rounded-2xl w-20 relative">
                        <h1 className="text-button-small text-white">cancel</h1>
                    </div>
                  </button>
                  </>
                ):(
                  <>
                    <button id="editButton" className="mr-0 ml-auto pt-5 pr-2" onClick= {handleEdit}>
                      <div className="bg-primary-dark hover:bg-primary-darker p-2 rounded-2xl w-20 relative">
                          <h1 className="text-button-small text-white">edit</h1>
                      </div>
                    </button>

                    <button id="exitButton" className="mr-0 ml-auto pt-5" onClick= {handleExit}>
                      <div  className="bg-primary-dark hover:bg-primary-darker p-2 rounded-2xl w-20 relative">
                          <h1 className="text-button-small text-white">exit</h1>
                      </div>
                    </button>
                  </>
                )

              }

              </div>

          </div>
        </div>
        </>
      
  )
}

TransactionDetailPopup.propTypes = {
  transaction: PropTypes.shape({
        amount: PropTypes.string,
        created_at: PropTypes.string,
        description: PropTypes.string,
        id: PropTypes.number,
        title: PropTypes.string,
        user_id: PropTypes.number
  }),
  setShowDetails: PropTypes.func
};