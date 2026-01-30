const {Kafka} = require('kafkajs')

const kafka = new Kafka({
    clientId:'my-app',
    brokers:['localhost:9092'],
    retry: {
    initialRetryTime: 2000,
    retries: 8
  }
})

module.exports = kafka