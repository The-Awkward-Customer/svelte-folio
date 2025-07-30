// frontend/src/lib/server/embeddings.ts
import { HUGGING_FACE_INFERENCE_KEY } from '$env/static/private';

const EMBEDDING_MODEL = 'BAAI/bge-small-en-v1.5';  // Popular embedding model
const EMBEDDING_DIMENSION = 384;

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${EMBEDDING_MODEL}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_INFERENCE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: text,
          options: { 
            wait_for_model: true,
            use_cache: true
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HuggingFace API error: ${response.status} - ${error}`);
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
    throw new Error('Failed to generate embedding');
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