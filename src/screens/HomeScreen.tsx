import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
        <Text style={styles.text}>Welcome to the Home Screen</Text>
    <Button
    title="Go to Details"
    onPress={() => navigation.navigate('Details')}
    />
    </View>
);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'red',
        fontSize: 20,
        marginBottom: 20,
    },
});

export default HomeScreen;
