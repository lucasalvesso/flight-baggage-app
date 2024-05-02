import { DynamoDBClient, AttributeValue } from "@aws-sdk/client-dynamodb";
import { PutCommand, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export class Database<T> {
  private dynamodb: DynamoDBClient;
  private filters: Condition[];
  private keyConditions: Condition[];
  private item: T;
  tableName: string;

  constructor() {
    this.dynamodb = new DynamoDBClient({
      region: process.env.AWS_REGION,
      endpoint: process.env.DYNAMODB_ENDPOINT,
    });

    this.filters = [];
    this.keyConditions = [];
  }

  filter(filterExpression: string): Database<T> {
    const [attribute, operator, value] = filterExpression.split(" ");
    this.filters.push({ attribute, operator, value });
    return this;
  }

  query(queryExpression: string): Database<T> {
    const [attribute, operator, value] = queryExpression.split(" ");
    this.keyConditions.push({ attribute, operator, value });
    return this;
  }

  async execute(): Promise<T[] | undefined | void> {
    if (this.item) {
      return await this.executePutItem();
    }

    if (this.keyConditions.length > 0) {
      return await this.executeQuery();
    }

    return await this.executeScan();
  }

  scan(): Database<T> {
    return this;
  }

  private async executeScan(): Promise<any[]> {
    const params = {
      TableName: this.tableName,
      FilterExpression: this.generateFilterExpression(),
    };

    try {
      const command = new ScanCommand(params);
      const result = await this.dynamodb.send(command);
      return result.Items || [];
    } catch (error) {
      console.error("Error scanning DynamoDB table:", error);
      throw error;
    }
  }

  private async executeQuery(): Promise<any[]> {
    const params = {
      TableName: this.tableName,
      FilterExpression: this.generateFilterExpression(),
      KeyConditionExpression: this.generateKeyConditionExpression(),
    };

    try {
      const command = new QueryCommand(params);
      const result = await this.dynamodb.send(command);
      return (result.Items || []) as T[];
    } catch (error) {
      console.error("Error scanning DynamoDB table:", error);
      throw error;
    }
  }

  private generateFilterExpression(): string | undefined {
    if (this.filters.length === 0) return undefined;
    return this.filters
      .map(
        (filter) =>
          `${filter.attribute} ${filter.operator} :${filter.attribute}`,
      )
      .join(" AND ");
  }

  private generateKeyConditionExpression(): string | undefined {
    if (this.keyConditions.length === 0) return undefined;
    return this.keyConditions
      .map(
        (condition) =>
          `${condition.attribute} ${condition.operator} :${condition.attribute}`,
      )
      .join(" AND ");
  }

  putItem(entity: T): Database<T> {
    this.item = entity;
    return this;
  }

  private async executePutItem(): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: this.item as Record<string, AttributeValue>,
    };

    try {
      const command = new PutCommand(params);
      await this.dynamodb.send(command);
    } catch (error) {
      console.error("Error putting item into DynamoDB table:", error);
      throw error;
    }
  }
}

interface Condition {
  attribute: string;
  operator: string;
  value: string | number;
}
