import PropTypes from "prop-types";
export default function TransactionDetailPopup({transaction, setShowDetails}){
   
  //exits out of the current popup by setting the popup boolean to false in transaction.jsx
  const handleExit =() => {
     setShowDetails(false);
     
   }

  return(
      
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-3 rounded-2xl w-96 relative flex flex-col">
              
              <h2 className="text-sub-heading font-bold mx-auto pb-3">Transaction Details</h2>

              <div className= "flex flex-row">
                <h2 className="pl-2 text-body font-bold">Title: </h2>
                <h2 className="pl-2 text-body ">{transaction.title}</h2>
              </div>
              
              <div className= "flex flex-row">
                <h2 className="pl-2 text-body font-bold">Amount:</h2>
                <h2 className="pl-2 text-body">${transaction.amount}</h2>
              </div>
              
              <h2 className="pl-2 pb-2 text-body font-bold">Description</h2>
              

              <textarea className="pl-4 font-size-12 font-medium resize-none"
                disabled = {true}
                rows="5"
                value={transaction.description}
              />

              <button className="mr-0 ml-auto pt-5" onClick= {handleExit}>
                <div id="exitdiv" className="bg-primary-dark hover:bg-primary-darker p-2 rounded-2xl w-20 relative">
                    <h1 className="text-button-small text-white">exit</h1>
                </div>
              </button>

          </div>
        </div>
      
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