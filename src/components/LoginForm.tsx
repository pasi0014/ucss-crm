
function LoginForm(){
    
    return(
        <div>
            <form action="" method="POST" >
                <p>Login Form</p>
                <label htmlFor="emailhold">Email: </label><br></br>
                <input type="email" name="emails" id="emailhold" placeholder='Email' required /><br></br>

                <label htmlFor="password">Password: </label><br></br>
                <input type="password" name="password" id="password" placeholder='Password' required /><br></br>

                <input type="submit" value="Login" />
            </form>
        </div>
    );
}

export default LoginForm;