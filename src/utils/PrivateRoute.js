import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom"
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({children, ...rest}) => {

    const {authTokens} = useContext(AuthContext);

    return(
        <Routes>
            {
                !authTokens ? (
                    <Route {...rest} element={<Navigate to="/" />} />
                ) : (
                    <Route {...rest} >{children}</Route>
                )
            }
        </Routes>
    )
}

export default PrivateRoute