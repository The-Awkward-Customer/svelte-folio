// frontend/src/lib/server/embeddings-script.ts
const EMBEDDING_MODEL = 'BAAI/bge-small-en-v1.5';  // Popular embedding model
const EMBEDDING_DIMENSION = 384;

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.HUGGING_FACE_INFERENCE_KEY;
  
  if (!apiKey) {
    throw new Error('HUGGING_FACE_INFERENCE_KEY not found in environment variables');
  }

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${EMBEDDING_MODEL}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: text,
          options: { 
            wait_for_model: true
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HuggingFace API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    // This model returns embeddings directly as an array
    if (!Array.isArray(result) || result.length !== EMBEDDING_DIMENSION) {
      console.error('Unexpected response:', { 
        type: Array.isArray(result) ? 'array' : typeof result,
        length: Array.isArray(result) ? result.length : 'N/A',
        sample: JSON.stringify(result).slice(0, 100)
      });
      throw new Error(`Invalid embedding response`);
    }
    
    return result;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

export async function testHuggingFaceConnection(): Promise<boolean> {
  try {
    const embedding = await generateEmbedding('test');
    console.log('Test embedding successful, dimensions:', embedding.length);
    return true;
  } catch (error) {
    console.error('HuggingFace test failed:', error);
    return false;
  }
}

export { EMBEDDING_DIMENSION };