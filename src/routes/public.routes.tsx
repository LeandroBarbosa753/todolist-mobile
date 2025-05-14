
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import Login from "../pages/login";
import Register from "../pages/register";


type PublicRoutesProps = {
  Login: undefined;
  Register: undefined;

};


const { Navigator, Screen } = createNativeStackNavigator<PublicRoutesProps>();


export type PublicRoutesNavigation = NativeStackNavigationProp<PublicRoutesProps>;

const PublicRoutes = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Login" component={Login} />
            <Screen name="Register" component={Register} />
        </Navigator>
    );
};

export default PublicRoutes;