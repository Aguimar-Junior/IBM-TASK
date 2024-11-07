import { Stack } from 'expo-router';
import { enableScreens } from 'react-native-screens';

enableScreens(); 
const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade', 
        gestureEnabled: true, 
      }}
    />
  );
};

export default Layout;
