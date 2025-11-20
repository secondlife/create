import yaml from 'js-yaml';
import lslDefinitionsRaw from '../definitions/lsl_definitions.yaml?raw';

interface HasTooltip {
  tooltip?: string;
}

export interface Argument extends HasTooltip {
  name: string;
  type: string;
}

export interface ConstantDefinition {
    name: string;
    tooltip: string;
    type: 'integer' | 'float' | 'string' | 'vector' | 'rotation' | 'key';
    value: string;
}

export interface FunctionDefinition extends HasTooltip {
  name: string;
  returnType: string;
  energy?: number;
  sleep?: number;
  deprecated: boolean;
  experience: boolean;
  lindenExperience: boolean;
  godMode: boolean;
  arguments: Record<string, Argument>;
}

export interface EventDefinition extends HasTooltip {
  name: string;
  deprecated: boolean;
  experience: boolean;
  lindenExperience: boolean;
  godMode: boolean;
  arguments: Record<string, Argument>;
}

export interface LSLDefinitions {
  syntaxVersion: number;
  constants: Record<string, ConstantDefinition>;
  functions: Record<string, FunctionDefinition>;
  events: Record<string, EventDefinition>;
}

let cachedDefinitions: LSLDefinitions | null = null;
// Load LSL definitions from YAML file
export function getLSLDefinitions(): LSLDefinitions {
    // Lazy load and cache definitions
    if (cachedDefinitions === null) {
        cachedDefinitions = convertLSLDefinitions(yaml.load(lslDefinitionsRaw));
    }
    return cachedDefinitions;
}

export function getEvent(name: string): EventDefinition | undefined {
    const definitions = getLSLDefinitions();
    return definitions.events[name];
}

export function getFunction(name: string): FunctionDefinition | undefined {
    const definitions = getLSLDefinitions();
    return definitions.functions[name];
}

export function getConstant(name: string): ConstantDefinition | undefined {
    const definitions = getLSLDefinitions();
    return definitions.constants[name];
}

// Map raw YAML data to friendlier and more consistent LSLDefinitions structure
function convertLSLDefinitions(raw: any): LSLDefinitions {
    const constants: Record<string, ConstantDefinition> = {};
    for (const name in raw.constants) {
        const c = raw.constants[name];
        constants[name] = {
            name,
            value: c.value,
            type: c.type,
            tooltip: convertTooltip(c.tooltip),
        }
    }

    const functions: Record<string, FunctionDefinition> = {};
    for (const name in raw.functions) {
        const fn = raw.functions[name];
        functions[name] = {
            name,
            tooltip: convertTooltip(fn.tooltip),
            returnType: fn.return,
            energy: fn.energy,
            sleep: fn.sleep,
            deprecated: fn.deprecated || false,
            experience: fn.experience || false,
            lindenExperience: fn['linden-experience'] || false,
            godMode: fn['god-mode'] || false,
            arguments: fn.arguments ? convertArguments(fn.arguments) : {},
        }
    }

    const events: Record<string, EventDefinition> = {};
    for (const name in raw.events) {
        const ev = raw.events[name];
        events[name] = {
            name,
            tooltip: convertTooltip(ev.tooltip),
            deprecated: ev.deprecated || false,
            experience: ev.experience || false,
            lindenExperience: ev['linden-experience'] || false,
            godMode: ev['god-mode'] || false,
            arguments: ev.arguments ? convertArguments(ev.arguments) : {},
        }
    }

    return {
        syntaxVersion: raw['llsd-lsl-syntax-version'],
        constants,
        functions,
        events,
    }
}

// Convert tooltip string by replacing escaped newlines with actual newlines
function convertTooltip(tooltip: string): string {
    return tooltip.replace(/\\n/g, '\n');
}

// Convert array of argument definitions to record keyed by argument name
function convertArguments(argRecords: Record<string, Argument>[]): Record<string, Argument> {
    // Merge array of argument records into a single record
    const args: Record<string, Argument> = {};
    for (const record of argRecords) {
        for (const key in record) {
            args[key] = record[key];
        }
    }
    return args;
}
