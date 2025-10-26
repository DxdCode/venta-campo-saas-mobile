import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { RootNavigator } from './navigation/RootNavigator';
import { toastConfig } from './utils/toastConfig';
import '../../global.css';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <RootNavigator />
      <Toast config={toastConfig} />
    </>
  );
}