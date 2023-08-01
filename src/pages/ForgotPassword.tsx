import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from 'ordering-ui-native-release';
import {
  ForgotPasswordForm,
  Container,
} from 'ordering-ui-native-release/themes/business';

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const ForgotPassword = (props: any) => {
  const [theme] = useTheme();

  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Container style={{ backgroundColor: theme.colors.white }}>
        <ForgotPasswordForm {...props} />
      </Container>
    </KeyboardView>
  );
};

export default ForgotPassword;
