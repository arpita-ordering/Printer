import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { OText, useTheme } from 'ordering-ui-native-release';
import styled from 'styled-components/native';
import {
  UserProfileForm as ProfileController,
  SafeAreaContainerLayout,
} from 'ordering-ui-native-release/themes/business';
import { useLanguage } from 'ordering-components-external/native';

const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
`;

interface Props {
  navigation: any;
  route: any;
}

const Profile = (props: Props) => {
  const [theme] = useTheme();
  const [, t] = useLanguage();

  const profileProps = {
    ...props,
    useSessionUser: true,
    useValidationFields: true,
    goToBack: () => props.navigation?.canGoBack() && props.navigation.goBack(),
    onNavigationRedirect: (route: string, params: any) =>
      props.navigation.navigate(route, params),
  };

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.backgroundLight,
    },
    title: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 26,
      color: theme.colors.textGray,
    },
  });

  return (
    <>
      <KeyboardView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ backgroundColor: theme.colors.backgroundLight }}>
        <SafeAreaContainerLayout
          style={{
            backgroundColor: theme.colors.backgroundLight,
          }}>
          <View style={styles.header}>
            <OText style={styles.title}>{t('PROFILE', 'Profile')}</OText>
          </View>
          <ProfileController {...profileProps} />
        </SafeAreaContainerLayout>
      </KeyboardView>
    </>
  );
};

export default Profile;
