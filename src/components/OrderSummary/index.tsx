import React, { useState } from 'react';
import { OText, OIconButton } from 'ordering-ui-native-release';
import { StyleSheet, View, Platform, Alert, PermissionsAndroid } from 'react-native';
import {
  Content,
  OrderCustomer,
  OrderHeader,
  OrderContent,
  OrderBusiness,
  OrderProducts,
  Table,
  OrderBill,
  Total,
  Action,
  ContentInfo,
} from './styles';
import { useUtils, useLanguage, useConfig } from 'ordering-components-external/native';
import { verifyDecimals, getProductPrice } from '../../utils';
import { FloatingButton } from 'ordering-ui-native-release/themes/business';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import { useTheme } from 'styled-components/native';

import { ProductItemAccordion } from 'ordering-ui-native-release/themes/business';

import {
  InterfaceType,
  StarConnectionSettings,
  StarXpandCommand,
  StarPrinter,
  StarDeviceDiscoveryManager,
  StarDeviceDiscoveryManagerFactory,
} from 'react-native-star-io10';


export const OrderSummary = ({ order, navigation, orderStatus }: any) => {
  const handleArrowBack: any = () => {
    navigation?.canGoBack() && navigation.goBack();
  };
  const [{ parsePrice, parseNumber, parseDate }] = useUtils();
  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const [state, setState] = useState({
    printers:[],
    bluetoothIsEnabled: true
});

const interfaceTypes: Array<InterfaceType> = [InterfaceType.Bluetooth]
  
  // const [state, setState] = useState({
  //   selectedPrinter: { url: undefined },
  // });
  var mStarDeviceDiscoveryManager : StarDeviceDiscoveryManager;

  console.log('manager', +StarDeviceDiscoveryManager);

  const getFormattedSubOptionName = ({ quantity, name, position, price }: any) => {
    if (name !== 'No') {
      const pos = position && position !== 'whole' ? `(${t(position.toUpperCase(), position)})` : '';
      return pos
        ? `${quantity} x ${name} ${pos} +${parsePrice(price)}\n`
        : `${quantity} x ${name} +${parsePrice(price)}\n`;
    } else {
      return 'No\n';
    }
  };
  
  
  const getSuboptions = (suboptions: any) => {
    const array: any = []
    suboptions?.length > 0 &&
    suboptions?.map((suboption: any) => {
      const string = `&nbsp;&nbsp;&nbsp;${getFormattedSubOptionName(suboption)}<br/>`
      array.push(string)
    })

    return array.join('')
  }

  const getOptions = (options: any, productComment: string = '') => {
    const array: any = [];

    options?.length &&
    options?.map((option: any) => {
      const string =
      `  ${option.name}<br/>${getSuboptions(option.suboptions)}`;

      array.push(string)
    })

    if (productComment) {
      array.push(`${t('COMMENT', 'Comment')}<br/>&nbsp;&nbsp;&nbsp;&nbsp;${productComment}`)
    }

    return array.join('')
  }

  const theme = useTheme();
  const percentTip =
    parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
    !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
    verifyDecimals(order?.summary?.driver_tip, parseNumber);

  const orderSummary = () => {
    return `
    <div>
        <h1>${t('ORDER_NO', 'Order No.')} ${order.id}</h1>
        <p style="font-size: 27px">

          ${orderStatus} </br>

          ${t('DELIVERY_TYPE', 'Delivery Type')}: ${
      deliveryStatus[order?.delivery_type]
    }
          </br>
          ${t('DELIVERY_DATE', 'Delivery Date')}: ${
      order?.delivery_datetime_utc
        ? parseDate(order?.delivery_datetime_utc)
        : parseDate(order?.delivery_datetime, { utc: false })
    }
          </br>
          ${t('PAYMENT_METHOD')}: ${order?.paymethod?.name}
        </p>

        <h1>${t('CUSTOMER_DETAILS', 'Customer details')}</h1>
        <p style="font-size: 27px"> ${t('FULL_NAME', 'Full Name')}: ${
      order?.customer?.name
    } ${order?.customer?.middle_name} ${order?.customer?.lastname} ${
      order?.customer?.second_lastname
    }
        </br>
        ${t('EMAIL', 'Email')}: ${order?.customer?.email}
        </br>
        ${t('MOBILE_PHONE', 'Mobile Phone')}: ${order?.customer?.cellphone}
         </br>
         ${
           !!order?.customer?.phone
             ? `${t('MOBILE_PHONE', 'Mobile Phone')}: ${
                 order?.customer?.phone
               } </br>`
             : ''
         }
         ${t('FULL_ADDRESS', 'Full Addres')}: ${order?.customer?.address} 
         </br> 
         ${
           !!order?.customer?.internal_number
             ? `${t('INTERNAL_NUMBER', 'Internal Number')}: ${
                 order?.customer?.internal_number
               } </br>`
             : ''
         }
         ${t('ZIPCODE', 'Zipcode')}: ${order?.customer.zipcode}
         </p>  

        <h1>${t('BUSINESS_DETAILS', 'Business details')}</h1>
        <p style="font-size: 27px"> 
        ${order?.business?.name} 
        </br> 
        ${order?.business?.email}
        </br> 
        ${t('BUSINESS_PHONE', 'Business Phone')}: ${order?.business?.cellphone}
        </br> 
        ${
          !!order?.business?.phone
            ? `${t('BUSINESS_PHONE', 'Business Phone')}: ${
                order?.business?.phone
              } </br>`
            : ''
        } 

        ${t('ADDRESS', 'Address')}: ${order?.business?.address} 
        </br>
        ${
          !!order?.business?.address_notes
            ? `${t('SPECIAL_ADDRESS', 'Special Address')}: ${
                order?.business?.address_notes
              } `
            : ''
        }
        </p>
        <h1> ${t('ORDER_DETAILS', 'Order Details')}</h1>

        ${order?.products.length &&
          order?.products.map(
            (product: any, i: number) =>
              `<div style="display: flex;flexDirection:row;flex-wrap:wrap">
                <div style="display:flex;width:100%">
                  <div style="display:flex; justify-content: flex-start; font-size: 26px; width: 70%">
                  ${product?.quantity}  ${product?.name}
                  </div>

                  <div style="display:flex; justify-content: flex-end; font-size: 26px; width: 30%">
                  ${parsePrice(product.total ?? getProductPrice(product))}
                  </div>
                </div>

                <div style="font-size: 26px;width:100%">
                  <div style="width:90%;display:flex;justifyContent:center;margin:auto;">
                    ${getOptions(product.options, product.comment)}
                  </div>
                </div>
              </div>`
          )
        }
        <div style="display: flex;">

            <div style="display:flex; justify-content: flex-start; font-size: 26px; width: 70%">
            ${t('SUBTOTAL', 'Subtotal')}
            </div>

            <div style="display:flex; justify-content: flex-end; font-size: 26px; width: 30%">
              ${parsePrice(
                order.tax_type === 1
                  ? order?.summary?.subtotal + order?.summary?.tax ?? 0
                  : order?.summary?.subtotal ?? 0,
              )}
            </div>

        </div>

        <div style="display: flex">
        ${
          order?.summary?.discount > 0
            ? order?.offer_type === 1
              ? `<div style="display:flex; justify-content: flex-start; font-size: 26px; width: 70%">
                  ${t('DISCOUNT', 'Discount')} (${verifyDecimals(
                  order?.offer_rate,
                  parsePrice,
                )}%)
                </div>`
              : `<div style="display:flex; justify-content: flex-start; font-size: 26px; width: 70%"> ${t(
                  'DISCOUNT',
                  'Discount',
                )}
                 </div>`
            : ''
        }
        ${
          order?.summary?.discount > 0
            ? `<div style="display:flex; justify-content: flex-end; font-size: 26px; width: 30%">- ${parsePrice(
                order?.summary?.discount,
              )}
              </div>`
            : ''
        }
        </div>

        ${
          order?.tax_type !== 1
            ? `<div style="font-size: 25px">
                ${t('TAX', 'Tax')}
                ${verifyDecimals(order?.summary?.tax_rate, parseNumber)}%
                ${parsePrice(order?.summary?.tax ?? 0)}
                ${t('TAX', 'Tax')}
                ${verifyDecimals(order?.summary?.tax_rate, parseNumber)}%
              </div>`
            : ''
        }

        ${
          order?.summary?.delivery_price > 0
            ? `<div style="font-size: 25px;"> ${t(
                'DELIVERY_FEE',
                'Delivery Fee',
              )}
              </div>`
            : ''
        }

        <div style="display: flex">

          <div style="font-size: 26px; width: 70%; display: flex; justify-content: flex-start"> 
            ${t('DRIVER_TIP', 'Driver tip')}
            ${percentTip ? `(${percentTip}%)` : ''}
          </div>

          <div style="font-size: 26px; width: 30%; display: flex; justify-content: flex-end">
            ${parsePrice(order?.summary?.driver_tip ?? 0)}
          </div>

        </div>

        <div style="display: flex">

          <div style="font-size: 26px; width: 70%; display: flex; justify-content: flex-start"> 
            ${t('SERVICE_FEE', 'Service Fee')}
           (${verifyDecimals(order?.summary?.service_fee, parseNumber)}%)
          </div>

          <div style="font-size: 26px; width: 30%; display: flex; justify-content: flex-end">
            ${parsePrice(order?.summary?.service_fee ?? 0)}
          </div>

        </div>

        <div style="display: flex">

          <div style="font-size: 26px; width: 70%; display: flex; justify-content: flex-start; font-weight: bold"> 
            ${t('TOTAL', 'Total')}
          </div>

          <div style="font-size: 26px; width: 30%; display: flex; justify-content: flex-end">
            ${parsePrice(order?.summary?.total ?? 0)}
          </div>

        </div>
        
    </div>`;
  };

  const deliveryStatus: any = {
    1: t('DELIVERY', 'Delivery'),
    2: t('PICK_UP', 'Pick up'),
    3: t('EAT_IN', 'Eat In'),
    4: t('CURBSIDE', 'Curbside'),
    5: t('DRIVER_THRU', 'Driver thru'),
  };

  // @NOTE iOS Only
  const selectPrinter = async () => {
    const selectedPrinter = await RNPrint.selectPrinter({ x: '100', y: '100' });
    //setState({ selectedPrinter });
  };

  const _confirmBluetoothPermission = async() => {
    var hasPermission = false;
    console.log("_confirmBluetoothPermission")

    try {
        hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);

        if (!hasPermission) {
            const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
                
            hasPermission = status == PermissionsAndroid.RESULTS.GRANTED;
        }
    }
    catch (err) {
        console.warn(err);
    }

    return hasPermission;
}

  // @NOTE iOS Only
  const silentPrint = async () => {
    console.log("call printer function")
  //   alert("1"+interfaceTypes)

  //   // var settings = new StarConnectionSettings();
  //   // settings.interfaceType = state.interfaceType;
  //   // settings.identifier = state.identifier;
  //   // settings.autoSwitchInterface = true;

  //   // If you are using Android 12 and targetSdkVersion is 31 or later,
  //   // you have to request Bluetooth permission (Nearby devices permission) to use the Bluetooth printer.
  //   // https://developer.android.com/about/versions/12/features/bluetooth-permissions
  //   if (Platform.OS == 'android' && 31 <= Platform.Version) {
  //       if (state.bluetoothIsEnabled ) {
  //           var hasPermission = _confirmBluetoothPermission();
            
  //           if (!hasPermission) {
  //               console.log(`PERMISSION ERROR: You have to allow Nearby devices to use the Bluetooth printer`);
  //               return;
  //           }
  //       }
  //   }
    

  //   try {
  //     await mStarDeviceDiscoveryManager.stopDiscovery()

  //     // var interfaceTypes: Array<InterfaceType> = []
  //     // if(state.lanIsEnabled) {
  //     //     interfaceTypes.push(InterfaceType.Lan);
  //     // }
  //     // if(state.bluetoothIsEnabled) {
  //     //     interfaceTypes.push(InterfaceType.Bluetooth);
  //     // }
  //     // if(state.bluetoothLeIsEnabled) {
  //     //     interfaceTypes.push(InterfaceType.BluetoothLE);
  //     // }
  //     // if(state.usbIsEnabled) {
  //     //     interfaceTypes.push(InterfaceType.Usb);
  //     // }

  //     mStarDeviceDiscoveryManager = await StarDeviceDiscoveryManagerFactory.create(interfaceTypes);
  //     mStarDeviceDiscoveryManager.discoveryTime = 10000;

  //     mStarDeviceDiscoveryManager.onPrinterFound = (printer: StarPrinter) => {
  //         const printers = state.printers;
  //         printers.push(printer);
  //         setState({printers: printers});

  //         console.log(`Found printer: ${printer.connectionSettings.identifier}.`);
  //     };

  //     mStarDeviceDiscoveryManager.onDiscoveryFinished = () => {
  //         console.log(`Discovery finished.`);
  //     };

  //     await mStarDeviceDiscoveryManager.startDiscovery();
  // }
  // catch(error) {
  //     console.log(`Error: ${String(error)}`);
  //     alert("Error===>"+error)
  // }

    // var printer = new StarPrinter(settings);

    // try {
    //     var builder = new StarXpandCommand.StarXpandCommandBuilder();
    //     builder.addDocument(new StarXpandCommand.DocumentBuilder()
    //     .addPrinter(new StarXpandCommand.PrinterBuilder()
    //         .actionPrintImage(new StarXpandCommand.Printer.ImageParameter("logo_01.png", 406))
    //         .styleInternationalCharacter(StarXpandCommand.Printer.InternationalCharacterType.Usa)
    //         .styleCharacterSpace(0)
    //         .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
    //         .actionPrintText("Star Clothing Boutique\n" +
    //                         "123 Star Road\n" +
    //                         "City, State 12345\n" +
    //                         "\n")
    //         .styleAlignment(StarXpandCommand.Printer.Alignment.Left)
    //         .actionPrintText("Date:MM/DD/YYYY    Time:HH:MM PM\n" +
    //                         "--------------------------------\n" +
    //                         "\n")
    //         .actionPrintText("SKU         Description    Total\n" +
    //                         "300678566   PLAIN T-SHIRT  10.99\n" +
    //                         "300692003   BLACK DENIM    29.99\n" +
    //                         "300651148   BLUE DENIM     29.99\n" +
    //                         "300642980   STRIPED DRESS  49.99\n" +
    //                         "300638471   BLACK BOOTS    35.99\n" +
    //                         "\n" +
    //                         "Subtotal                  156.95\n" +
    //                         "Tax                         0.00\n" +
    //                         "--------------------------------\n")
    //         .actionPrintText("Total     ")
    //         .add(new StarXpandCommand.PrinterBuilder()
    //             .styleMagnification(new StarXpandCommand.MagnificationParameter(2, 2))
    //             .actionPrintText("   $156.95\n")
    //         )
    //         .actionPrintText("--------------------------------\n" +
    //                         "\n" +
    //                         "Charge\n" +
    //                         "156.95\n" +
    //                         "Visa XXXX-XXXX-XXXX-0123\n" +
    //                         "\n")
    //         .add(new StarXpandCommand.PrinterBuilder()
    //             .styleInvert(true)
    //             .actionPrintText("Refunds and Exchanges\n")
    //         )
    //         .actionPrintText("Within ")
    //         .add(new StarXpandCommand.PrinterBuilder()
    //             .styleUnderLine(true)
    //             .actionPrintText("30 days")
    //         )
    //         .actionPrintText(" with receipt\n")
    //         .actionPrintText("And tags attached\n" +
    //                         "\n")
    //         .styleAlignment(StarXpandCommand.Printer.Alignment.Center)
    //         .actionPrintBarcode(new StarXpandCommand.Printer.BarcodeParameter('0123456',
    //                             StarXpandCommand.Printer.BarcodeSymbology.Jan8)
    //                             .setBarDots(3)
    //                             .setBarRatioLevel(StarXpandCommand.Printer.BarcodeBarRatioLevel.Level0)
    //                             .setHeight(5)
    //                             .setPrintHri(true))
    //         .actionFeedLine(1)
    //         .actionPrintQRCode(new StarXpandCommand.Printer.QRCodeParameter('Hello World.\n')
    //                             .setModel(StarXpandCommand.Printer.QRCodeModel.Model2)
    //                             .setLevel(StarXpandCommand.Printer.QRCodeLevel.L)
    //                             .setCellSize(8))
    //         .actionCut(StarXpandCommand.Printer.CutType.Partial)
    //         )
    //     );

    //     var commands = await builder.getCommands();

    //     await printer.open();
    //     await printer.print(commands);

    //     console.log(`Success`);
    // }
    // catch(error) {
    //   alert(`Error: ${String(error)}`)
    //     console.log(`Error: ${String(error)}`);
    // }
    // finally {
    //     await printer.close();
    //     await printer.dispose();
    // }
    // if (!state?.selectedPrinter) {
    //   Alert.alert('Must Select Printer First');
    // }

    // const jobName = await RNPrint.print({
    //   printerURL: state?.selectedPrinter?.url,
    //   html: orderSummary(),
    // });
  };
  const printTextb = async (text, height = 0, width = 0) => {
    
    // let id = 'Order Id'+'  '+ order.id+'\n\n';
    // await BluetoothEscposPrinter.printText(id, {});
    // await BluetoothEscposPrinter.setBlob(0);
    // let status = orderStatus+'\n';
    // await BluetoothEscposPrinter.printText(status, {});
    // let dtype = 'Delivery Type'+'  '+ deliveryStatus[order?.delivery_type]+'\n';
    // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
    // await BluetoothEscposPrinter.printText(dtype, {});
    
    // let ddate = 'Delivery Date'+'  '+ parseDate(order?.delivery_datetime, { utc: false })+'\n';
    // await BluetoothEscposPrinter.printText(ddate, {});
    // let paymethod = 'Payment Method'+'  '+ order?.paymethod?.name+'\n';
    // await BluetoothEscposPrinter.printText(paymethod, {});
    // await BluetoothEscposPrinter.printText("-----------------------------------------\n\n",{});
    // //customer details
    // await BluetoothEscposPrinter.printText("Customer details\n", {});
    // await BluetoothEscposPrinter.printText("\n", {});
    // let cname = 'Full Name'+'  '+order?.customer?.name+'\n';
    // await BluetoothEscposPrinter.printText(cname, {});
    // let email = 'Email'+'  '+order?.customer?.email+'\n';
    // await BluetoothEscposPrinter.printText(email, {});
    // let phone = 'Mobile Phone'+'  '+order?.customer?.cellphone+'\n';
    // await BluetoothEscposPrinter.printText(phone, {});
    // let address = 'Full Addres'+'  '+order?.customer?.address+'\n';
    // await BluetoothEscposPrinter.printText(address, {});
    // //customer details
    // await BluetoothEscposPrinter.printText("-----------------------------------------\n\n",{})
    // //business details
    // await BluetoothEscposPrinter.printText("Business details\n", {});
    // await BluetoothEscposPrinter.printText("\n", {});
    // let bname = order?.business?.name+'\n';
    // await BluetoothEscposPrinter.printText(bname, {});
    // let bemail = order?.business?.email+'\n';
    // await BluetoothEscposPrinter.printText(bemail, {});
    // let bphone = 'Business Phone'+'  '+order?.business?.cellphone+'\n';
    // await BluetoothEscposPrinter.printText(bphone, {});
    // let baddress = 'Address'+'  '+order?.business?.address+'\n';
    // await BluetoothEscposPrinter.printText(baddress, {});
    // //business details
    // await BluetoothEscposPrinter.printText("-----------------------------------------\n\n",{})
    // //order details
    // await BluetoothEscposPrinter.printText("Order details\n", {});
    // await BluetoothEscposPrinter.printText("\n", {});
    // await BluetoothEscposPrinter.printText("\n", {});
    // let productdetails = '1'+' '+'Hamburger'+'             '+'$7.00';
    // await BluetoothEscposPrinter.printText(productdetails, {});
    // //order details
    // await BluetoothEscposPrinter.printText("-----------------------------------------\n\n",{})
    // //order all fee 
    // let subtotal = 'Subtotal'+'                '+parsePrice(order.tax_type === 1? order?.summary?.subtotal + order?.summary?.tax ?? 0: order?.summary?.subtotal ?? 0,);
    // await BluetoothEscposPrinter.printText(subtotal, {});
    // let otax = 'Tax(10%)'+'                '+parsePrice(order?.summary?.tax ?? 0);
    // await BluetoothEscposPrinter.printText(otax, {});
    // let odeliveryfee = 'Delivery Fee'+'                '+'$1.00';
    // await BluetoothEscposPrinter.printText(odeliveryfee, {});
    // let Drivertip = 'Driver tip'+'                '+parsePrice(order?.summary?.driver_tip ?? 0);
    // await BluetoothEscposPrinter.printText(Drivertip, {});
    // let ServiceFee = 'Service Fee('+verifyDecimals(order?.summary?.service_fee, parseNumber)+')             '+parsePrice(order?.summary?.service_fee ?? 0);
    // await BluetoothEscposPrinter.printText(ServiceFee, {});
    // //order all fee
    // //order total 
    // await BluetoothEscposPrinter.printText("-----------------------------------------\n\n",{})
    // let ototal = 'Total'+'                '+parsePrice(order?.summary?.total ?? 0);
    // await BluetoothEscposPrinter.printText(ototal, {});
    // return await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {});
    //order total 
  };
  const printText1111 = async () => {
    
    // BluetoothManager.enableBluetooth().then(
    //   (r) => {
    //     var paired = [];
    //     if (r && r.length > 0) {
    //       for (var i = 0; i < r.length; i++) {
    //         try {
    //           paired.push(JSON.parse(r[i]));
    //           //alert(err); // NEED TO PARSE THE DEVICE INFORMATION
    //         } catch (e) {
    //           //ignore
    //         }
    //       }
    //     }
    //     alert(JSON.stringify(paired));
    //   },
    //   (err) => {
    //     alert(err);
    //   }
    // );
    //  BluetoothManager.connect('00:12:F3:3A:B0:B3') // the device address scanned.
    // .then(
    //   (s) => {
        
    //     /* setState({
    //       loading: false,
    //       boundAddress: '00:12:F3:3A:B0:B3',
    //     }); */
    //     //alert(JSON.stringify(s));
    //     printTextb('test');
        
    //   },
    //   (e) => {
    //     /* setState({
    //       loading: false,
    //     }); */
    //     alert(JSON.stringify(e));
    //   }
    // ); 
    
   
  };
  
  const printPDF = async () => {
    // BluetoothManager.isBluetoothEnabled().then(
    //   (enabled) => {
    //     if(enabled === false){
    //       console.log(orderSummary())
    //       alert('Please enable the device bluetooth')
    //     }
    //     else{
    //       printText1111()
    //       //alert("Printer status="+ enabled);
    //     }
    //      // enabled ==> true /false
    //   },
    //   (err) => {
    //     alert(err);
    //   }
    // );
    
    /* const results = await RNHTMLtoPDF.convert({
      html: orderSummary(),
      fileName: 'test',
      base64: true,
    });

    await RNPrint.print({
      filePath: results.filePath || '',
      jobName: `${t('ORDER_NO', `Order no. ${order.id}`)}`,
    }); */
  };

  const styles = StyleSheet.create({
    btnBackArrow: {
      maxWidth: 40,
      height: 25,
    },
    textBold: {
      fontWeight: '600',
    },
  });

  return (
    <>
      <Content>
        <OrderContent>
          <OrderHeader>
            <OIconButton
              icon={theme.images.general.arrow_left}
              iconStyle={{ width: 20, height: 20 }}
              borderColor={theme.colors.clear}
              style={{ maxWidth: 40, justifyContent: 'flex-end' }}
              onClick={() => handleArrowBack()}
            />
            <OText
              style={{ marginBottom: 5 }}
              size={15}
              color={theme.colors.textGray}
              weight="600">
              {t('INVOICE_ORDER_NO', 'Order No.')} {order.id}
            </OText>

            <OText
              style={{ marginBottom: 5 }}
              size={15}
              color={theme.colors.textGray}>
              {`${orderStatus}`}
            </OText>

            <OText style={{ marginBottom: 5 }}>
              {`${t('DELIVERY_TYPE', 'Delivery Type')}: ${
                deliveryStatus[order?.delivery_type]
              }`}
            </OText>

            <OText style={{ marginBottom: 5 }}>
              {`${t('DELIVERY_DATE', 'Delivery Date')}: ${
                order?.delivery_datetime_utc
                  ? parseDate(order?.delivery_datetime_utc)
                  : parseDate(order?.delivery_datetime, { utc: false })
              }`}
            </OText>

            <OText style={{ marginBottom: 5 }}>{`${t('PAYMENT_METHOD')}: ${t(
              order?.paymethod?.name.toUpperCase(),
              order?.paymethod?.name,
            )}`}</OText>
          </OrderHeader>

          <OrderCustomer>
            <OText
              style={{ marginBottom: 5 }}
              size={16}
              weight="600"
              color={theme.colors.textGray}>
              {t('CUSTOMER_DETAILS', 'Customer details')}
            </OText>

            <OText
              style={{ marginBottom: 5 }}
              size={14}
              numberOfLines={2}
              adjustsFontSizeToFit
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {`${t('FULL_NAME', 'Full Name')}: ${order?.customer?.name} ${
                order?.customer?.middle_name
              } ${order?.customer?.lastname} ${
                order?.customer?.second_lastname
              }`}
            </OText>

            <OText
              style={{ marginBottom: 5 }}
              size={14}
              numberOfLines={2}
              adjustsFontSizeToFit
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {`${t('EMAIL', 'Email')}: ${order?.customer?.email}`}
            </OText>

            <OText
              style={{ marginBottom: 5 }}
              size={14}
              numberOfLines={2}
              adjustsFontSizeToFit
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {`${t('MOBILE_PHONE', 'Mobile Phone')}: ${
                order?.customer?.cellphone
              }`}
            </OText>

            {!!order?.customer?.phone && (
              <OText
                style={{ marginBottom: 5 }}
                size={14}
                numberOfLines={2}
                adjustsFontSizeToFit
                ellipsizeMode="tail"
                color={theme.colors.textGray}>
                {`${t('MOBILE_PHONE', 'Mobile Phone')}: ${
                  order?.customer?.phone
                }`}
              </OText>
            )}

            <OText
              style={{ marginBottom: 5 }}
              size={14}
              numberOfLines={2}
              adjustsFontSizeToFit
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {`${t('ADDRESS', 'Address')}: ${order?.customer?.address}`}
            </OText>

            {!!order?.customer?.internal_number && (
              <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                {t('INTERNAL_NUMBER', 'Internal Number')}{' '}
                {order?.customer?.internal_number}
              </OText>
            )}

            {order?.customer?.address_notes && (
              <OText style={{ marginBottom: 5 }}>
                {`${t('NOTES', 'Notes')}: ${order?.customer?.address_notes}`}
              </OText>
            )}

            {!!order?.customer.zipcode && (
              <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                {t('ZIPCODE', 'Zipcode')}: {order?.customer?.zipcode}
              </OText>
            )}
          </OrderCustomer>

          <OrderBusiness>
            <OText
              style={{ marginBottom: 5 }}
              size={16}
              weight="600"
              color={theme.colors.textGray}>
              {t('BUSINESS_DETAILS', 'Business details')}
            </OText>

            <OText
              style={{ marginBottom: 5 }}
              size={14}
              numberOfLines={2}
              adjustsFontSizeToFit
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {order?.business?.name}
            </OText>

            <OText
              style={{ marginBottom: 5 }}
              size={14}
              numberOfLines={2}
              adjustsFontSizeToFit
              ellipsizeMode="tail"
              color={theme.colors.textGray}>
              {order?.business?.email}
            </OText>

            {!!order?.business?.cellphone && (
              <OText
                style={{ marginBottom: 5 }}
                size={14}
                numberOfLines={2}
                ellipsizeMode="tail"
                color={theme.colors.textGray}>
                {`${t('BUSINESS_PHONE', 'Business Phone')}: ${
                  order?.business?.cellphone
                }`}
              </OText>
            )}

            {!!order?.business?.phone && (
              <OText
                style={{ marginBottom: 5 }}
                size={14}
                numberOfLines={2}
                ellipsizeMode="tail"
                color={theme.colors.textGray}>
                {`${t('BUSINESS_PHONE', 'Business Phone')}: ${
                  order?.business?.phone
                }`}
              </OText>
            )}

            {!!order?.business?.address && (
              <OText
                style={{ marginBottom: 5 }}
                size={14}
                adjustsFontSizeToFit
                ellipsizeMode="tail"
                color={theme.colors.textGray}>
                {`${t('ADDRESS', 'Address')}: ${order?.business?.address}`}
              </OText>
            )}

            {!!order?.business?.address_notes && (
              <OText
                style={{ marginBottom: 5 }}
                size={14}
                adjustsFontSizeToFit
                ellipsizeMode="tail"
                color={theme.colors.textGray}>
                {`${t('SPECIAL_ADDRESS', 'Special Address')}: ${
                  order?.business?.address_notes
                }`}
              </OText>
            )}
          </OrderBusiness>

          <OrderProducts>
            <OText
              style={{ marginBottom: 5 }}
              size={16}
              weight="600"
              color={theme.colors.textGray}>
              {t('ORDER_DETAILS', 'Order Details')}
            </OText>

            {order?.products.length &&
              order?.products.map((product: any, i: number) => (
                <View key={i}>
                  <ContentInfo>
                    <ProductItemAccordion
                      key={product?.id || i}
                      product={product}
                      isClickableEvent
                    />
                  </ContentInfo>
                </View>
              ))}
          </OrderProducts>

          <OrderBill>
            <Table>
              <OText style={{ marginBottom: 5 }}>
                {t('SUBTOTAL', 'Subtotal')}
              </OText>

              <OText style={{ marginBottom: 5 }}>
                {parsePrice(
                  order.tax_type === 1
                    ? order?.summary?.subtotal + order?.summary?.tax ?? 0
                    : order?.summary?.subtotal ?? 0,
                )}
              </OText>
            </Table>

            {order?.tax_type !== 1 && (
              <Table>
                <OText style={{ marginBottom: 5 }}>
                  {t('TAX', 'Tax')}
                  {`(${verifyDecimals(
                    order?.summary?.tax_rate,
                    parseNumber,
                  )}%)`}
                </OText>

                <OText style={{ marginBottom: 5 }}>
                  {parsePrice(order?.summary?.tax ?? 0)}
                </OText>
              </Table>
            )}

            {order?.summary?.discount > 0 && (
              <Table>
                {order?.offer_type === 1 ? (
                  <OText style={{ marginBottom: 5 }}>
                    <OText>{t('DISCOUNT', 'Discount')}</OText>

                    <OText>
                      {`(${verifyDecimals(order?.offer_rate, parsePrice)}%)`}
                    </OText>
                  </OText>
                ) : (
                  <OText style={{ marginBottom: 5 }}>
                    {t('DISCOUNT', 'Discount')}
                  </OText>
                )}

                <OText style={{ marginBottom: 5 }}>
                  - {parsePrice(order?.summary?.discount)}
                </OText>
              </Table>
            )}

            {order?.summary?.delivery_price > 0 && (
              <Table>
                <OText style={{ marginBottom: 5 }}>
                  {t('DELIVERY_FEE', 'Delivery Fee')}
                </OText>

                <OText>{parsePrice(order?.summary?.delivery_price)}</OText>
              </Table>
            )}

            <Table>
              <OText style={{ marginBottom: 5 }}>
                {t('DRIVER_TIP', 'Driver tip')}
                {order?.summary?.driver_tip > 0 &&
                  parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                  !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                  `(${verifyDecimals(
                    order?.summary?.driver_tip,
                    parseNumber,
                  )}%)`}
              </OText>

              <OText style={{ marginBottom: 5 }}>
                {parsePrice(order?.summary?.driver_tip ?? 0)}
              </OText>
            </Table>

            {order?.summary?.service_fee > 0 && (
              <Table>
                <OText style={{ marginBottom: 5 }}>
                  {t('SERVICE_FEE', 'Service Fee')}
                  {`(${verifyDecimals(
                    order?.summary?.service_fee,
                    parseNumber,
                  )}%)`}
                </OText>

                <OText style={{ marginBottom: 5 }}>
                  {parsePrice(order?.summary?.service_fee)}
                </OText>
              </Table>
            )}

            <Total>
              <Table>
                <OText style={styles.textBold}>{t('TOTAL', 'Total')}</OText>
                <OText style={styles.textBold} color={theme.colors.primary}>
                  {parsePrice(order?.summary?.total ?? 0)}
                </OText>
              </Table>
            </Total>
          </OrderBill>
        </OrderContent>
        <View style={{ height: 40 }} />
      </Content>

      <View style={{ marginBottom: 0 }}>
        <FloatingButton
          firstButtonClick={() =>
            Platform.OS === 'ios' ? silentPrint() : printPDF()
          }
          btnText={t('PRINT', 'Print')}
          color={theme.colors.green}
          widthButton={'100%'}
          isPadding
        />
      </View>
    </>
  );
};
