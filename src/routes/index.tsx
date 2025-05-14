import { NavigationContainer } from "@react-navigation/native";
import ProtectedRoutes from "./protected.routes";
import PublicRoutes from "./public.routes";
import { useAuth } from "../hooks/useAuth";

const Routes = () => {
    const { user } = useAuth();
    
    return (
        <NavigationContainer>
            {user?.id ? <ProtectedRoutes /> : <PublicRoutes />}
        </NavigationContainer>
    );
};

export default Routes;