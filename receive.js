const { DefaultAzureCredential } = require('@azure/identity');
const {
  EventHubConsumerClient,
  earliestEventPosition,
  latestEventPosition,
} = require('@azure/event-hubs');

const eventHubsResourceName = 'test-akash';
const fullyQualifiedNamespace = `${eventHubsResourceName}.servicebus.windows.net`;
const eventHubName = 'test-kafka';
const consumerGroup = '$Default';

const credential = new DefaultAzureCredential();

async function main() {
  const consumerClient = new EventHubConsumerClient(
    consumerGroup,
    fullyQualifiedNamespace,
    eventHubName,
    credential
  );

  const subscription = consumerClient.subscribe(
    {
      processEvents: async (events, context) => {
        if (events.length === 0) {
          console.log(
            `No events received within wait time. Waiting for next interval`
          );
          return;
        }

        for (const event of events) {
          console.log(
            `Received event: '${event.body}' from partition: '${context.partitionId}' 
            and consumer group: '${context.consumerGroup}'`
          );
        }
        await context.updateCheckpoint(events[events.length - 1]);
      },

      processError: async (err, context) => {
        console.log(`Error : ${err}`);
      },
    },
    { startPosition: earliestEventPosition }
  );

  await new Promise((resolve) => {
    setTimeout(async () => {
      await subscription.close();
      await consumerClient.close();
      resolve();
    }, 30000);
  });
}

main().catch((err) => {
  console.log('Error occurred: ', err);
});
