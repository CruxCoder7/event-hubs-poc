import {
    EventHubProducerClient,

} from '@azure/event-hubs';
import { DefaultAzureCredential } from '@azure/identity';

const credentials = new DefaultAzureCredential();

const eventHubsResourceName = 'test-akash';
const fullyQualifiedNamespace = `${eventHubsResourceName}.servicebus.windows.net`;
const eventHubName = 'test-kafka';

async function main() {
    const producer = new EventHubProducerClient(
        fullyQualifiedNamespace,
        eventHubName,
        credentials,
    );

    const batch = await producer.createBatch();
    batch.tryAdd({ body: 'wwe1' });
    batch.tryAdd({ body: 'wwe2' });
    batch.tryAdd({ body: 'wwe3' });

    await producer.sendBatch(batch);

    await producer.close();
    console.log('A batch of three events have been sent to the event hub');
}

main().catch((err) => {
    console.log('Error occurred: ', err);
});