import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useTheme } from 'ordering-ui-native-release';
import {
  SafeAreaContainerLayout,
  StoresList,
} from 'ordering-ui-native-release/themes/business';

const Stores = (props: any) => {
  const [theme] = useTheme();

  const StoresProps = {
    ...props,
    isSearchByName: true,
    isSearchByDescription: true,
    propsToFetch: ['id', 'name', 'logo', 'address', 'zipcode', 'enabled'],
    paginationSettings: {
      controlType: 'infinity',
      initialPage: 1,
      pageSize: 10,
    },
    asDashboard: true,
    initialFilterKey: 'orderBy',
    initialFilterValue: 'name',
    isForceSearch: Platform.OS === 'ios',
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.backgroundLight,
    },
  });

  return (
    <SafeAreaContainerLayout style={styles.container}>
      <StoresList {...StoresProps} />
    </SafeAreaContainerLayout>
  );
};

export default Stores;
