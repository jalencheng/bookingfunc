import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Image, FlatList} from 'react-native';
import Constants from 'expo-constants';
import LogoSvg from '../components/logoSvg'
import CityItem from '../components/CityItem'
import headerImage from '../../assets/header.png'
import { FontAwesome5 } from '@expo/vector-icons'
import { connect } from 'react-redux';
import TripInfo from '../components/TripInfo'
import { SetOriginTripId, SetReturnTripId } from '../actions/TripActions'
import { ScrollView } from 'react-native-gesture-handler';


const Months = ['January','February', 'March', 'April', 'May','June','July','August','September','Octobre','November','December'];

const FormatDate = (date) => {
    const day = date.getDate()
    const month = Months[date.getMonth()]
    const year = date.getFullYear()
    
    return `${day}  ${month}  ${year}`
}

function SelectScheduleScreen ( props ) {
  const { navigation } = props;
  const { TripType } = props.route.params
  const [ tripData, setTripData ] = useState([])


  const tripSegments = () => {
    fetch('https://run.mocky.io/v3/012f4ea3-2ecc-47c3-8181-1f25dd8c62a2')
    .then((response) => response.json())
    .then((json) => {
      setTripData(json.data.tripSegments[0])
    })
    .catch((error) => console.error(error))
  }

  useEffect( () => {
    tripSegments()
}, []);

const renderItem = ({ item }) => (
  <TripInfo {...item} onPress={() => {
    if (props.round == true && TripType == 'Departure') {
      props.SetOriginTripId(item.id)
      navigation.push('SelectScheduleScreen', {
        TripType: 'Arrival'
      })
    } else {
      if (props.round == true && TripType == 'Arrival') {
        props.SetReturnTripId(item.id)
        navigation.push('PassangerData')
      }
    }
    if (props.round == false) {
      props.SetOriginTripId(item.id)
      navigation.push('PassangerData')
    }
     
    }}
  />
);

    return (
        <View>
            <View style={styles.scheduleHeader}>
                <Text style={styles.headerText}>{TripType == 'Departure' ? 'Depart Trip' : 'Return Trip'}</Text>
                <View style={styles.destinations}>
                    <View style={styles.centerText}>
                      <Text style={styles.destinationText}>{TripType == 'Departure' ? props.originPoint.cityName : props.destinationPoint.cityName}</Text>
                      <Text style={styles.destinationSubText}>{TripType == 'Departure'? props.originPoint.name : props.destinationPoint.name}</Text>
                    </View>
                    <FontAwesome5 name="arrow-right" size={20} color="white" />
                    <View style={styles.centerText}>
                      <Text style={styles.destinationText}>{TripType == 'Departure' ? props.destinationPoint.cityName : props.originPoint.cityName}</Text>
                      <Text style={styles.destinationSubText}>{TripType == 'Departure' ? props.destinationPoint.name:  props.originPoint.name }</Text>
                    </View>
                </View>
                <Text style={styles.dateText}>{TripType == 'Departure' ? `Date: ${FormatDate(props.startDate)}` : `Date: ${FormatDate(props.endDate)}`}</Text>
            </View>
            <FlatList contentContainerStyle={styles.listComponent}
            data={tripData}
            renderItem={renderItem}
            keyExtractor={item => item.name}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    scheduleHeader: {
        paddingTop: Constants.statusBarHeight,
        paddingLeft: 20,
        height: 245,
        backgroundColor: '#5107E9'
      },
      scheduleImage: {
        position: "absolute",
        top: -5,
        left:200,
        height: 160,
        width: 220,
        zIndex: -1
      },
      headerText: {
        marginTop: 34,
        width: 250,
        color: '#FFFFFF',
        fontSize: 22,
        fontFamily: 'Roboto-Bold'
      },
      destinations:{
          marginTop: 18,
          flexDirection:'row',
          justifyContent: 'space-between',
          marginRight: 10
      },
      destinationText: {
          color: '#FFFFFF',
          fontFamily: 'Roboto-Medium',
          fontSize: 16
      },
      destinationSubText: {
        color: '#2B1E5F',
          fontFamily: 'Roboto-Medium',
          fontSize: 15
      },
      dateText: {
        marginTop: 10,
        color: '#FFFFFF',
        fontFamily: 'Roboto-Medium',
        fontSize: 16
      },
      centerText: {
        justifyContent: 'center',
        alignItems: 'center'
      },
      listComponent: {
        backgroundColor: '#F8F9FB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
      }
        

})

const mapStateToProps = (state) => {
    return {
      round: state.tripReducer.roundTrip,
      originPoint: state.tripReducer.originPoint,
      destinationPoint: state.tripReducer.destinationPoint,
      startDate: state.tripReducer.startDate,
      endDate: state.tripReducer.endDate,
      startTripId: state.tripReducer.startTripId,
      returnTripId: state.tripReducer.returnTripId
    }
  };

  const mapDispatchToProps = (dispatch) => {
    return {
      SetOriginTripId: (id) => dispatch(SetOriginTripId(id)),
      SetReturnTripId: (id) => dispatch(SetReturnTripId(id))
    }
  };

export default connect(mapStateToProps, mapDispatchToProps)(SelectScheduleScreen);