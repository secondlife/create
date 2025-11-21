#!/usr/bin/env node

// Generates documentation pages for LSL/SLua functions, events, and constants
// based on the lsl_definitions.yaml file located in src/definitions.

import { readFile } from 'fs/promises';
import { load, dump } from 'js-yaml';

async function getLSLDefinitions() {
  const yamlContent = await readFile('src/definitions/lsl_definitions.yaml', 'utf-8');
  return load(yamlContent);
}

const EXAMPLE_TEXT = `## Examples

Add example usage here.

## Notes

Add additional notes, caveats, or tips here.

## See Also

- Related pages can be linked here
`

const MARKER_COMMENT = '{/* DO NOT EDIT ABOVE THIS LINE */}';

async function generateFor(name, tooltip, component, outputDir) {
  const filename = `${name.toLowerCase()}.mdx`;
  const { join, dirname } = await import('path');
  const { fileURLToPath } = await import('url');
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const filepath = join(__dirname, outputDir, filename);

  const frontmatter = {title: name};
  if (tooltip) {
    frontmatter.description = tooltip.replace(/\\n/g, '\n');
  }
  const frontmatterYaml = dump(frontmatter).trim();

  const header = `---
${frontmatterYaml}
---

import ${component} from '@components/${component}.astro';

<${component} name="${name}" />

${MARKER_COMMENT}`;

  let existingContent = '';
  
  // Attempt to load existing file
  try {
    const fs = await import('fs/promises');
    const fileContent = await fs.readFile(filepath, 'utf-8');
    
    // Extract content after marker
    const markerIndex = fileContent.indexOf(MARKER_COMMENT);
    if (markerIndex !== -1) {
      existingContent = fileContent.substring(markerIndex + MARKER_COMMENT.length);
    }
  } catch (err) {
    // File doesn't exist or can't be read, use default example text
    existingContent = '\n\n' + EXAMPLE_TEXT;
  }

  // Combine new header with existing content
  const newContent = header + existingContent;

  // Write file
  const fs = await import('fs/promises');
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(filepath, newContent, 'utf-8');
}

async function generateDocs() {
  const lslDefs = await getLSLDefinitions();
  const functions = Object.keys(lslDefs.functions);
  const events = Object.keys(lslDefs.events);
  const constants = Object.keys(lslDefs.constants);

  // Events that are LSL-specific and should not be included in SLua documentation
  const lslOnlyEvents = ['state_entry', 'state_exit'];

  for (const funcName of functions) {
    // Skip private functions
    if (lslDefs.functions[funcName]?.private) {
      continue;
    }
    generateFor(funcName, lslDefs.functions[funcName]?.tooltip, 'LSLFunction', '../src/content/docs/script/lsl-reference/functions');
    generateFor(funcName, lslDefs.functions[funcName]?.tooltip, 'SLuaFunction', '../src/content/docs/script/slua-reference/functions');
  }
  console.log(`✅ Generated ${Object.keys(lslDefs.functions).length*2} doc pages for ${Object.keys(lslDefs.functions).length} functions.`);

  let sluaEventCount = 0;
  for (const eventName of events) {
    generateFor(eventName, lslDefs.events[eventName]?.tooltip, 'LSLEvent', '../src/content/docs/script/lsl-reference/events');
    // Skip LSL-only events when generating SLua documentation
    if (!lslOnlyEvents.includes(eventName)) {
      generateFor(eventName, lslDefs.events[eventName]?.tooltip, 'SLuaEvent', '../src/content/docs/script/slua-reference/events');
      sluaEventCount++;
    }
  }
  const totalEvents = events.length;
  console.log(`✅ Generated ${totalEvents} LSL event pages and ${sluaEventCount} SLua event pages for ${totalEvents} events.`);

  for (const constantName of constants) {
    generateFor(constantName, lslDefs.constants[constantName]?.tooltip, 'LSLConstant', '../src/content/docs/script/lsl-reference/constants');
    generateFor(constantName, lslDefs.constants[constantName]?.tooltip, 'SLuaConstant', '../src/content/docs/script/slua-reference/constants');
  }
  console.log(`✅ Generated ${Object.keys(lslDefs.constants).length*2} doc pages for ${Object.keys(lslDefs.constants).length} constants.`);
}

generateDocs();
