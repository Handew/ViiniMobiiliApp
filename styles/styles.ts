import { Platform, StyleSheet, Dimensions } from "react-native";

const { width: winWidth, height: winHeight } = Dimensions.get('window')

const styles = StyleSheet.create({

    //Pääohjelman tyylit
    mainWrapper: {
        paddingTop: 40,
        flex: 1, 
        backgroundColor: '#f6f6f6',
    },
    topSection: {
        flexDirection: 'row', 
        justifyContent:'space-between',
        backgroundColor: '#fff', 
        padding: 20,
    },
    pickerSection: {
        flexDirection: 'row', 
        justifyContent:'center',
        backgroundColor: '#fff', 
        padding: 0,
        borderColor: 'gray',
        borderWidth: 1,
    },
    centerSection: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerElement: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    wineContainer: {
            flexDirection: 'row',
            padding: 20,
            marginBottom: 2,
            height: 120,
            borderTopWidth: 1,
            borderTopColor: '#ccc'
    },
    scrollView: {
        width: '100%',
        marginVertical: 10,
      },

    //Edit, Create, Delete -tyylimääritykset
    inputContainer: {
        flex: 1,
        justifyContent: "space-between",
        margin: 5,
        backgroundColor: "white",
        borderRadius: 30,
        padding: 10,
        elevation: 10,
    },

    inputContainerTest: {
        flex: 1,
        backgroundColor: '#f6f6f6',
        width: '100%',
        paddingTop: 23,
        height: 'auto',
    },
    inputHeaderTitle: {
        margin: 15,
        fontWeight: 'bold',
        fontSize: 24,
    },
    inputTitle: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        fontWeight: 'bold',
    },
    editInput: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        height: 40,
        borderBottomColor: '#3AC730',
        // borderColor: '#3AC730',
        borderBottomWidth: 1,
        // borderWidth: 1,
        padding: 5,
        color: '#6b6565',
    },
    inactiveField: {
        marginLeft: 10,
        marginRight: 10,
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        padding: 5,
        color: 'gray',
    },

    submitButton: {
        backgroundColor: '#3AC730',
        padding: 10,
        margin: 15,
        height: 40,
        borderRadius: 10
    },
    submitButtonText: {
        color: 'white',
        textAlign: 'center'
    },

    validationError: {
        color: 'red',
        marginLeft: 15,
    },

    //MODAL -tyylimääritykset
    centeredView: {
        flex: 1,
        justifyContent: "space-between",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalContainer: {
        display: Platform.OS === 'web' ? 'none' : undefined,
        position: Platform.OS === 'web' ? 'relative' : undefined,
        width: Platform.OS === 'web' ? '100%' : undefined,
        height: Platform.OS === 'web' ? '100%' : undefined,
        zIndex: Platform.OS === 'web' ? 1 : undefined,
        backgroundColor: 'transparent',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 8,
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
    },
    modalTextTitle: {
        marginBottom: 15,
        fontWeight: 'bold',
    },
    modalInfo: {
        flexDirection: 'row',
        justifyContent: "space-between",
    },

    // KAMERA
    preview: {
        height: winHeight,
        width: winWidth,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    alignCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomToolbar: {
        width: winWidth,
        position: 'absolute',
        height: 100,
        bottom: 0,
    },
    captureBtn: {
        width: 60,
        height: 60,
        borderWidth: 2,
        borderRadius: 60,
        borderColor: "#FFFFFF",
    },
    captureBtnActive: {
        width: 80,
        height: 80,
    },
    captureBtnInternal: {
        width: 76,
        height: 76,
        borderWidth: 2,
        borderRadius: 76,
        backgroundColor: "red",
        borderColor: "transparent",
    },
    galleryContainer: { 
        bottom: 100 
    },
    galleryImageContainer: { 
        width: 75, 
        height: 75, 
        marginRight: 5 
    },
    galleryImage: { 
        width: 75, 
        height: 75 
    },  
    capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
    },

});

export default styles;