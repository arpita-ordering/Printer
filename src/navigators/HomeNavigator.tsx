import * as React from 'react';
import { AppState } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSession, useWebsocket } from 'ordering-components-external/native';
import BottomNavigator from '../navigators/BottomNavigator';
import OrderDetails from '../pages/OrderDetails';
import AcceptOrRejectOrder from '../pages/AcceptOrRejectOrder';
import OrderSummary from '../pages/OrderSummary';
import OrderMessage from '../pages/OrderMessage';
import Splash from '../pages/Splash';

import BackgroundTimer from 'react-native-background-timer';
import { useNetInfo } from '@react-native-community/netinfo';

const Stack = createStackNavigator();

const HomeNavigator = () => {
  const [{ loading, user }] = useSession();
  const socket = useWebsocket();

  const appState = React.useRef(AppState.currentState);
  let interval: any;

  const netInfo = useNetInfo();

  React.useEffect(() => {
    const ordersRoom = user?.level === 0 ? 'orders' : `orders_${user?.id}`;
    socket.join(ordersRoom);
    const messagesOrdersRoom =
      user?.level === 0 ? 'messages_orders' : `messages_orders_${user?.id}`;
    socket.join(messagesOrdersRoom);
  }, [netInfo.isConnected]);

  const _handleAppStateChange = (nextAppState: any) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      BackgroundTimer.clearInterval(interval);
    } else {
      interval = BackgroundTimer.setInterval(() => {
        const ordersRoom = user?.level === 0 ? 'orders' : `orders_${user?.id}`;
        socket.join(ordersRoom);
      }, 5000);
      appState.current = nextAppState;
    }
  };

  React.useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  return (
    <Stack.Navigator>
      {!loading ? (
        <>
          <Stack.Screen
            name="BottomTab"
            component={BottomNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OrderDetails"
            component={OrderDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AcceptOrRejectOrder"
            component={AcceptOrRejectOrder}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OrderSummary"
            component={OrderSummary}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OrderMessage"
            component={OrderMessage}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default HomeNavigator;
