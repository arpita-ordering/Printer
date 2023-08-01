import React from 'react';
import { useTheme } from 'ordering-ui-native-release';
import {
  SafeAreaContainerLayout,
} from 'ordering-ui-native-release/themes/business';
import {
  OrderDetailsBusiness as OrderDetailsController } from '../components/OrderDetails/Business'

const OrderDetails = ({ navigation, route }: any) => {
  const orderDetailsProps = {
    navigation,
    orderId: route.params?.orderId || route.params?.order?.id,
    driverAndBusinessId: true,
    order: route.params?.order,
    isFromCheckout: route.params?.isFromCheckout,
    isFromRoot: route.params?.isFromRoot,
    isFetchDrivers: true,
    isBusiness: true,
    isDisabledOrdersRoom: true,
    actions: { accept: 'acceptByBusiness', reject: 'rejectByBusiness' },
    orderTitle: {
      accept: { key: 'PREPARATION_TIME', text: 'Preparation time', btnKey: 'ACCEPT', btnText: 'Accept' },
      reject: { key: 'REJECT_ORDER', text: 'Reject Order', btnKey: 'REJECT', btnText: 'Reject' }
    },
    appTitle: { key: 'BUSINESS_APP', text: 'Business App' },
  };

  return (
    <SafeAreaContainerLayout>
      <OrderDetailsController {...orderDetailsProps} />
    </SafeAreaContainerLayout>
  );
};

export default OrderDetails;
