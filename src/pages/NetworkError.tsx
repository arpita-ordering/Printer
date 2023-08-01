import React from 'react';
import { useTheme } from 'ordering-ui-native-release';
import {
  SafeAreaContainer,
  NetworkError as NetworkErrorScreen,
} from 'ordering-ui-native-release/themes/business';

const NetworkError = () => {
  const [theme] = useTheme();

  return (
    <SafeAreaContainer style={{ backgroundColor: theme.colors.white }}>
      <NetworkErrorScreen />
    </SafeAreaContainer>
  );
};

export default NetworkError;
