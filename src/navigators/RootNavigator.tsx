import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { StoreMethods } from 'ordering-ui-native-release';
import { useSession, useConfig, useOrder } from 'ordering-components-external/native';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import OneSignal from 'react-native-onesignal';
import settings from '../config.json';
import * as RootNavigation from '../navigators/NavigationRef';
import NetInfo from '@react-native-community/netinfo';

dayjs.extend(isSameOrAfter);
dayjs.extend(utc);

import HomeNavigator from './HomeNavigator';
import IntroductoryTutorial from '../pages/IntroductoryTutorial';
import Home from '../pages/Home';
import Login from '../pages/Login';
// import Signup from '../pages/Signup';
import Forgot from '../pages/ForgotPassword';
import Splash from '../pages/Splash';
import NetworkError from '../pages/NetworkError';
import NotFound from '../pages/NotFound'

const Stack = createStackNavigator();
const { _retrieveStoreData } = StoreMethods

const RootNavigator = () => {
  const [{ auth, loading: sessionLoading }] = useSession();
  const [orderId, setOrderId] = useState(null);
  const [orderStatus] = useOrder();
  const [{ configs, loading: configsLoading }] = useConfig();
  const [isTutorial, setTutorial] = useState(settings.show_tutorials)
  const [loaded, setLoaded] = useState(false);
  const [isPushLoading, setIsPushLoading] = useState({ loading: true });
  const [oneSignalState, setOneSignalState] = useState<any>({
    notification_app: settings.notification_app,
  });
  const [connectionState, setConnectionState] = useState<{
    connection_status: boolean;
  } | null>(null);

  const oneSignalSetup = async () => {
    setIsPushLoading({ loading: true });
    OneSignal.setLogLevel(6, 0);

    OneSignal.setAppId(configs?.onesignal_businessapp_id?.value);

    if (Platform.OS === 'ios') {
      OneSignal.promptForPushNotificationsWithUserResponse((response: any) => {
        console.log('Prompt response:', response);
      });
    }

    OneSignal.setNotificationOpenedHandler(({ notification }: any) => {
      if (notification?.additionalData?.order_id) {
        setOrderId(notification?.additionalData?.order_id);
      }
    });

    OneSignal.addSubscriptionObserver((event: any) => {
      setOneSignalState({
        ...oneSignalState,
        notification_token: event?.to?.userId,
      });
    });

    const deviceState: any = await OneSignal.getDeviceState();

    if (!deviceState?.isSubscribed) {
      OneSignal.addTrigger('prompt_ios', 'true');
    }

    OneSignal.disablePush(false);

    const data = {
      ...oneSignalState,
      notification_token: deviceState?.userId,
      notification_app: settings.notification_app,
    };
    setOneSignalState(data);
    setIsPushLoading({ loading: false });
  };

  useEffect(() => {
    if (!loaded && !orderStatus.loading && !isPushLoading.loading) {
      setLoaded(true);
    }
  }, [orderStatus, isPushLoading]);

  useEffect(() => {
    if (orderId && loaded && auth) {
      RootNavigation.navigate('OrderDetails', {
        orderId: orderId,
        isFromRoot: true,
      });

      setOrderId(null);
    }
  }, [loaded, orderId]);

  useEffect(() => {
    if (!sessionLoading && !isPushLoading.loading && !auth) {
      setLoaded(!auth);
    }
  }, [sessionLoading, isPushLoading]);

  useEffect(() => {
    if (configsLoading) return;
    if (configs?.onesignal_businessapp_id?.value) {
      oneSignalSetup();
    }
    if (!!!configs?.onesignal_businessapp_id?.value) {
      setIsPushLoading({ loading: false });
    }
  }, [configsLoading]);

  useEffect(() => {
    const setTutorialLocal = async () => {
      const data = await _retrieveStoreData('isTutorial');
      if (data === false) {
        setTutorial(false)
      }
    }
    setTutorialLocal();
  }, [isTutorial])

  let netInfoSuscription: any = null;
  useEffect(() => {
    netInfoSuscription = NetInfo.addEventListener(handleConnectivityChange);

    return () => {
      netInfoSuscription && netInfoSuscription();
    };
  }, []);

  const handleConnectivityChange = (state: any) => {
    setConnectionState({ connection_status: state.isConnected });
  };

  return (
    <Stack.Navigator>
      {!loaded && (
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
      )}
      {loaded && connectionState?.connection_status && (
        <>
          {!auth ? (
            <>
              {isTutorial ? (
                <Stack.Screen
                  name="IntroductoryTutorial"
                  component={IntroductoryTutorial}
                  options={{ headerShown: false }}
                  initialParams={{ setTutorial }}
                />) : (
                <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{ headerShown: false }}
                />
              )}
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
                initialParams={{ notification_state: oneSignalState }}
              />
              <Stack.Screen
                name="Forgot"
                component={Forgot}
                options={{ headerShown: false }}
              />
              {/* <Stack.Screen
                name="Signup"
                component={Signup}
                options={{ headerShown: false }}
              /> */}
            </>
          ) : (
            <>
              <Stack.Screen
                name="MyAccount"
                component={HomeNavigator}
                options={{ headerShown: false }}
              />
            </>
          )}
        </>
      )}
      {connectionState?.connection_status === false ? (
        <Stack.Screen
          name="NetworkError"
          component={NetworkError}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="NotFound"
          component={NotFound}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
