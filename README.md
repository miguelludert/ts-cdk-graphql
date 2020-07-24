## Goals:

The goal of this lib is to have a CDK stack that can be instantiated directly from
a Amplify GQL schema file, with the CDK and AppSync properties configurable via a config
directory and naming conventions. The parsing and configuration should happen at runtime,
generated on the fly, without writing anything out to disk, but consuming config files as
needed.

## Next Milestone

The MVP will be complete when lambda and dynamo data sources can be deployed to CDK
successfully with minimal initial configuration.

## Future Milestones

Once the basic cdk stack objects have been created, the next goals include:

- CDK.json management for different environments

## Stack options

- schema (required) - the path to the schema
- overrides (optional) - the folder where the overrides are found
- prefix (optional) - a prefix for all items
- transformers (optional) - the transformers to add to the graphql parsing

CLI options

- --output -out, directory to dump the configurations manually
- --overrides -ovr, the folder where the overrides are found
- --config -c, a path to a configuration file
