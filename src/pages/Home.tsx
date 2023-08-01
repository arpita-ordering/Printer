import React from 'react';
import {StyleSheet, StatusBar, View, Platform} from 'react-native';
import {useTheme} from 'ordering-ui-native-release';
import {Home as HomePage} from 'ordering-ui-native-release/themes/business';
import settings from '../config.json'
import styled from 'styled-components/native';

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const Home = (props: any) => {
  const [theme] = useTheme();

  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.clear,
    },
  });

  const homeProps = {
    ...props,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return;
      props.navigation.navigate(page, params);
    },
    title: {
      key: 'BUSINESS_WELCOME_SUBTITLE',
      value: "Let's start to administrate your business now",
    },
    useRootPoint: settings.use_root_point
  };

  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.wrapper}>
        <StatusBar
          backgroundColor="white"
          barStyle="dark-content"
          translucent={false}
          showHideTransition="fade"
          animated
        />
        <HomePage {...homeProps} />
      </View>
    </KeyboardView>
  );
};

export default Home;
