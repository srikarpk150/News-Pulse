import { createNativeStackNavigator } from '@react-navigation/native-stack';
import trending from '../screens/trending';
import Detail from '../screens/detail';
import { RouteParamList } from '../Routes/path';

const TrendingStack = createNativeStackNavigator<RouteParamList>();

export function TrendingStackNavigator() {
  return (
    <TrendingStack.Navigator screenOptions={{ headerShown: false }}>
      <TrendingStack.Screen name="TrendingScreen" component={trending} />
      <TrendingStack.Screen name="Detail" component={Detail} />
    </TrendingStack.Navigator>
  );
}