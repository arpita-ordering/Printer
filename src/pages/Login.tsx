import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { useTheme, StoreMethods } from 'ordering-ui-native-release';
import { Container, LoginForm } from 'ordering-ui-native-release/themes/business';
import settings from '../config.json'

const { _setStoreData } = StoreMethods;


const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const Login = ({ navigation, route }: any) => {
  const [theme] = useTheme();

  const loginProps = {
    navigation,
    useLoginByCellphone: true,
    useLoginByEmail: true,
    allowedLevels: [0, 2],
    onNavigationRedirect: (page: string) => {
      if (!page) return;
      navigation.navigate(page);
    },
    notificationState: route?.params?.notification_state,
    // useRootPoint: settings.use_root_point
  };

  
  if (route?.params?.notification_state) {
    _setStoreData('notification_state', route?.params?.notification_state);
  }

  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Container style={{ backgroundColor: theme.colors.white }}>
        <LoginForm {...loginProps} />
      </Container>
    </KeyboardView>
  );
};

export default Login;
