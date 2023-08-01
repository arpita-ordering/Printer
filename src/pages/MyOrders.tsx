import React from 'react';
import { StyleSheet, Platform, PlatformIOSStatic } from 'react-native';
import { useTheme, DeviceOrientationMethods } from 'ordering-ui-native-release';
import DeviceInfo from 'react-native-device-info';
import {
  OrdersOption,
  OrdersListManager,
  SafeAreaContainerLayout,
} from 'ordering-ui-native-release/themes/business';

const { useDeviceOrientation } = DeviceOrientationMethods

const MyOrders = (props: any) => {
  const [theme] = useTheme();
  const { navigation, route } = props;
  const [orientationState] = useDeviceOrientation();

  const isPortrait = orientationState.orientation === 'portrait'
  const WIDTH_SCREEN = orientationState?.dimensions?.width

  const platformIOS = Platform as PlatformIOSStatic
  const isIpad = platformIOS.isPad
  const isTablet = DeviceInfo.isTablet();
  
  const MyOrderProps = {
    navigation,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return;
      navigation.navigate(page, params);
    },
    paginationSettings: {
      initialPage: 1,
      pageSize: 50,
      controlType: 'infinity'
    },
    isBusinessApp: true,
    orderDetailsProps: {
      navigation,
      driverAndBusinessId: true,
      isFetchDrivers: true,
      isBusiness: true,
      isDisabledOrdersRoom: true,
      actions: { accept: 'acceptByBusiness', reject: 'rejectByBusiness' },
      orderTitle: {
        accept: { key: 'PREPARATION_TIME', text: 'Preparation time', btnKey: 'ACCEPT', btnText: 'Accept' },
        reject: { key: 'REJECT_ORDER', text: 'Reject Order', btnKey: 'REJECT', btnText: 'Reject' }
      },
      appTitle: { key: 'BUSINESS_APP', text: 'Business App' }
    },
    checkNotification: true
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroundLight,
    },
  });

  return (
    <SafeAreaContainerLayout style={styles.container}>
      {((isIpad || isTablet) && (isPortrait && WIDTH_SCREEN >= 950) || !isPortrait) ? (
        <OrdersListManager {...MyOrderProps} />
      ) : (
        <OrdersOption {...MyOrderProps} />
      )}
    </SafeAreaContainerLayout>
  );
};

export default MyOrders;
