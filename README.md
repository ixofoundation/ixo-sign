# IXO Sign App

This app is built with [React Native](https://github.com/facebook/react-native).

## Getting Started

### System Requirements

Install the following prerequisites:

- [Node LTS](https://nodejs.org/) (currently 8.9.4)
- NPM v5.5.1
- [Android Studio](https://developer.android.com/studio)

Install the React Native CLI:

```
npm i -g react-native-cli
```

### Running the app

Clone the repository:

```
git clone https://github.com/ixofoundation/ixo-sign
```

In the cloned repo directory, run NPM install:

```
npm i
```

NPM install will generate a `shim.js` file, as well as patch up some Node dependencies from [`ixo-module`](https://github.com/ixofoundation/ixo-module) to work with React Native.

Start an Android emulator or connect a device. Start the app.

```
react-native run-android
```

## Sideload the bundled app

If you only want to sideload a debug build of this app, here are the instructions:

1. Edit `./android/app/build.gradle` to enable `bundleInDebug`.

```
project.ext.react = [
    entryFile: "index.js",
    bundleInDebug: true
]
```

2. Create the debug `.apk`.

```
cd ./android
./gradlew assembleDebug
```

3. Install the `.apk` with `adb`.

```
adb install app/build/outputs/apk/app-debug.apk
```

## Run the app on an alternate packager

It's likely that you'll want to run this app at the same time you're debugging another app (e.g., [IXO Mobile](https://github.com/ixofoundation/ixo-mobile)). In this case you may need to run the packager on a port other than 8081. Here are the instructions:

```
react-native start --port=8082
react-native run-android --no-packager --port=8082
```

When the app first starts, you're likely to get a red box exception. To resolve this exception, open the dev menu (`CMD+M` on Mac, `Menu` on Windows). Choose the `Dev Settings` option and change the `Debug server host & port for device` to `localhost:8082`.

There is a chance that you will run into a red box exception that says `unable to load script from assets index.android.bundle`. If this happens, run (from the top level project directory) the following 2 commands:
```
mkdir android/app/src/main/assets
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```
then, once more, run:
```
react-native run-android --no-packager --port=8082
```
More can be read at [this stackoverflow question](https://stackoverflow.com/questions/44446523/unable-to-load-script-from-assets-index-android-bundle-on-windows).
