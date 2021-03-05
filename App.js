import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, StatusBar, StyleSheet, ScrollView, RefreshControl, Button, SafeAreaView, TouchableOpacity } from 'react-native';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const Item = ({ item, onPress, style, text }) => (
  <View>
  <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
    <Text style={styles.title}>{item.name}</Text>
  </TouchableOpacity>
  <Text style={styles.text}>{text}</Text>
  </View>
);

export default function App() {
  const [data, setData] = useState([]);
  const [cards, setCards] = useState([]);
  const [balance, setBalance] = useState([]);
  const [power, setPower] = useState([]);
  const [ethbalance, setethBalance] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [hiden, hidexd] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

useEffect(() => {
  fetch('http://192.168.100.20:4067/summary')
    .then((response) => response.json())
    .then((json) => {
      fetch('https://www.sparkpool.com/v1/bill/stats?currency=ETH&miner=sp_applelol')
        .then((response1) => response1.json())
        .then((json1) => {
          fetch('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=ETH&to_currency=EUR&apikey=E5BVOHG28AQZ4MWZ')
            .then((response2) => response2.json())
            .then((json2) => {
              setBalance(parseFloat(json2["Realtime Currency Exchange Rate"]["5. Exchange Rate"]) * parseFloat(json1.data.balance))
              setethBalance(parseFloat(json1.data.balance))
              setCards(json.gpus)
              setData(json)
              let xdd = 0;
              json.gpus.forEach((item, i) => {
                xdd += item.power;
                setPower(xdd)
              });
            })
        })
    })
    .catch((error) => console.error(error))
}, []);
const onRefresh = React.useCallback(() => {
  fetch('http://192.168.100.20:4067/summary')
    .then((response) => response.json())
    .then((json) => {
      fetch('https://www.sparkpool.com/v1/bill/stats?currency=ETH&miner=sp_applelol')
        .then((response1) => response1.json())
        .then((json1) => {
          fetch('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=ETH&to_currency=EUR&apikey=E5BVOHG28AQZ4MWZ')
            .then((response2) => response2.json())
            .then((json2) => {
              setBalance(parseFloat(json2["Realtime Currency Exchange Rate"]["5. Exchange Rate"]) * parseFloat(json1.data.balance))
              setethBalance(parseFloat(json1.data.balance))
              setCards(json.gpus)
              setData(json)
              let xdd = 0;
              json.gpus.forEach((item, i) => {
                xdd += item.power;
                setPower(xdd)
              });
            })
        })
    })
    .catch((error) => console.error(error))
  setRefreshing(true);
  wait(1000).then(() => setRefreshing(false));
}, []);


  const renderItem = ({ item }) => {
    const backgroundColor = item.uuid === selectedId ? "#c377e0" : "#bca0dc";
    let extraText;
    if (item.uuid === selectedId) {
      data.gpus.forEach((itemm, i) => {
        if (itemm.uuid == item.uuid) {
          let xd = data.stat_by_gpu[i];
          extraText = `accepted shares: ${xd.accepted_count}`
        }
      });
    } else extraText = "";
    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.uuid)}
        style={{ backgroundColor }}
        text={`hashrate: ${String(item.hashrate/1000000).substring(0,5)}MH/s, power: ${item.power}W, temp: ${item.temperature}, fan speed: ${item.fan_speed}% ${extraText}`}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
    <Text style={styles.header}>Total hashrate: {String(data.hashrate/1000000).substring(0,5)}MH/s{"\n"}Power: {power}W{"\n"}Balance: {ethbalance} ETH [{balance.toString().substring(0,5)}€]</Text>
      <FlatList
        data={cards}
        renderItem={renderItem}
        keyExtractor={({ id }, index) => id}
        extraData={selectedId}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: 'black'
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    // paddingBottom: 30
  },
  text: {
    paddingLeft: 20,
    color: "white"
  },
  header: {
    paddingLeft: 20,
    paddingBottom:10,
    paddingTop: 10,
    fontSize:20,
    color: "white"
  },
  title: {
    fontSize: 32,
  },
});



// const Item = ({ title }) => (
//   <View style={styles.item}>
//     <Text style={styles.title}>{title}</Text>
//   </View>
// );
