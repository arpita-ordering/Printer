import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'ordering-ui-native-release';
import {
  AcceptOrRejectOrder as AcceptOrRejectOrderController,
  SafeAreaContainer,
} from 'ordering-ui-native-release/themes/business';

const AcceptOrRejectOrder = ({ navigation, route }: any) => {
  const [theme] = useTheme();

  return (
    <SafeAreaContainer style={{ backgroundColor: theme.colors.white }}>
      <View style={{ flex: 1, backgroundColor: theme.colors.primaryContrast }}>
        <AcceptOrRejectOrderController
          navigation={navigation}
          route={route.params}
          notShowCustomerPhone={false}
          actions={{ accept: 'acceptByBusiness', reject: 'rejectByBusiness' }}
          titleAccept={{ key: 'PREPARATION_TIME', text: 'Preparation time' }}
          titleReject={{ key: 'REJECT_ORDER', text: 'Reject Order' }}
        />
      </View>
    </SafeAreaContainer>
  );
};

export default AcceptOrRejectOrder;
