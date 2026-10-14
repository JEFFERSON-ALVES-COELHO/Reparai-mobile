
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import NewReportScreen from '../screens/NewReportScreen';
import ReportDetailScreen from '../screens/ReportDetailScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen
                    name="Splash"
                    component={SplashScreen}
                />

                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                />

                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                />

                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                />

                <Stack.Screen
                    name="NewReport"
                    component={NewReportScreen}
                />
                <Stack.Screen
                    name="ReportDetail"
                    component={ReportDetailScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}