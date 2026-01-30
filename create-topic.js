const kafka = require('./create-client')

const admin = kafka.admin()

const TOPIC_CONFIG = {
    topic: "market-data",
    numPartitions: 2,
    replicationFactor: 1,
    configEntries: [
        {
            name: 'retention.ms',
            value: '86400000'    // 24 hours retention
        },
        {
            name: 'cleanup.policy',
            value: 'delete'
        }
    ]
}

async function createTopic() {
    try {
        await admin.connect()
        console.log("admin conected")
        let alreadExist = await admin.listTopics();
        if (alreadExist.includes(TOPIC_CONFIG.topic)) {
            console.log("Topic Already existed");
        }
        else {
            console.log("creating TOpic")
            await admin.createTopics({ topics: [TOPIC_CONFIG] })
            let topic = await admin.listTopics()
            console.log("Topic Created",topic)
        }
    }
    catch (err) {
        console.log("error happend", err)
    }
    finally {
        admin.disconnect()
    }
}
createTopic()





