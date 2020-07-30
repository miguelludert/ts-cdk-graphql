import { omit } from "ramda";
import { getDefaultNames, getDefault } from "./utils";
import { getLambdaDataSources } from "./lambda";
import { getDynamoDataSources } from "./dynamo";
import { getCodeGenSchema } from "./index";
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname, basename } from "path";

export const mkdir = name => {
	mkdirSync(name, { recursive: true });
	return name;
};

export const writeFile = (name, text) => {
	mkdirSync(dirname(name), { recursive: true });
	writeFileSync(name, text, "utf8");
	return name;
};

export const writeJson = (name, obj) =>
	writeFile(name, JSON.stringify(obj, null, 2));

export const dump = (options, schemaText) => {
	const { dumpDir } = options;
	const defaultDir = `${dumpDir}/defaults`;
	const dynamoProps = `${dumpDir}/dynamo-props`;
	const functionProps = `${dumpDir}/function-props`;
	const dynamoResolvers = `${dumpDir}/dynamo-resolvers`;
	const functionResolvers = `${dumpDir}/function-resolvers`;
	const codegen = getCodeGenSchema(options, schemaText);
	const dynamoDataSources = getDynamoDataSources(options, codegen);
	const functionDataSources = getLambdaDataSources(options, codegen);

	writeJson(`${dumpDir}/codegen.json`, codegen);
	writeFile(`${dumpDir}/schema.gql`, codegen.schema);
	getDefaultNames().forEach(name => {
		writeJson(join(defaultDir, `${name}.json`), getDefault(name));
	});

	dynamoDataSources.forEach(datasource => {
		const { dataSourceName } = datasource;
		const toWrite = omit(["resolverProps"], datasource);
		writeJson(join(dynamoProps, `${dataSourceName}.json`), toWrite);

		const { resolverProps } = datasource;
		resolverProps.forEach(prop => {
			const {
				typeName,
				fieldName,
				requestMappingTemplate,
				responseMappingTemplate,
			} = prop;
			const fileName = `${typeName}.${fieldName}`;
			writeFile(
				join(dynamoResolvers, `${fileName}.res.vtl`),
				requestMappingTemplate,
			);
			writeFile(
				join(dynamoResolvers, `${fileName}.req.vtl`),
				responseMappingTemplate,
			);
		});
	});

	functionDataSources.forEach(datasource => {
		const { dataSourceName } = datasource;
		const toWrite = omit(["resolverProp"], datasource);
		const newFileName = dataSourceName.replace("-lambda-data-source", "");
		writeJson(join(functionProps, `${newFileName}.json`), toWrite);
		const {
			typeName,
			fieldName,
			requestMappingTemplate,
			responseMappingTemplate,
		} = datasource.resolver;
		const fileName = `${typeName}.${fieldName}`;
		writeFile(
			join(functionResolvers, `${fileName}.res.vtl`),
			requestMappingTemplate,
		);
		writeFile(
			join(functionResolvers, `${fileName}.req.vtl`),
			responseMappingTemplate,
		);
	});
};
