import "./auth.css"
import {Link, useNavigate} from "react-router-dom"
import { useState } from "react"
import { toast} from "react-hot-toast"



const Sigup = ()=> {

  const navigate = useNavigate()
  const [signupInfo,setSignupInfo]=useState({
    name:"",
    email:"",
    password:""
  });

  const handleChange = (e)=>
  {
    const {name , value }= e.target;
    const copySignupInfo ={...signupInfo}
    copySignupInfo[name]= value;
    setSignupInfo(copySignupInfo);


  }
  const handleSubmit = async(e)=>
  {
      e.preventDefault();
      const{name,email,password}= signupInfo;
      if(!name||!email||!password)
      {
        toast.error("all fields are required");
      }
      try {
        const  url = "http://localhost:8080/api/user/register"

        const response = await fetch(url,{
          method:"POST",
          headers:{
            "content-type":"application/json"
          },
          body: JSON.stringify(signupInfo)
        })
        const result = await response.json();
        const {message,success,user} = result;
        if(success)
        {
          toast.success(message)
          setTimeout(()=>{
            navigate("/login")
          },1000)
        }
        else
        {
          toast.error(message)
        }
        console.log(result);
        
      } catch (err) {
        toast.error(err);
      }
      
  }

  return (
    <>
    
    <main>
      <div className="box">
        <div className="inner-box-signup">
              <div className="forms-wraps">
                <form action="post" autoComplete="off" className="sign-up-form" onSubmit={handleSubmit}>
                  <div className="logo">
                    
                    <h3>ED-Machine</h3>
                  </div>
                  <div className="actual-form">
                    <div className="input-wrap">
                      <input  required type="text" name="name" className="input-filed" onChange={handleChange} />
                      <label htmlFor="name">Name</label>
                    </div>
                    <div className="input-wrap">
                      <input required type="text" name="email" className="input-filed" onChange={handleChange}   />
                      <label htmlFor="email">Email</label>
                    </div>
                    <div className="input-wrap">
                      <input required type="text" name="password" className="input-filed" onChange={handleChange}  />
                      <label htmlFor="password">Password</label>
                    </div>
                    <div className="input-wrap">
                      <input type="file" id="file"   />
                      <label htmlFor="file" id="file-label" >Upload profile pic</label>
                    </div>
                    <button className="submit-btn" >Signup</button>
                    <p className="text">By sigining up,Iagree to the <Link >Terms and conditons</Link > and <Link >Privacy policy</Link> </p>
      
                  </div>

                </form>
              </div>
              <div className="carousel">
              <div className="heading">
                    <h2>Register Here</h2>
                    <h6>already have an account?</h6>
                    <Link to="/login" className="link">Login</Link>
                  </div>

              </div>
        </div>
      </div>
      
    </main>
    </>
  )
}

export default Sigup