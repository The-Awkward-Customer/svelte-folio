import axios from "axios";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

const FIGMA_SVELTE_FOLIO_ACCESS_TOKEN = process.env.FIGMA_SVELTE_FOLIO_ACCESS_TOKEN;
const FIGMA_FILE_ID = process.env.FIGMA_FILE_ID;

if (!FIGMA_SVELTE_FOLIO_ACCESS_TOKEN || !FIGMA_FILE_ID) {
  console.error(
    "FIGMA_SVELTE_FOLIO_ACCESS_TOKEN and FIGMA_FILE_ID must be set as environment variables."
  );
  process.exit(1);
}

async function fetchFigmaTokens() {
  try {
    const response = await axios.get(
      `https://api.figma.com/v1/files/${FIGMA_FILE_ID}`,
      {
        headers: {
          "X-Figma-Token": FIGMA_TOKEN,
        },
      }
    );
    const data = response.data;
    console.log("Figma API Response received");
    
    // Extract tokens from the Figma API response
    const tokens = extractTokens(data);
    
    // Save raw tokens to the frontend directory
    const outputPath = path.resolve(process.cwd(), 'src/tokens.json');
    fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));
    console.log(`Tokens successfully saved to ${outputPath}`);
    
    // Run Style Dictionary to build platform-specific token files
    runStyleDictionary();
  } catch (error) {
    console.error("Error fetching tokens from Figma:", error.message);
    process.exit(1);
  }
}

function extractTokens(data) {
  // This is where you'd convert Figma data to a Style Dictionary-compatible format
  const tokens = {
    color: {},
    spacing: {},
    typography: {}
  };
  
  // Example: Extract fill styles as colors
  if (data && data.styles) {
    for (const [key, value] of Object.entries(data.styles)) {
      if (value.styleType === "FILL") {
        // You'll need to find the actual color value in the Figma nodes
        // This is a placeholder - you'll need to navigate the Figma document structure
        tokens.color[value.name.replace(/\s+/g, '-').toLowerCase()] = {
          value: value.description || "#CCCCCC",
          type: "color"
        };
      }
    }
  } else {
    console.error("No styles found in the API response.");
  }
  
  return tokens;
}

function runStyleDictionary() {
  console.log("Running Style Dictionary build...");
  exec('npx style-dictionary build', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running Style Dictionary: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Style Dictionary stderr: ${stderr}`);
      return;
    }
    console.log(`Style Dictionary build complete: ${stdout}`);
  });
}

fetchFigmaTokens();