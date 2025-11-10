// frontend/src/lib/server/embeddings.ts
import { HUGGING_FACE_INFERENCE_KEY } from '$env/static/private';

const EMBEDDING_MODEL = 'BAAI/bge-small-en-v1.5'; // Popular embedding model
const EMBEDDING_DIMENSION = 384;

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = HUGGING_FACE_INFERENCE_KEY;

  if (!apiKey) {
    throw new Error('HUGGING_FACE_INFERENCE_KEY not found in environment variables');
  }

  try {
    const response = await fetch(
      `https://router.huggingface.co/hf-inference/models/${EMBEDDING_MODEL}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          options: {
            wait_for_model: true,
            use_cache: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('HuggingFace API error:', {
        status: response.status,
        error,
      });
      throw new Error(`HuggingFace API error: ${response.status} - ${error}`);
    }

    const result = await response.json();

    console.log('HuggingFace response:', {
      type: Array.isArray(result) ? 'array' : typeof result,
      length: Array.isArray(result) ? result.length : 'N/A',
      sample: JSON.stringify(result).slice(0, 200),
    });

    // Handle different response formats
    let embedding: number[];

    if (Array.isArray(result) && typeof result[0] === 'number') {
      // Direct array of numbers
      embedding = result;
    } else if (Array.isArray(result) && Array.isArray(result[0])) {
      // Nested array [[...]]
      embedding = result[0];
    } else if (result && typeof result === 'object' && 'embeddings' in result) {
      // Object with embeddings key
      embedding = result.embeddings[0] || result.embeddings;
    } else if (result && typeof result === 'object' && 'data' in result) {
      // Object with data key
      embedding = result.data[0] || result.data;
    } else {
      console.error('Unexpected response format:', result);
      throw new Error(`Invalid embedding response format`);
    }

    if (!Array.isArray(embedding) || embedding.length !== EMBEDDING_DIMENSION) {
      console.error('Invalid embedding dimensions:', {
        expected: EMBEDDING_DIMENSION,
        actual: Array.isArray(embedding) ? embedding.length : 'not an array',
      });
      throw new Error(
        `Invalid embedding dimensions: expected ${EMBEDDING_DIMENSION}, got ${Array.isArray(embedding) ? embedding.length : 'not an array'}`
      );
    }

    return embedding;
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
