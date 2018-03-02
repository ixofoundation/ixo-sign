import React, { Component } from "react";
import SideBar from "../SideBar/SideBar.js";
import { DrawerNavigator } from "react-navigation";
import ManageCredentialScreen from "../ManageCredentialScreen/ManageCredentialScreen.js";
import SigningScreen from "../SigningScreen/SigningScreen.js";

const Router = DrawerNavigator(
    {
      ManageCredentialScreen: { screen: ManageCredentialScreen },
      SigningScreen: { screen: SigningScreen }
    },
    {
        contentComponent: props => <SideBar {...props} />
    }
);
export default Router;