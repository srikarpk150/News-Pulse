import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../screens/profile';
import ResetPassword from '../screens/resetpassword';
import { RouteParamList } from '../Routes/path';

const ProfileStack = createNativeStackNavigator<RouteParamList>();

export function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileScreen" component={Profile} />
      <ProfileStack.Screen name="ResetPassword" component={ResetPassword} />
    </ProfileStack.Navigator>
  );
}