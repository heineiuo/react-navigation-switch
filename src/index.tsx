/**
 * Most of codes are copied from https://github.com/react-navigation/react-navigation
 */

import {
  View,
  StyleSheet,
  useWindowDimensions,
  Text,
  Platform,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import {
  TabRouter,
  NavigationHelpersContext,
  useNavigationBuilder,
  createNavigatorFactory,
  NavigationRouteContext,
  NavigationContext,
  useTheme,
} from "@react-navigation/native";
import type {
  ParamListBase,
  TabNavigationState,
  Descriptor,
  Route,
  TabRouterOptions,
} from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type Layout = { width: number; height: number };

export const getDefaultHeaderHeight = (
  layout: Layout,
  statusBarHeight: number
): number => {
  const isLandscape = layout.width > layout.height;

  let headerHeight;

  if (Platform.OS === "ios") {
    if (isLandscape && !Platform.isPad) {
      headerHeight = 32;
    } else {
      headerHeight = 44;
    }
  } else if (Platform.OS === "android") {
    headerHeight = 56;
  } else {
    headerHeight = 64;
  }

  return headerHeight + statusBarHeight;
};

export declare type SwitchNavigationState<ParamList extends ParamListBase> =
  Omit<TabNavigationState<ParamList>, "type" | "history"> & {
    /**
     * Type of the router, in this case, it's switch.
     */
    type: "switch";
    /**
     * List of previously visited route keys and switch open status.
     */
    history: (
      | {
          type: "route";
          key: string;
        }
      | {
          type: "switch";
        }
    )[];
  };

export declare type SwitchNavigationOptions = TabRouterOptions;

type SwitchHeaderOptions = {
  /**
   * String or a function that returns a React Element to be used by the header.
   * Defaults to scene `title`.
   * It receives `allowFontScaling`, `tintColor`, `style` and `children` in the options object as an argument.
   * The title string is passed in `children`.
   */
  headerTitle?:
    | string
    | ((props: {
        /**
         * Whether title font should scale to respect Text Size accessibility settings.
         */
        allowFontScaling?: boolean;
        /**
         * Tint color for the header.
         */
        tintColor?: string;
        /**
         * Content of the title element. Usually the title string.
         */
        children?: string;
        /**
         * Style object for the title element.
         */
        style?: StyleProp<TextStyle>;
      }) => React.ReactNode);
  /**
   * How to align the the header title.
   * Defaults to `center` on iOS and `left` on Android.
   */
  headerTitleAlign?: "left" | "center";
  /**
   * Style object for the title component.
   */
  headerTitleStyle?: StyleProp<TextStyle>;
  /**
   * Whether header title font should scale to respect Text Size accessibility settings. Defaults to `false`.
   */
  headerTitleAllowFontScaling?: boolean;
  /**
   * Function which returns a React Element to display on the left side of the header.
   */
  headerLeft?: (props: { tintColor?: string }) => React.ReactNode;
  /**
   * Accessibility label for the header left button.
   */
  headerLeftAccessibilityLabel?: string;
  /**
   * Function which returns a React Element to display on the right side of the header.
   */
  headerRight?: (props: { tintColor?: string }) => React.ReactNode;
  /**
   * Color for material ripple (Android >= 5.0 only).
   */
  headerPressColorAndroid?: string;
  /**
   * Tint color for the header.
   */
  headerTintColor?: string;
  /**
   * Style object for the header. You can specify a custom background color here, for example.
   */
  headerStyle?: StyleProp<ViewStyle>;
  /**
   * Extra padding to add at the top of header to account for translucent status bar.
   * By default, it uses the top value from the safe area insets of the device.
   * Pass 0 or a custom value to disable the default behaviour, and customize the height.
   */
  headerStatusBarHeight?: number;

  /**
   * Title text for the screen.
   */
  title?: string;

  /**
   * Function that given `HeaderProps` returns a React Element to display as a header.
   */
  header?: (props: SwitchHeaderProps) => React.ReactNode;

  /**
   * Whether to show the header. The header is not shown by default.
   * Setting this to `true` shows the header.
   */
  headerShown?: boolean;

  /**
   * Title string of a screen displayed in the drawer
   * or a function that given { focused: boolean, color: string } returns a React.Node
   * When undefined, scene title is used.
   */
  drawerLabel?:
    | string
    | ((props: { color: string; focused: boolean }) => React.ReactNode);

  /**
   * A function that given { focused: boolean, color: string } returns a React.Node to display an icon the drawer.
   */
  drawerIcon?: (props: {
    color: string;
    size: number;
    focused: boolean;
  }) => React.ReactNode;

  /**
   * Whether you can use gestures to open or close the drawer.
   * Setting this to `false` disables swipe gestures as well as tap on overlay to close.
   * See `swipeEnabled` to disable only the swipe gesture.
   * Defaults to `true`.
   * Not supported on Web.
   */
  gestureEnabled?: boolean;

  /**
   * Whether you can use swipe gestures to open or close the drawer.
   * Defaults to `true`.
   * Not supported on Web.
   */
  swipeEnabled?: boolean;

  /**
   * Whether this screen should be unmounted when navigating away from it.
   * Defaults to `false`.
   */
  unmountOnBlur?: boolean;
};

type SwitchHeaderProps = {
  /**
   * Layout of the screen.
   */
  layout: Layout;
  /**
   * Object representing the current scene, such as the route object and descriptor.
   */
  scene: {
    route: Route<string>;
    descriptor: Descriptor<any, any, any>;
  };
};

function Header(props: SwitchHeaderProps) {
  const { scene, layout } = props;
  const { route, descriptor } = scene;
  const { name } = route;
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const {
    title,
    headerTitle,
    headerTitleAlign = Platform.select({
      ios: "center",
      default: "left",
    }),
    headerLeft,
    headerLeftAccessibilityLabel,
    headerRight,
    headerTitleAllowFontScaling,
    headerTitleStyle,
    headerTintColor,
    headerPressColorAndroid,
    headerStyle,
    headerStatusBarHeight = insets.top,
  } = descriptor.options;

  const currentTitle =
    typeof headerTitle !== "function" && headerTitle !== undefined
      ? headerTitle
      : title !== undefined
      ? title
      : scene.route.name;

  const defaultHeight = getDefaultHeaderHeight(layout, headerStatusBarHeight);

  const leftButton = headerLeft
    ? headerLeft({ tintColor: headerTintColor })
    : null;

  const rightButton = headerRight
    ? headerRight({ tintColor: headerTintColor })
    : null;

  return (
    <View
      pointerEvents="box-none"
      style={[
        {
          height: defaultHeight,
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
          shadowColor: colors.border,
        },
        styles.container,
        headerStyle,
      ]}
    >
      <View pointerEvents="none" style={{ height: headerStatusBarHeight }} />

      <View pointerEvents="box-none" style={styles.content}>
        {leftButton ? (
          <View
            pointerEvents="box-none"
            style={[styles.left, { left: insets.left }]}
          >
            {leftButton}
          </View>
        ) : null}
        <View
          pointerEvents="box-none"
          style={[
            headerTitleAlign === "left"
              ? {
                  position: "absolute",
                  left: (leftButton ? 72 : 16) + insets.left,
                  right: (rightButton ? 72 : 16) + insets.right,
                }
              : {
                  marginHorizontal:
                    (leftButton ? 32 : 16) +
                    Math.max(insets.left, insets.right),
                },
          ]}
        >
          {typeof headerTitle === "function" ? (
            headerTitle({
              children: currentTitle,
              allowFontScaling: headerTitleAllowFontScaling,
              tintColor: headerTintColor,
              style: headerTitleStyle,
            })
          ) : (
            <Text
              accessibilityRole="header"
              aria-level="1"
              numberOfLines={1}
              allowFontScaling={headerTitleAllowFontScaling}
              style={[
                styles.title,
                { color: headerTintColor ?? colors.text },
                styles.title,
                headerTitleStyle,
              ]}
            >
              {currentTitle}
            </Text>
          )}
        </View>
        {rightButton ? (
          <View
            pointerEvents="box-none"
            style={[styles.right, { right: insets.right }]}
          >
            {rightButton}
          </View>
        ) : null}
      </View>
    </View>
  );
}

function SwitchNavigator(props: {
  initialRouteName: string;
  children: any;
  screenOptions: any;
}): JSX.Element {
  const { children, screenOptions, initialRouteName } = props;
  const { state, navigation, descriptors } = useNavigationBuilder(TabRouter, {
    children,
    screenOptions,
    initialRouteName,
  });
  const dimensions = useWindowDimensions();

  return (
    <NavigationHelpersContext.Provider value={navigation}>
      <View style={[{ flex: 1 }]}>
        {state.routes.map((route, i) => {
          const descriptor = descriptors[route.key];
          const {
            header = (props: any) => <Header {...props} />,
            headerShown = false,
          } = descriptor.options;

          return (
            <View
              key={route.key}
              style={[
                StyleSheet.absoluteFill,
                { display: i === state.index ? "flex" : "none" },
              ]}
            >
              {headerShown ? (
                <NavigationContext.Provider value={descriptor.navigation}>
                  <NavigationRouteContext.Provider value={route}>
                    {header({
                      layout: dimensions,
                      scene: { route, descriptor },
                    })}
                  </NavigationRouteContext.Provider>
                </NavigationContext.Provider>
              ) : null}

              {descriptor.render()}
            </View>
          );
        })}
      </View>
    </NavigationHelpersContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowOpacity: 0.85,
        shadowRadius: 0,
        shadowOffset: {
          width: 0,
          height: StyleSheet.hairlineWidth,
        },
      },
      default: {
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
    }),
    zIndex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: Platform.select({
    ios: {
      fontSize: 17,
      fontWeight: "600",
    },
    android: {
      fontSize: 20,
      fontFamily: "sans-serif-medium",
      fontWeight: "normal",
    },
    default: {
      fontSize: 18,
      fontWeight: "500",
    },
  }),
  icon: {
    height: 24,
    width: 24,
    margin: 3,
    resizeMode: "contain",
  },
  touchable: {
    marginHorizontal: 11,
  },
  left: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  right: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "flex-end",
  },
});

export const createSwitchNavigator = createNavigatorFactory(SwitchNavigator);
