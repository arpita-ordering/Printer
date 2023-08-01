import * as React from 'react';
import { LogBox, Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';
import SplashScreen from 'react-native-splash-screen';
import { OrderingProvider } from 'ordering-components-external/native';
import { OToast, Alert, ThemeProvider, StoreMethods } from 'ordering-ui-native-release';
import settings from './config.json';
import theme from './theme.json';
import AppContainer from './AppContainer';

const { _retrieveStoreData, _removeStoreData } = StoreMethods

const reactNavigationV5Instrumentation = new Sentry.ReactNavigationV5Instrumentation({
  routeChangeTimeoutMs: 1000
})

Sentry.init({
  environment: Platform.OS === 'ios' ? 'ios' : 'android',
  dsn: 'https://dbf8dc5a80a049f086d07d8252dbf661@o460529.ingest.sentry.io/6305627',
  release: 'store-app@' + process.env.npm_package_version,
  tracesSampleRate: 0.2,
  ignoreErrors: [
    'is not defined',
    'can\'t find variable',
    'objects are not valid',
    'element type is invalid',
    'requiring module',
    'has not been registered',
    'failed to connect to debugger!',
    'rendered more hooks than',
    'rendered fewer hooks than',
    'should have a queue',
    'the OS most likely terminated',
    'Connection timed out',
    'java.io.EOFException',
    'Abort',
    'Segfault',
    'Failed to allocate a',
    'Application Not Responding',
    'connection no longer valid',
    'IllegalInstruction',
    'React.Children.only expected to receive a single React element child.',
    'unrecognized selector sent to instance'
  ],

  // Release health
  enableAutoSessionTracking: true,
  // Sessions close after app is 10 seconds in the background.
  sessionTrackingIntervalMillis: 10000,

  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation: reactNavigationV5Instrumentation,
    })
  ]
});

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  'Non-serializable values were found in the navigation state.',
  'Setting a timer',
  'The `value` prop is required for the `<Context.Provider>`',
  "Can't perform a React state update",
  'Remote debugger',
  'Task orphaned for request',
]);

theme.images = {
  logos: {
    background: require('./assets/images/background.png'),
    logotype: require('./assets/images/logotype.png'),
    logotypeInvert: require('./assets/images/logotype-invert.png'),
    passwordInputIcon: require('./assets/icons/password.png'),
    emailInputIcon: require('./assets/icons/email.png'),
    logo: require('./assets/images/logo.png'),
  },
  general: {
    loadingSplash: require('./assets/images/loading-splash.png'),
    notFound: require('./assets/images/not-found.png'),
    dropDown: require('./assets/icons/drop_down.png'),
    chevronDown: require('./assets/icons/chevron-down.png'),
    inputPhone: require('./assets/icons/phone.png'),
    imageChat: require('./assets/icons/image-chat.png'),
    attach: require('./assets/icons/attach.png'),
    arrow_down: require('./assets/icons/arrow_down.png'),
    arrow_left: require('./assets/icons/arrow_left.png'),
    map: require('./assets/icons/map.png'),
    message: require('./assets/icons/message.png'),
    telephone: require('./assets/icons/telephone.png'),
    location: require('./assets/icons/location.png'),
    arrowReturnLeft: require('./assets/icons/arrow_return_left.png'),
    close: require('./assets/icons/Close.png'),
    pdfFile: require('./assets/icons/pdfFile.png'),
    docFile: require('./assets/icons/docFile.png'),
    imageFile: require('./assets/icons/imageFile.png'),
    cellphone: require('./assets/icons/cellphone.png'),
    reload: require('./assets/icons/reload.png'),
    search: require('./assets/icons/search.png'),
    camera: require('./assets/icons/camera.png'),
    profilephoto: require('./assets/icons/profile-default-photo.png'),
    orders: require('./assets/icons/orders.png'),
    messages: require('./assets/icons/messages.png'),
    stores: require('./assets/icons/stores.png'),
    profile: require('./assets/icons/profile.png'),
    menulogout: require('./assets/icons/logout.png'),
    project: require('./assets/icons/project.png'),
    information: require('./assets/icons/information.png'),
    newOrder: require('./assets/images/new-order.png'),
    orderCreating: require('./assets/images/order-creating.png'),
    orderSuccess: require('./assets/images/order-success.png'),
    copy: require('./assets/icons/copy.png'),
    print: require('./assets/icons/print.png'),
    clock1: require('./assets/icons/clock1.png'),
    clockRisk: require('./assets/icons/clock-history1.png'),
    clockDelayed: require('./assets/icons/clock-fill1.png'),
    noNetwork: require('./assets/images/no-network.png')
  },
  backgroundsImages: {
    login: require('./assets/images/background.png'),
  },
  dummies: {
    businessLogo: require('./assets/images/dummies/store.png'),
    driverPhoto:
      'https://res.cloudinary.com/demo/image/fetch/c_thumb,g_face,r_max/https://www.freeiconspng.com/thumbs/driver-icon/driver-icon-14.png',
    customerPhoto:
      'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png',
  },
  tutorials: {
    slide1: require('./assets/images/slide1.png'),
    slide2: require('./assets/images/slide2.png'),
    slide3: require('./assets/images/slide3.png'),
    slide4: require('./assets/images/slide4.png')
  }
};
theme.sounds = {
  notification: require('./assets/sounds/notification.mp3')
}

const BusinessApp = () => {
  const [configStore, setConfigStore] = React.useState({ loading: settings.use_root_point })
  const [configFile, setConfigFile] = React.useState<any>(settings)

  const manageProjectAction = async () => {
    let project: any = null
    try {
      setConfigStore({ ...configStore, loading: true })
      if (settings.use_root_point) {
        project = await _retrieveStoreData('project_name')
      } else {
        await _removeStoreData('project_name')
      }

      if (project) {
        setConfigFile({ ...configFile, project })
        configFile.project = project
      }
      setConfigStore({ ...configFile, loading: false })
    } catch (error) {
      setConfigStore({ ...configFile, loading: false })
    }
  }

  React.useEffect(() => {
    manageProjectAction()
  }, []);

  React.useEffect(() => {
    if (!configStore.loading || !settings.use_root_point) {
      SplashScreen.hide();
    }
  }, [configStore]);

  return (
    <ThemeProvider theme={theme}>
      <OrderingProvider settings={configFile} Alert={Alert} isDisableToast={true}>
        <AppContainer />
        <OToast />
      </OrderingProvider>
    </ThemeProvider>
  );
};

export default BusinessApp;
