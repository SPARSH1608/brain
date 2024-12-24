interface DatabaseInfo {
  title: string;
  description: string;
  summary: string;
}

export function parseApiResponse(response: string): DatabaseInfo {
  try {
    // Remove backticks and "json" text
    const cleanedResponse = response
      .trim()
      .replace(/^```json\s*/, '') // Remove starting ```json
      .replace(/```$/, '') // Remove ending ```
      .trim();

    // Parse the JSON string
    const parsedData = JSON.parse(cleanedResponse);

    // Validate the required fields
    if (!parsedData.title || typeof parsedData.title !== 'string') {
      throw new Error('Missing or invalid title field');
    }
    if (!parsedData.description || typeof parsedData.description !== 'string') {
      throw new Error('Missing or invalid description field');
    }
    if (!parsedData.summary || typeof parsedData.summary !== 'string') {
      throw new Error('Missing or invalid summary field');
    }

    // Return typed object
    return {
      title: parsedData.title,
      description: parsedData.description,
      summary: parsedData.summary,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse API response: ${error.message}`);
    }
    throw new Error('An unknown error occurred while parsing the API response');
  }
}
