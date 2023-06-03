import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Image, Button, Modal, Pressable, Alert, Dimensions } from 'react-native';
/*mport { db } from '../config/config_bbdd';
import { collection, onSnapshot, query, where } from 'firebase/firestore';*/
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';


const Detail = ({ navigation, route }) => {
  const [actor, setActor] = useState([]);
  const [actorIsLoaded, setActorIsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSetActor = (obj) => {
    setActor(obj[0])
    setActorIsLoaded(true)
  }

  useEffect(() => {
    firestore()
    .collection('actores')
    .where('id', '==', route.params.id)
    .get()
    .then(querySnapshot => {
      handleSetActor(
        querySnapshot.docs.map(doc => ({
          id: doc.id,
          nombre: doc.data().nombre,
          clip: doc.data().clip,
          edad: doc.data().edad,
          imagen: doc.data().imagen,
          nacionalidad: doc.data().nacionalidad,
          nacionalidad: doc.data().nacionalidad,
          vivo: doc.data().vivo,
        })))
    });
  }, [])


  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Message on details')
      firestore()
      .collection('actores')
      .where('id', '==', route.params.id)
      .get()
      .then(querySnapshot => {
        handleSetActor(
          querySnapshot.docs.map(doc => ({
            id: doc.id,
            nombre: doc.data().nombre,
            clip: doc.data().clip,
            edad: doc.data().edad,
            imagen: doc.data().imagen,
            nacionalidad: doc.data().nacionalidad,
            nacionalidad: doc.data().nacionalidad,
            vivo: doc.data().vivo,
        })))
    })
    });
  }, [])

  return (
    !actorIsLoaded ? <Text>Loading actor....</Text> :
      <SafeAreaView style={[styles.container, styles.centeredView]}>
        <Text style={styles.title}> Nombre: {actor.nombre}</Text>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.imageActor}
            source={{ uri: actor.imagen }}
            onClick={() => setModalVisible(!modalVisible)}
          />
        </View>
        <Text style={styles.title}> Edad: {actor.edad}</Text>
        <Text style={styles.title}> Nacionalidad: {actor.nacionalidad}</Text>
        <Text style={styles.title}> ¿Está vivo?: {`${actor.vivo ? "Sí" : "No"}`}</Text>
        <View style={styles.buttonsWrapper}>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => navigation.navigate('Player', { nombre: actor.nombre })}>
            <Text style={styles.textStyle}>Ver multimedia</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.textStyle}>Ver Imagen</Text>
          </Pressable>
        </View>
        <Pressable
            style={[styles.button ]}
            onPress={ ()=> navigation.navigate('Home')}>
            <Text style={styles.textStyle}>Atras</Text>
        </Pressable>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}  >
              <View style={styles.buttonCloseWrapper} >
                <Pressable
                  style={[styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Icon name={'close'} color="#E1E1E1" />
                </Pressable>
              </View>
              <Image
                style={styles.imageModal}
                source={{ uri: actor.imagen }}
              />
            
            </View>
          </View>
        </Modal>
      </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    backgroundColor: "#1F1F1F",

  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  title: {
    fontSize: 17,
    color: "#E1E1E1",
    marginTop: 10,
    textAlign: 'center',
  },
  imageWrapper: {
    padding: 10
  },
  imageActor: {
    width: 250,
    height: 300
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  buttonsWrapper: {
    width: 400,
    display: "flex",
    flexDirection: "row",
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 150,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonCloseWrapper: {
    width: 32,
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 10
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageModal: {
    marginBottom: 15,
    textAlign: 'center',
    width: "100%",
    height: "100%"
  },
})

export default Detail;