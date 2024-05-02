import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class CreateTables {
  private tableNames = ["bases", "flights", "planes", "tickets"];
  private dynamodb: DynamoDBClient;

  constructor() {
    this.dynamodb = new DynamoDBClient({
      region: process.env.AWS_REGION,
      endpoint: process.env.DYNAMODB_ENDPOINT,
    });
  }

  async exec(): Promise<void> {
    for (const table of this.tableNames) {
      const command = new CreateTableCommand({
        BillingMode: "PAY_PER_REQUEST",
        TableName: table + `-${process.env.STAGE}`,
        KeySchema: [{ KeyType: "HASH", AttributeName: "id" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      });

      try {
        await this.dynamodb.send(command);
      } catch (e) {
        console.log(e);
      }
    }
  }
}

new CreateTables().exec().catch((e) => console.log(e));
