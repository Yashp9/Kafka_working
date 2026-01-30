console.log("bitget market data")
const kafka = require('./create-client')
const { Partitioners } = require('kafkajs')
const websocket = require('ws')
const crypto = require('crypto');
const { json } = require('stream/consumers');
const { Console } = require('console');

const publicBitgetServer = 'wss://ws.bitget.com/v2/ws/public';
const baseUrl = 'https://api.bitget.com';
const TOPIC = ["market-data"]
const wsInstance = new websocket(publicBitgetServer)

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner

})

let tickerData = null;
let candledata = null;

wsInstance.onopen = () => {
    console.log("websoket connectd")
    const subscribemsg = {
        "op": "subscribe",
        "args": [
            {
                "instType": "SPOT",
                "channel": "ticker",
                "instId": "ETHUSDT"
            }
        ]
    }
    const subscribeCandle = {
        "op": "subscribe",
        "args": [
            {
                "instType": "SPOT",
                "channel": "candle1m",
                "instId": "ETHUSDT"
            }
        ]
    }
    wsInstance.send(JSON.stringify(subscribemsg))
    wsInstance.send(JSON.stringify(subscribeCandle))
}



async function startProducer() {
    try {
        await producer.connect()
        console.log("producer connected")
        wsInstance.onmessage = (event) => {
            let socketData = JSON.parse(event.data);
            if (socketData?.arg?.channel == 'ticker') {
                tickerData = socketData
                // console.log("usdKJCJASVXHCJVHJVXhjzvHJV")
            }
            if (socketData?.arg?.channel == 'candle1m') {
                candledata = socketData
                // console.log("djglvAJCBJVDHBCJASKJFGHDAJKFLVJDVLAJ")
            }

            // console.log("8888888888888888888888888888888888888888888888888888888")
            // console.log(socketData)
        }
        setInterval(() => {
            if (tickerData?.data != undefined && tickerData?.data != null) {
                producer.send({
                    topic: TOPIC[0],
                    messages: [{
                        partition: 0,
                        key: 'ETHUSDT-ticker',
                        value: JSON.stringify(tickerData.data)
                    }]
                })
                console.log("ticker data send -> ", tickerData.data)
            }
            if (candledata?.data != undefined && candledata?.data != null) {
                producer.send({
                    topic: TOPIC[0],
                    messages: [{
                        partition: 1,
                        key: 'ETHUSDT-candle',
                        value: JSON.stringify(candledata.data)
                    }]
                })
                console.log("candle data send -> ", candledata.data)  // Changed from tickerData to candledata
            }
        }, 1000)
        wsInstance.onerror = (err) => {
            throw new Error(err.message)
        }
        wsInstance.onclose = async () => {
            console.log("WebSocket closed");
            console.log('\n🛑 Shutting down producer...');
            await stoptProducer();
        };

    } catch (error) {
        console.log('error occured -> ', error)
    }

}



const stoptProducer = async function () {
    await producer.disconnect()
}

process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down producer...');
    await stoptProducer()
    process.exit(0);
});

startProducer();


