import PropTypes from "prop-types";
import { useState, useContext} from "react";
import axios from "axios";
import TransactionContext from "../../context/TransactionContext";

export default function TransactionDetailPopup({ transaction, setShowDetails }) {
  const [isEdit, setIsEdit] = useState(false);
  const [isSavable, setSavable] = useState(false);
  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(transaction.amount);
  const [description, setDescription] = useState(transaction.description);
  const { requestUiUpdate } = useContext(TransactionContext);
  
  //handles garbage removal from the amount input
  const handleAmountInput = (e) => {
    //removes and save all non number chars in newGoal
    let value = e.target.value.replace(/[^0-9.-]/g, "");

    //removes all '-' apart from the one at the start 
    value = value.replace(/(?!^)-/g, '');

    //removes all dots after the first one that has been inputted
    let valueSplit = value.split(".");
    if (valueSplit.length > 1) {
      value = valueSplit[0] + "."
      for (let i = 1; i < valueSplit.length; i++) {
        value += valueSplit[i]
      }
    }

    //if the value of amount has changed then update it and enable the save button
    if (value !== amount) {
      setAmount(value);
      enableSaving();
    }
  };

  //updates the variable that decides if the transaction can be saved
  const enableSaving = () => {
    if (isEdit === true && isSavable === false) {
      setSavable(true);
    }
  };

  //exits out of the current popup by setting the popup boolean to false in transaction.jsx
  const handleExit = () => {
    setShowDetails(false);
  }

  //switches enviroment to the 'edit' state, allows input feilds to be updated and switches the buttons on screen
  const handleEdit = () => {
    setIsEdit(true);
  }

  const handleSave = async () => {
    //after editting is completed make it so that the user can no longer edit the transaction details
    setIsEdit(false);

    //gets users authentication token
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User is not authenticated.");
      return;
    }

    //creates the inital request format for backend queries
    const axiosInstance = axios.create({
      baseURL: "http://localhost:4000",
      headers: { Authorization: `Bearer ${token}` },
    });

    try {
      //Posts request to edit the current transaction with updated feilds
      const response = await axiosInstance.put(`/transaction/${transaction.id}`, {
        title,
        amount,
        description,
      });

      //checks the status of the responce and logs it based on the return
      if (response.status === 401) {
        console.error(response.data);
      } else if (response.status === 500) {
        console.error(response.data);
      } else {
        console.log("Transaction" + transaction.id + " editted successfully.", response.data);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      //updates the UI then exits the details popup
      requestUiUpdate();
      setShowDetails(false);
    }
  }



  const handleCancel = () => {
    //resets details 
    setTitle(transaction.title);
    setAmount(transaction.amount);
    setDescription(transaction.description);

    //gets out of editable state
    setSavable(false);
    setIsEdit(false);
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white p-3 rounded-2xl w-96 relative flex flex-col">

          <h2 className="text-sub-heading font-bold mx-auto pb-3">Transaction Details</h2>

          <h2 id="Title Title" className="pl-2 text-body font-normal">Title </h2>

          <input id="TitleText"
            className="ml-2 pl-1 text-normal text-base border-2 border-slate-400 rounded"
            value={title}
            disabled={!isEdit}
            onInput={(e) => {
              setTitle(e.target.value)
              enableSaving()
            }} />

          <h2 id='amount Title' className="pl-2 text-body font-normal">Amount</h2>

          <input id='amountText'
            className="ml-2 pl-1 text-normal text-base border-2 border-slate-400 rounded"
            value={amount}
            disabled={!isEdit}
            onInput={(e) => {
              handleAmountInput(e)
              enableSaving()
            }
            }
          />

          <h2 id='Discription Title' className="pl-2 pb-2 text-body font-normal border-black">Description</h2>

          <textarea id='descriptionText'
            className="ml-2 pl-1 font-size-base text-normal resize-none border-2 border-slate-400 rounded"
            disabled={!isEdit}
            rows="5"
            value={description}
            onInput={(e) => {
              setDescription(e.target.value)
              enableSaving()
            }}
          />

          <div className="flex justify-right">
            {
              //display different buttons depending on if the transaction is currently editable. 
              //edit and exit buttons are displayed if the current transaction isn't editable
              //save and cancel are displayed if buttons if the current transaction is editable
              isEdit ? (
                <>
                  {
                    //if the transaction hasn't been edited created a dummy button otherwise use the functional one
                    isSavable ? (
                      <button id="saveButton" className="mr-0 ml-auto pt-5 pr-2" onClick={handleSave} >
                        <div className="bg-primary-green-dark hover:bg-primary-green-darker p-2 rounded-2xl w-20 relative">
                          <h1 className="text-button-small text-white">save</h1>
                        </div>
                      </button>
                    ) : (
                      <button id="saveButton" className="mr-0 ml-auto pt-5 pr-2">
                        <div className="bg-slate-300 p-2 rounded-2xl w-20 relative">
                          <h1 className="text-button-small text-slate-400">save</h1>
                        </div>
                      </button>)
                  }

                  <button id="cancelButton" className="mr-0 pt-5" onClick={handleCancel}>
                    <div className="bg-primary-red hover:bg-primary-red-darker p-2 rounded-2xl w-20 relative">
                      <h1 className="text-button-small text-white">cancel</h1>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button id="editButton" className="mr-0 ml-auto pt-5 pr-2" onClick={handleEdit}>
                    <div className="bg-primary-dark hover:bg-primary-darker p-2 rounded-2xl w-20 relative">
                      <h1 className="text-button-small text-white">edit</h1>
                    </div>
                  </button>

                  <button id="exitButton" className="mr-0 pt-5" onClick={handleExit}>
                    <div className="bg-primary-red hover:bg-primary-red-darker p-2 rounded-2xl w-20 relative">
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
  //checks that parrams are in valid format
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