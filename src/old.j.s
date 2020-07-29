const { cli } = require('cli-ux');
const { promises: fs, existsSync } = require('fs');
const { Command } = require('@oclif/command');
const { GraphQLTransform } = require('graphql-transformer-core');
const { DynamoDBModelTransformer } = require('graphql-dynamodb-transformer');
const { SearchableModelTransformer } = require('graphql-elasticsearch-transformer');
const { ModelConnectionTransformer } = require('graphql-connection-transformer');
const { ModelAuthTransformer } = require('graphql-auth-transformer');
const { VersionedModelTransformer } = require('graphql-versioned-transformer');
const { KeyTransformer } = require('graphql-key-transformer');
const { yellowBright } = require('chalk');

const codegen = require('amplify-codegen');
const prettier = require('prettier');

const { extractIndices, generatePackageName, lowercaseFirst, mapStorageType } = require('../utils');

// file constants
const AMPLIFY_GRAPHQL_SCHEMA_FILE = 'src/amplify-schema.graphql';
const AMPLIFY_GRAPHQL_CONFIG_FILE = '.graphqlconfig.yml';

// directory constants
const CFN_TEMPLATE_DIR = 'lib/infra-config/cfn';
const LIB_GRAPHQL_DIR = 'lib/infra-config/graphql';
const LIB_GRAPHQL_API_DIR = `${LIB_GRAPHQL_DIR}/api`;
const LIB_GRAPHQL_RESOLVERS_DIR = `${LIB_GRAPHQL_API_DIR}/resolvers`;
const LIB_FUNCTION_DIR = `${LIB_GRAPHQL_DIR}/functions`;
const LIB_FUNCTION_RESOLVERS_DIR = `${LIB_FUNCTION_DIR}/resolvers`;
const LIB_STORAGE_CONFIG_DIR = 'lib/infra-config/data-storage';

const directories = [
  CFN_TEMPLATE_DIR,
  LIB_GRAPHQL_DIR,
  LIB_GRAPHQL_API_DIR,
  LIB_GRAPHQL_RESOLVERS_DIR,
  LIB_FUNCTION_RESOLVERS_DIR,
  LIB_STORAGE_CONFIG_DIR,
];

class SchemaCommand extends Command {
  async run() {
    this.parse(SchemaCommand);

    // make sure that we have an amplify-schema.graphql file
    if (!existsSync(AMPLIFY_GRAPHQL_SCHEMA_FILE)) {
      this.error('this requires an amplify-schema.graphql file', { exit: 1 });
    }

    this.log('Transforming annotated Amplify GraphQL...');

    // make sure directories exist
    directories.map(async (directory) => fs.mkdir(directory, { recursive: true }));

    // start a progress spinner
    cli.action.start('running graphql transformer');

    // set up the standard set of transformers
    const transformer = new GraphQLTransform({
      transformers: [
        new DynamoDBModelTransformer(),
        new SearchableModelTransformer(),
        new ModelAuthTransformer(),
        new KeyTransformer(),
        new VersionedModelTransformer(),
        new ModelConnectionTransformer(),
      ],
    });

    // check if we have already run codegen
    const exists = existsSync(AMPLIFY_GRAPHQL_CONFIG_FILE);

    // load the schema file
    const schema = await fs.readFile(AMPLIFY_GRAPHQL_SCHEMA_FILE, 'utf8');

    // transform the annotated schema to a real graphql schema
    const cfdoc = transformer.transform(schema);

    // stop the progress spinner
    cli.action.stop();

    // start a progress spinner
    cli.action.start('generating files');

    // set up local variables
    const datasources = [];
    const writeOperations = [];
    const connectionMap = {};

    // load prettier configuration
    let prettierConfig = {};
    const prettierFileConfig = await prettier.resolveConfig('.');
    if (prettierFileConfig !== null) {
      this.debug('loaded prettier configuration from file', prettierFileConfig);
      prettierConfig = { ...prettierFileConfig };
    }

    // generate data storage configurations and appsync data sources configuration
    // eslint-disable-next-line no-restricted-syntax
    for await (const item of Object.keys(cfdoc.stackMapping).filter((key) => key.endsWith('Table'))) {
      const prettyTableName = cfdoc.stackMapping[item];
      const cfn = cfdoc.stacks[prettyTableName].Resources[item];
      const { KeySchema, LocalSecondaryIndexes, GlobalSecondaryIndexes } = cfn.Properties;
      const tableName = generatePackageName(prettyTableName);
      this.debug(`generate data storage configuration for ${yellowBright(prettyTableName)} table`);

    //   // get data source information
    //   const dataSource = cfdoc.stacks[`${prettyTableName}`].Resources[`${prettyTableName}DataSource`];
    //   connectionMap[prettyTableName] = dataSource;
    //
    //   // add to datasources
    //   datasources.push({
    //     dataSourceName: `${lowercaseFirst(prettyTableName)}DS`,
    //     tableName,
    //     type: mapStorageType(dataSource.Properties.Type),
    //   });
    //
    //   // create output structure
    //   const storageConfig = {
    //     type: mapStorageType(dataSource.Properties.Type),
    //     props: {
    //       ...extractIndices(KeySchema),
    //       tableName,
    //     },
    //   };
    //
    //   // set up Global Secondary Indices (GSI)
    //   if (GlobalSecondaryIndexes) {
    //     this.debug(`found GSI for ${yellowBright(prettyTableName)} table`);
    //     storageConfig.GSI = GlobalSecondaryIndexes.map(({ IndexName: indexName, KeySchema: keySchema }) => ({
    //       indexName,
    //       ...extractIndices(keySchema),
    //     }));
    //   }
    //
    //   // set up Local Secondary Indices (LSI)
    //   if (LocalSecondaryIndexes) {
    //     this.debug(`found LSI for ${yellowBright(prettyTableName)} table`);
    //     storageConfig.LSI = LocalSecondaryIndexes.map(({ IndexName: indexName, KeySchema: keySchema }) => ({
    //       indexName,
    //       ...extractIndices(keySchema),
    //     }));
    //   }
    //
    //   // write file to data-storage directory
    //   writeOperations.push(
    //     fs.writeFile(
    //       `${LIB_STORAGE_CONFIG_DIR}/${generatePackageName(item)}.json`,
    //       prettier.format(JSON.stringify(storageConfig, null, 2), { ...prettierConfig, parser: 'json-stringify' })
    //     )
    //   );
    // }

    // write down AppSync data sources configuration
    writeOperations.push(
      fs.writeFile(
        `${LIB_GRAPHQL_DIR}/datasources.json`,
        prettier.format(JSON.stringify(datasources, null, 2), { ...prettierConfig, parser: 'json-stringify' })
      )
    );

    // write down CFN templates for reference
    writeOperations.push(
      fs.writeFile(
        `${CFN_TEMPLATE_DIR}/cloudformation-main.json`,
        prettier.format(JSON.stringify(cfdoc.rootStack, null, 2), { ...prettierConfig, parser: 'json-stringify' })
      )
    );

    // write down stack mapping for reference
    writeOperations.push(
      fs.writeFile(
        `${CFN_TEMPLATE_DIR}/stack-mapping.json`,
        prettier.format(JSON.stringify(cfdoc.stackMapping, null, 2), { ...prettierConfig, parser: 'json-stringify' })
      )
    );

    // write down CFN nested stack templates for reference
    if (cfdoc.stacks) {
      Object.keys(cfdoc.stacks).forEach((stack) =>
        writeOperations.push(
          fs.writeFile(
            `${CFN_TEMPLATE_DIR}/cloudformation-${stack.toLowerCase()}.json`,
            prettier.format(JSON.stringify(cfdoc.stacks[stack], null, 2), {
              ...prettierConfig,
              parser: 'json-stringify',
            })
          )
        )
      );
    }

    // write down Velocity resolver files and Mutations/Queries configurations
    if (cfdoc.resolvers) {
      // storage for resolver configurations
      const resolverConfigs = {
        Functions: [],
        Mutation: [],
        Query: [],
        fileMap: {
          Mutation: 'Mutations',
          Query: 'Queries',
        },
      };

      // write down resolver files, generate Queries/Mutations configs
      Object.keys(cfdoc.resolvers).forEach((resolver) => {
        const [operationType, fieldName, method, extension] = resolver.split('.', 4);
        const resolverName = `${operationType}.${fieldName}.${method}.${extension}`;
        const functionResolverName = `${fieldName}Function.${method}.${extension}`;
        const connectionResolverName = `${operationType}.${fieldName}.${method}.${extension}`;
        const fileContent = cfdoc.resolvers[resolver];
        this.debug(`generate resolver ${yellowBright(resolver)}`);
        switch (operationType) {
          case 'Query':
          case 'Mutation':
            // add graphql resolver config
            resolverConfigs[operationType].push({
              resolverType: 'PIPELINE',
              operationType,
              fieldName,
              functions: [],
            });
            // write down the GraphQL resolver template
            writeOperations.push(fs.writeFile(`${LIB_GRAPHQL_RESOLVERS_DIR}/${resolverName}`, fileContent));
            // add function resolver
            resolverConfigs.Functions.push({
              functionName: `${fieldName}Function`,
              description: '',
              datasourceName: '',
            });
            // write down the function resolver template
            writeOperations.push(fs.writeFile(`${LIB_FUNCTION_RESOLVERS_DIR}/${functionResolverName}`, fileContent));
            break;
          default:
            // write down the connection resolver template
            writeOperations.push(fs.writeFile(`${LIB_FUNCTION_RESOLVERS_DIR}/${connectionResolverName}`, fileContent));
            break;
        }
      });

      // write down Queries.json, Mutations.json
      ['Query', 'Mutation'].forEach((operationType) =>
        writeOperations.push(
          fs.writeFile(
            `${LIB_GRAPHQL_API_DIR}/${resolverConfigs.fileMap[operationType]}.json`,
            prettier.format(JSON.stringify(resolverConfigs[operationType], null, 2), {
              ...prettierConfig,
              parser: 'json-stringify',
            })
          )
        )
      );

      // write down functionsConfig.json
      writeOperations.push(
        fs.writeFile(
          `${LIB_FUNCTION_DIR}/functionsConfig.json`,
          prettier.format(JSON.stringify(resolverConfigs.Functions, null, 2), {
            ...prettierConfig,
            parser: 'json-stringify',
          })
        )
      );
    }

    // write down the transformed graphql schema
    writeOperations.push(
      fs.writeFile(
        `${LIB_GRAPHQL_DIR}/schema.graphql`,
        prettier.format(cfdoc.schema, { ...prettierConfig, parser: 'graphql' })
      )
    );

    // wait for all file operations
    await Promise.all(writeOperations);

    // create a temporary file for Amplify codegen
    await fs.copyFile(`${LIB_GRAPHQL_DIR}/schema.graphql`, 'schema.graphql');

    // stop the spinner
    cli.action.stop();

    // run amplify codegen
    try {
      if (exists) {
        this.debug(`amplify configuration exists, ${yellowBright('codegen.generate')}`);
        await codegen.generate({
          parameters: {
            options: {
              frontend: 'javascript',
              framework: 'react',
            },
          },
        });
      } else {
        this.debug(`amplify configuration missing, ${yellowBright('codegen.add')}`);
        await codegen.add({
          parameters: {
            options: {
              frontend: 'javascript',
              framework: 'react',
            },
          },
        });
      }
      // remove the temporary file
      await fs.unlink('schema.graphql');
    } catch (error) {
      cli.error(error);
      cli.exit(1);
    }
  }
}

SchemaCommand.description = `compile graphql schema and generate resolvers

Compiles an Amplify graphql transform schema into a proper graphql schema
and runs codegen to generate resolver files.`;

module.exports = SchemaCommand;
