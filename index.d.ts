/**
 * Most of codes are copied from https://github.com/react-navigation/react-navigation
 */
/// <reference types="react" />
import type { ParamListBase, TabNavigationState, TabRouterOptions } from "@react-navigation/native";
export declare type Layout = {
    width: number;
    height: number;
};
export declare const getDefaultHeaderHeight: (layout: Layout, statusBarHeight: number) => number;
export declare type SwitchNavigationState<ParamList extends ParamListBase> = Omit<TabNavigationState<ParamList>, "type" | "history"> & {
    /**
     * Type of the router, in this case, it's switch.
     */
    type: "switch";
    /**
     * List of previously visited route keys and switch open status.
     */
    history: ({
        type: "route";
        key: string;
    } | {
        type: "switch";
    })[];
};
export declare type SwitchNavigationOptions = TabRouterOptions;
declare function SwitchNavigator(props: {
    initialRouteName: string;
    children: any;
    screenOptions: any;
}): JSX.Element;
export declare const createSwitchNavigator: <ParamList extends Record<string, object | undefined>>() => import("@react-navigation/native").TypedNavigator<ParamList, Readonly<{
    key: string;
    index: number;
    routeNames: string[];
    history?: unknown[] | undefined;
    routes: (Readonly<{
        key: string; /**
         * Whether title font should scale to respect Text Size accessibility settings.
         */
        name: string;
    }> & Readonly<{
        params?: Readonly<object | undefined>;
    }> & {
        state?: Readonly<any> | import("@react-navigation/native").PartialState<Readonly<any>> | undefined;
    })[];
    type: string;
    stale: false;
}>, {}, import("@react-navigation/native").EventMapBase, typeof SwitchNavigator>;
export {};
