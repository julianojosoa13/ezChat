import { createContext, useState } from "react";

export const AuthenticatedUserContext = createContext({})

const AuthenticatedUserProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [userAvatarURL, setUserAvatarURL] = useState(null)
    return (
        <AuthenticatedUserContext.Provider value={{user, setUser, userAvatarURL, setUserAvatarURL}}>
            {children}
        </AuthenticatedUserContext.Provider>
    )
}

export default AuthenticatedUserProvider