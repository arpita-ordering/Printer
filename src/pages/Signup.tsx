import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { useSession } from 'ordering-components-external/native';
import { useTheme, StoreMethods } from 'ordering-ui-native-release';
import {
  Container,
  SignupForm,
} from 'ordering-ui-native-release/themes/business';

const { _setStoreData, _removeStoreData } = StoreMethods;

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const Signup = (props: any) => {
  const [, { login }] = useSession();
  const [theme] = useTheme();

  const signupProps = {
    ...props,
    notificationState: props.route?.params?.notification_state,
    signupLevel: 2,
    onNavigationRedirect: (page: string) => {
      if (!page) return;
      props.navigation.navigate(page);
    },
    handleSuccessSignup: (user: any) => {
      _removeStoreData('isGuestUser');

      if (user?.id && [0, 2].includes(user?.level)) {
        login({
          user,
          token: user.session.access_token,
        });
      } else {
        props?.navigation?.canGoBack() && props.navigation.goBack();
      }
    },
  };

  if (props.route?.params?.notification_state) {
    _setStoreData(
      'notification_state',
      props.route?.params?.notification_state,
    );
  }

  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Container style={{ backgroundColor: theme.colors.white }}>
        <SignupForm {...signupProps} />
      </Container>
    </KeyboardView>
  );
};

export default Signup;
