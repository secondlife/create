#!/usr/bin/env node

// Retrieves lsl_definitions.yaml from the specified URL and saves it to the src/definitions directory.
// This is invoked automatically during the build process (astro.config.mjs), but can also be run manually.

import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';

export const DEFAULT_URL = 'https://raw.githubusercontent.com/secondlife/lsl-definitions/refs/heads/main/lsl_definitions.yaml';
export const OUTPUT_PATH = new URL('../src/definitions/lsl_definitions.yaml', import.meta.url).pathname;

export async function fetchDefinitions(url = DEFAULT_URL) {
  console.log(`Fetching LSL definitions from: ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const content = await response.text();

    // Ensure the directory exists
    await mkdir(dirname(OUTPUT_PATH), { recursive: true });

    // Write the file
    await writeFile(OUTPUT_PATH, content, 'utf8');

    console.log(`Successfully saved LSL definitions to: ${OUTPUT_PATH}`);
  } catch (error) {
    console.error(`Failed to fetch LSL definitions: ${error.message}`);
    throw error;
  }
}

// When run as a script (not imported), execute the fetch
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2] || DEFAULT_URL;
  fetchDefinitions(url).catch(() => {
    process.exit(1);
  });
}
