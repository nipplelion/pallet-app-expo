import React, { useState } from 'react';

import { View, StyleSheet, Image, Alert, ScrollView } from "react-native";

import TextInput from '../components/TextInput.js';
import Button from '../components/Button.js';

import { database } from "../firebaseConfig.js"
import { ref, child, set, get, remove } from "firebase/database";



function palletExists(barcode) {
    return get(child(ref(database), `barcodes/${barcode}`)).then((snapshot) => {
        if (snapshot.exists()) {
          console.log("Item exists.");
          return snapshot.val();
        } else {
          console.log("Item does not exist.");
          return false;
        }
    }).catch((error) => {
        console.error(error);
        return false;
    });
}

const CalculateScreen = ({ route, navigation }) => {
    const [ barcode, setBarcode ] = useState((route.params.barcode) ? route.params.barcode : "" )
    const [ currUser, setCurrUser ] = useState((route.params.currUser) ? route.params.currUser : "");

    return(
        <ScrollView>
            <View style={styles.container}>
                <View>
                    <TextInput 
                        title="Barcode No." 
                        placeholder="Enter a barcode number"
                        value={ barcode }
                        onChangeText={(text) => {
                                setBarcode(text)
                            }
                        }   
                    />
                    <Button 
                        text="CALCULATE" 
                        style={ styles.button }
                        onPress={ () => {
                                if (barcode) {
                                    palletExists(barcode).then((result) => {
                                        if (result) {
                                            navigation.navigate('Results', {
                                                currUser: currUser,
                                                dimensions: {
                                                    length: Math.ceil(parseFloat(result.length)),
                                                    width: Math.ceil(parseFloat(result.width)),
                                                    height: Math.ceil(parseFloat(result.height))
                                                }
                    
                                            })
                                        }
                                        else {
                                            Alert.alert(
                                                "Barcode doesn't exist.", 
                                                "Please scan another barcode or contact your supervisor.",
                                            )
                                        }
                                    });
                                }
                                else {
                                    Alert.alert("Invalid Field.", "Please enter a valid barcode.")
                                }
                                
                            }
                        }
                    />
                </View>
                
                
                <Image
                    style={ styles.box } 
                    source={require('../assets/box.png')}/>

                <Button 
                    text="SCAN AGAIN" 
                    style={ styles.button }
                    onPress={ () => { 
                        console.log("Curr user: " + currUser)
                        navigation.navigate('Barcode', { currUser: currUser }) 
                    }}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    box: {
        height: 300,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    button: {
        marginTop: 15
    }
});

export default CalculateScreen;