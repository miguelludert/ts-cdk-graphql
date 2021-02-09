export namespace functionSetup {
    function onProps(scope: any, props: any, context: any): {
        functionName: any;
        code: import("@aws-cdk/aws-lambda").AssetCode;
        handler: any;
        runtime: any;
        timeout: Duration;
    };
    function onConstruct(scope: any, construct: any): void;
}
export namespace graphqlApiSetup {
    export function onProps_1(scope: any, props: any, context: any): {
        name: any;
    };
    export { onProps_1 as onProps };
    export function onConstruct_1(): void;
    export { onConstruct_1 as onConstruct };
}
export namespace tableSetup {
    export function onProps_2(scope: any, props: any, context: any): {
        name: any;
        logConfig: {
            fieldLogLevel: FieldLogLevel;
        };
    };
    export { onProps_2 as onProps };
    export function onConstruct_2(): void;
    export { onConstruct_2 as onConstruct };
}
import { Duration } from "@aws-cdk/core/lib/duration";
import { FieldLogLevel } from "@aws-cdk/aws-appsync/lib/graphqlapi";
