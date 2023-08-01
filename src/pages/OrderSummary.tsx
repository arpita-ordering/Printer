import React from 'react';
import { useTheme } from 'ordering-ui-native-release';
import {
  OrderSummary as OrderSummaryController
} from '../components/OrderSummary';
import {
  SafeAreaContainer
} from 'ordering-ui-native-release/themes/business';
const OrderSummary = ({ route, navigation }: any) => {
  const orderSummaryProps = {
    order: route.params.order,
    navigation,
    orderStatus: route.params.orderStatus,
  };

  const [theme] = useTheme();

  return (
    <SafeAreaContainer style={{ backgroundColor: theme.colors.white }}>
      <OrderSummaryController {...orderSummaryProps} />
    </SafeAreaContainer>
  );
};

export default OrderSummary;
