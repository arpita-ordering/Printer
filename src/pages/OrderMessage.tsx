import React from 'react';
import {useTheme} from 'ordering-ui-native-release';
import {
  OrderMessage as OrderMessageController,
  SafeAreaContainer,
} from 'ordering-ui-native-release/themes/business';

const OrderMessage = ({navigation, route}: any) => {
  const {orderId, isFromCheckout, setOrders} = route.params;
  const orderDetailsProps = {
    navigation,
    orderId,
    setOrders,
    isFromCheckout,
    isDisabledOrdersRoom: true,
    driverAndBusinessId: true,
  };

  const [theme] = useTheme();

  return (
    <SafeAreaContainer style={{backgroundColor: theme.colors.white}}>
      <OrderMessageController {...orderDetailsProps} />
    </SafeAreaContainer>
  );
};

export default OrderMessage;
