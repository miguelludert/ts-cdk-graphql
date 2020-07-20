import { join } from "path";
import { mkdirSync, writeFileSync } from "fs";
import { AppsyncGQLStack, getDynamoProps, readSchema } from "../../src";

const dynamoProps = getDynamoProps(readSchema(join(__dirname, "schema.gql")));
