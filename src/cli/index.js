import { description, program } from "commander";
import { getProviders, getCfSchema } from "../typescript/app-sync-gql-schema";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

program
	.command("dump <source> <destination>")
	.action((source, destination) => {
		// dump schema
		const fromRoot = (dir) => join(__dirname, "../../", dir);
		const schemaText = readFileSync(fromRoot(source),'utf8');
		const providers = getProviders();
		const cfSchema = getCfSchema(schemaText, providers);
		writeFileSync(
			fromRoot(destination),
			JSON.stringify(cfSchema, null, 2),
			"utf8",
		);
		console.info(`File written to ${fromRoot(destination)}`);
	});
    program.parse(process.argv);
