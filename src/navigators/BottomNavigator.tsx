import React from 'react';
import { View, Platform, StyleSheet, PlatformIOSStatic } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useLanguage } from 'ordering-components-external/native';
import { useTheme } from 'ordering-ui-native-release';
import { OIcon, OText } from 'ordering-ui-native-release/themes/business';
import Profile from '../pages/Profile';
import MyOrders from '../pages/MyOrders';
import Stores from '../pages/Stores';
import Messages from '../pages/Messages';

const Tab = createMaterialBottomTabNavigator();

const BottomNavigator = () => {
  const [, t] = useLanguage();
  const [theme] = useTheme();

  const isIos = Platform.OS === 'ios';
  const platformIOS = Platform as PlatformIOSStatic

  const styles = StyleSheet.create({
    bottomTabs: {
      backgroundColor: theme.colors.white,
      borderTopWidth: 1,
      borderTopColor: theme.colors.tabBar,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.36,
      shadowRadius: 6.87,
      elevation: 11,
      paddingBottom: platformIOS.isPad ? 30 : 0
    },
  });

  return (
    <Tab.Navigator
      initialRouteName="BusinessList"
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.disabled}
      barStyle={styles.bottomTabs}
      labeled={false}>
      <Tab.Screen
        name="Orders"
        component={MyOrders}
        options={{
          tabBarIcon: ({ focused, color }: any) => (
            <View
              style={{
                width: 120,
                height: 60,
                alignItems: 'center',
                justifyContent: !isIos ? 'flex-start' : 'space-evenly',
                position: 'relative',
                bottom: !isIos ? 10 : 13,
              }}>
              <View style={{ alignItems: 'center' }}>
                <OIcon
                  color={color}
                  src={theme.images.general.orders}
                  width={20}
                  height={20}
                  style={{ marginBottom: 2 }}
                />
                <OText
                  color={focused ? theme.colors.textGray : color}
                  size={12}>
                  {t('ORDERS', 'Orders')}
                </OText>
              </View>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarIcon: ({ focused, color }: any) => (
            <View
              style={{
                width: 120,
                height: 60,
                alignItems: 'center',
                justifyContent: !isIos ? 'flex-start' : 'space-evenly',
                position: 'relative',
                bottom: !isIos ? 10 : 13,
              }}>
              <View style={{ alignItems: 'center' }}>
                <OIcon
                  color={color}
                  src={theme.images.general.messages}
                  width={20}
                  height={20}
                  style={{ marginBottom: 2 }}
                />
                <OText
                  color={focused ? theme.colors.textGray : color}
                  size={12}>
                  {t('MESSAGES', 'Messages')}
                </OText>
              </View>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Stores"
        component={Stores}
        options={{
          tabBarIcon: ({ focused, color }: any) => (
            <View
              style={{
                width: 120,
                height: 60,
                alignItems: 'center',
                justifyContent: !isIos ? 'flex-start' : 'space-evenly',
                position: 'relative',
                bottom: !isIos ? 10 : 13,
              }}>
              <View style={{ alignItems: 'center' }}>
                <OIcon
                  color={color}
                  src={theme.images.general.stores}
                  width={20}
                  height={20}
                  style={{ marginBottom: 2 }}
                />
                <OText
                  color={focused ? theme.colors.textGray : color}
                  size={12}>
                  {t('BUSINESSES', 'Businesses')}
                </OText>
              </View>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused, color }: any) => (
            <View
              style={{
                width: 120,
                height: 60,
                alignItems: 'center',
                justifyContent: !isIos ? 'flex-start' : 'space-evenly',
                position: 'relative',
                bottom: !isIos ? 10 : 13,
              }}>
              <View style={{ alignItems: 'center' }}>
                <OIcon
                  color={color}
                  src={theme.images.general.profile}
                  width={23}
                  height={23}
                  style={{ marginBottom: 2 }}
                />
                <OText
                  color={focused ? theme.colors.textGray : color}
                  size={12}>
                  {t('PROFILE', 'Profile')}
                </OText>
              </View>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
