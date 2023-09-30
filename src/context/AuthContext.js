import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { json, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {

    const navigate = useNavigate();

    console.log( JSON.parse(localStorage.getItem("authTokens")) );

    const [authTokens, setAuthTokens] = useState( () => localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null );
    const [user, setUser] = useState( () => localStorage.getItem("authTokens") ? jwt_decode(localStorage.getItem("authTokens")) : null );

    const [loading, setLoading] = useState(true);
    
    const loginUser = async (e) => {
        
        e.preventDefault();
        console.log("submitted");

        fetch("http://127.0.0.1:8000/api/token/", {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
        }).then((response) => {
            if (response.status !== 200) {
              throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the response body as JSON
          })
          .then((data) => {
            setAuthTokens(data);
            setUser(jwt_decode(data.access));

            localStorage.setItem("authTokens", JSON.stringify(data));

            navigate("/home");

            console.log('API Response:', data); // Access the JSON data
          })
          .catch((error) => {
            console.error('Error:', error);
          });

    }

    const logoutUser = () => {
      setAuthTokens(null);
      setUser(null);
      localStorage.removeItem('authTokens');
      navigate('/');
    }

    const refreshTokens = async () => {

      console.log("tokens updated");

      fetch("http://127.0.0.1:8000/api/token/refresh/", {
          method:"POST",
          headers:{
              'Content-Type':'application/json'
          },
          body: JSON.stringify({'refresh':authTokens.refresh})
      }).then((response) => {
          if (response.status !== 200) {
            logoutUser();
            throw new Error('Network response was not ok in refresh');
          }
          return response.json(); // Parse the response body as JSON
        })
        .then((data) => {
          setAuthTokens(data);
          setUser(jwt_decode(data.access));

          localStorage.setItem("authTokens", JSON.stringify(data));

          console.log('API Response after refresh:', data); // Access the JSON data
        })
        .catch((error) => {
          console.error('Error:', error);
        });

    }

    let contextData = {
        authTokens: authTokens,
        user:user,
        loginUser: loginUser,
        logoutUser:logoutUser,
    }

    useEffect( ()=> {

      let time = 1000 * 60 * 4;

      let intervel = setInterval( ()=> {
        if(authTokens){
          refreshTokens();
        }
      }, time)
      return ()=> clearInterval(intervel);

    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}