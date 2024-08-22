import "./auth.css"
import { Link } from "react-router-dom";



const Login = () => {
  return (
    <>
      <main>
        <div className="box">
          <div className="inner-box-login">
            <div className="forms-wraps">
              <form action="post" autoComplete="off" className="sign-up-form">
                <div className="logo">

                  <h3>ED-Machine</h3>
                </div>




                <div className="actual-form">

                  <div className="input-wrap">
                    <input required type="text" name="email" className="input-filed" />
                    <label htmlFor="email">Email</label>
                  </div>
                  <div className="input-wrap">
                    <input required type="text" name="password" className="input-filed" />
                    <label htmlFor="password">Password</label>
                  </div>
                  <button className="submit-btn" >Signin</button>
                  <p className="text">Does not remember the password <Link >forget passoword</Link ></p>

                </div>

              </form>
            </div>
            <div className="carousel">
              <div className="heading">
                <h2>Signin</h2>
                <h6>does not have an account?</h6>
                <Link to="/signup" className="link">Signup</Link>
              </div>

            </div>
          </div>
        </div>
      </main></>
  )
}

export default Login