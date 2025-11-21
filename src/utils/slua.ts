// Utility to convert LSL types to Luau types
export function toLuauType(lslType: string): string {
  const typeMap: Record<string, string> = {
    'integer': 'number',
    'float': 'number',
    'string': 'string',
    'key': 'string',
    'vector': 'vector',
    'rotation': 'quaternion',
    'quaternion': 'quaternion',
    'list': '{any}',
    'void': '()'
  };
  return typeMap[lslType] || lslType;
}
