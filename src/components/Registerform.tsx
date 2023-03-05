import { useState } from 'react'
function RegisterForm(){

    // const [input, setInput] = useState({
    //     emails: '',
    //     password: '',
    //     passwordckeck: ''
    //   });
     
    //   const [error, setError] = useState({
    //     emails: '',
    //     password: '',
    //     passwordckeck: ''
    //   })
     
    //   const onInputChange = e => {
    //     const { name, value } = e.target;
    //     setInput(prev => ({
    //       ...prev,
    //       [name]: value
    //     }));
    //     validateInput(e);
    //   }
     
    //   const validateInput = e => {
    //     let { name, value } = e.target;
    //     setError(prev => {
    //       const stateObj = { ...prev, [name]: "" };
       
    //       switch (name) {
    //         case "username":
    //           if (!value) {
    //             stateObj[name] = "Please enter Username.";
    //           }
    //           break;
       
    //         case "password":
    //           if (!value) {
    //             stateObj[name] = "Please enter Password.";
    //           } else if (input.passwordckeck && value !== input.passwordckeck) {
    //             stateObj["passwordckeck"] = "Password and Confirm Password does not match.";
    //           } else {
    //             stateObj["passwordckeck"] = input.passwordckeck ? "" : error.passwordckeck;
    //           }
    //           break;
       
    //         case "passwordckeck":
    //           if (!value) {
    //             stateObj[name] = "Please enter Confirm Password.";
    //           } else if (input.password && value !== input.password) {
    //             stateObj[name] = "Password and Confirm Password does not match.";
    //           }
    //           break;
       
    //         default:
    //           break;
    //       }
       
    //       return stateObj;
    //     });
    //   }

    return(
        <div>
            <form action="" method="POST" >
                <p>Register form</p>
                <label htmlFor="emailhold">Email: </label><br></br>
                <input 
                type="email" 
                name="emails" 
                id="emailhold" 
                placeholder='Email' 
                required /><br></br>

                <label htmlFor="password">Password: </label><br></br>
                <input 
                type="password" 
                name="password" 
                id="password" 
                placeholder='Password' 
                required /><br></br>

                <label htmlFor="confirmPassword">Confirm password: </label><br></br>
                <input 
                type="password" 
                name="passwordckeck" 
                id="confirmPassword" 
                placeholder='Confirm password' 
                required /><br></br>

                <input 
                type="checkbox" 
                name="terms" 
                id="privacy" 
                required />
                <label htmlFor="terms"> I accept the <a href='#'>Terms of Use</a> & <a href="#">Privacy Policy</a></label><br></br>

                <input type="submit" value="Register" />
            </form>
        </div>
    );
}

export default RegisterForm;