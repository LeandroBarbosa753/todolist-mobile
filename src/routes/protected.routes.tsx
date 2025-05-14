import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import Dashboard from "../pages/dashboard";


type ProtectedRoutesProps = {
  Dashboard: undefined;

};

const { Navigator, Screen } = createNativeStackNavigator<ProtectedRoutesProps>();


export type ProtectedRoutesNavigation = NativeStackNavigationProp<ProtectedRoutesProps>;

const ProtectedRoutes = () => {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Dashboard" component={Dashboard} />
        </Navigator>
    );
};

export default ProtectedRoutes;