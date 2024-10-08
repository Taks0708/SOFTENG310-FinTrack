import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// This component is a reusable form that can be used for both the login and signup pages. This was done to reduce code duplication.
export default function AuthForm({endpoint, title, buttonText, redirectTitleText, redirectLink, redirectText,verifyDetails}) {
    const labelStyle = "text-2xl";
    const inputStyle = "border-2 w-64 h-8 p-2 rounded-lg mb-4 mt-2 border-primary focus:border-primary-highlight focus:outline-none";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [emailError, setEmailError] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();

        //verify the details before signing up if requested
        if(verifyDetails && !isVerified()){
            console.log("Error with sign up details")
        }else{
            
            axios.post(endpoint, {
                email: email,
                password: password
            }).then(response => {
                if (response.data.success) {
                    // Store the returned auth token in local storage so that it can be easily accessed throughout the frontend
                    localStorage.setItem("token", response.data.token);
                    window.location.href = "/dashboard";
                } else {
                    alert("Invalid email or password!");
                }
            }).catch(error => {
                console.log(error);
            });
        }

    }

    function isVerified(){
        let emailValid = true;
        let passValid = true;

        //checks email is valid format
        try{
            //seperates the email address into the name and domain parts
            let emailComponents  =  email.trim().split("@");
            
            if(emailComponents.length == 2){
               
                let emailAddressName = emailComponents[0];
                //splits the domain by the final . e.g. auckland.gov.uk => auckland.gov, uk
                let emailDomainAtributes =  emailComponents[1].split(/\.(.*)/)

                //checks that the email name does not have unallowed chars and does not end on a ., -, _ charater
                if(emailAddressName.match(/[^a-zA-Z0-9\-\._]/g)|| emailAddressName.match(/[_\.-]$/)){
                    setEmailError(true);
                    emailValid = false;
                }

                //checks the domain part of the email has only the allow chars
                if(emailComponents[1].match("/[^a-zA-Z0-9-\.]/g")){
                    setEmailError(true);
                    emailValid= false;
                }

                //checks that the domain has atleast 1 dot
                if(emailDomainAtributes.length<2){
                    setEmailError(true);
                    emailValid= false;
                }

                //checks that first part of the domain is not empty
                if(emailDomainAtributes[0].length <1){
                    setEmailError(true);
                    emailValid= false;
                }

                //checks that the domain has atleast too chars after the last .
                let emailAddressDomainNameIdentifier = emailDomainAtributes[1].split(/\.(?=[^\.]*$)/)
                    
                if(emailAddressDomainNameIdentifier.length > 1){   
                    if(emailAddressDomainNameIdentifier[1].length < 2){
                        setEmailError(true);
                        emailValid= false;
                    }
                }else{
                    if(emailAddressDomainNameIdentifier[0].length < 2){
                        setEmailError(true);
                        emailValid= false;
                    }
                }


            }else{
                setEmailError(true);
                emailValid= false;
            }

        }catch(error){
            emailValid = false;
            setEmailError(true);
        }
       

        //checks password is strong enough
        if(password.length<5){
            setPasswordError(true);
            passValid= false;
        }

        if(emailValid){
            setEmailError(false);
        }

        if(passValid){
            setPasswordError(false);
        }
        if(!emailValid || !passValid){
            return false;
        }
            
        return true;
    }

    


    return (
        <form className="flex flex-col border-2 items-center w-80 p-4 rounded-xl" style={{backgroundColor: "var(--color2)"}}>
            <h2 className="text-4xl font-bold text-center mb-4">{title}</h2>
            <div className="flex flex-col">
                <label className={labelStyle} htmlFor="email">Email</label>
                {verifyDetails? (emailError ?  <h2 className = {`text-body-tiny text-primary-red pl-1`}>Email invalid</h2>:null): null}
                <input style={{backgroundColor: "var(--color2)", boxShadow: "var(--noAffordanceShadow)"}} className={inputStyle} required type="email" onChange={(e) => {setEmail(e.target.value)}} value={email} />
            </div>
            <div className="flex flex-col">
                <label className={labelStyle} htmlFor="password">Password</label>
                {verifyDetails? <h2 className = {`text-body-tiny ${passwordError ?  "text-primary-red":"text-slate-400"} pl-1`}>Must contain atleast 5 characters  </h2>: null}
                <input style={{backgroundColor: "var(--color2)", boxShadow: "var(--noAffordanceShadow)"}} className={inputStyle} required type="password" onChange={(e) => {setPassword(e.target.value)}} value={password} />
            </div>
            <button className="w-60 bg-primary text-white text-button p-2 rounded-lg mt-4 hover:bg-primary-dark" onClick={(e) => handleSubmit(e)}>{buttonText}</button>
            <p className="text-xl mt-4">{redirectTitleText}</p>
            <Link to={redirectLink} className="text-primary-highlight text-xl hover:text-primary ">{redirectText}</Link>
        </form>
    );
}

AuthForm.propTypes = {
    verifyDetails: Boolean,
    endpoint: String,
    title: String,
    buttonText: String,
    redirectTitleText: String,
    redirectLink: String,
    redirectText: String
  };
  