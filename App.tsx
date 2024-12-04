/**
 * Sample React Native App
 * https://github.com/facebook/react-native

 *
 * @format
 */

import './src/local-storage.ts';
import 'react-native-url-polyfill/auto';

import 'fast-text-encoding';
import 'react-native-get-random-values';
import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
    Alert,
    Button, Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text, TextInput,
    useColorScheme,
    View,
} from 'react-native';

import {
    generateSecretKey,
    getPublicKey,
} from 'nostr-tools/pure';


import {TestClass} from './src/TestClass.ts';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
    title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
    // const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        // color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        // color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ]}>
                {children}
            </Text>
        </View>
    );
}

function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        // backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        backgroundColor: '#020202',
    };

    // function setText() {
    //     console.log(text);
    // }

    function myFunc(xz: Number) {
        // const ncurl = 'nostrconnect://7758c3c1cbd3b7ff47c1c483cbbf41d0afac3efebb611edb32fedb135b90e513?secret=csef85&url=http%3A%2F%2Flocalhost%3A1847&name=IZ+Collaborator&image=http%3A%2F%2Flocalhost%3A1847%2Fpwa-192x192.png&perms=sign_event%3A22242%2Cnip04_encrypt%2Cnip04_decrypt%2Cnip44_encrypt%2Cnip44_decrypt&relay=wss%3A%2F%2Frelay.lxc%2F';

        console.log('xxxxxxsssss' + text);

        console.log('Hello' + xz);
        const tc = new TestClass('xxxxx');
        tc.xxxxeee(text);
        console.log(tc.name);

        let sk = generateSecretKey(); // `sk` is a Uint8Array
        let pk = getPublicKey(sk); // `pk` is a hex string
        console.log(pk);
    }

    // let text = 'Hello';
    const [text, setText] = useState<string>('');

    // const onSuccess = (e: any) => {
    //     Alert.alert("QR Code Scanned", e.data, [
    //         { text: "OK", onPress: () => console.log("Scanned data:", e.data) },
    //     ]);
    // };

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                //        backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>
                {/*<Header />*/}
                <View style={styles.container}>

                    <Image style={styles.logo} resizeMode="contain"
                           source={require('./assets/logo-only-1000.png')}/>

                    <Section title="Login">
                        Enter the nostrconnect link below:
                    </Section>

                    <TextInput
                        style={styles.input}
                        placeholder="Type here"
                        value={text}
                        onChangeText={setText}/>

                    <Button title={'Login'} onPress={() => {
                        myFunc(190);
                    }}/>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    logo: {
        flex: 1,
        justifyContent: 'center',
        width: 200,
        height: 200,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        color: '#ffffff',
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: '#4e5',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#0f0f0f',
        color: '#ffffff',
    }, container: {
        backgroundColor: '#0f0f0f',
        flex: 1,
        justifyContent: 'center',
    },
    centerText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 16,
        color: '#007AFF',
        textAlign: 'center',
    },
});

export default App;
