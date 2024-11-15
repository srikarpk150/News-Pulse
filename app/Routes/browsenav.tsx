import { createNativeStackNavigator } from '@react-navigation/native-stack';
import browse from '../screens/browse';
import Detail from '../screens/detail';
import { RouteParamList } from '../Routes/path';

const BrowseStack = createNativeStackNavigator<RouteParamList>();

export function BrowseStackNavigator() {
  return (
    <BrowseStack.Navigator screenOptions={{ headerShown: false }}>
      <BrowseStack.Screen name="BrowseScreen" component={browse} />
      <BrowseStack.Screen name="Detail" component={Detail} />
    </BrowseStack.Navigator>
  );
}