const kafka = require('./create-client')

const consumer = kafka.consumer({ groupId: 'market-1' })  // Remove partition: 2
const TOPIC = "market-data"

async function consumingTopics() {
    await consumer.connect();
    console.log("consumer connected ....")
    await consumer.subscribe({ topics: [TOPIC] })
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (partition == 0) {
                console.log({
                    partition,
                    key: message.key.toString(),
                    value: message.value.toString()
                })
            } else if (partition == 1) {
                console.log({
                    partition,
                    key: message.key.toString(),
                    value: message.value.toString()
                })
            }
        }
    })
}

process.on("SIGINT", () => {
    consumer.disconnect()
    console.log("consumer dissconnected")
})

consumingTopics();