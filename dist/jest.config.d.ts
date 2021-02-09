export const roots: string[];
export const preset: string;
export const testEnvironment: string;
export const testMatch: string[];
export const transform: {
    "^.+\\.ts$": string;
    "^.+\\.js$": string;
};
export const globals: {
    "ts-jest": {
        diagnostics: boolean;
    };
    dump: (...vals: any[]) => void;
};
