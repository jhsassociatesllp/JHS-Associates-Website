/**
 * lib/pinecone.js
 * ---------------
 * Pinecone Vector Database manager.
 * Provides vector upsert, similarity search, and deletion capabilities.
 * Gracefully falls back if PINECONE_API_KEY is not configured.
 */

const { Pinecone } = require("@pinecone-database/pinecone");

let pineconeClient = null;
let pineconeIndex = null;

function isPineconeEnabled() {
  return Boolean(process.env.PINECONE_API_KEY && (process.env.PINECONE_INDEX || "jhs-website-chatbot"));
}

function getPineconeIndex() {
  if (!isPineconeEnabled()) return null;
  if (!pineconeIndex) {
    try {
      pineconeClient = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
      const indexName = process.env.PINECONE_INDEX || "jhs-website-chatbot";
      pineconeIndex = pineconeClient.index(indexName);
    } catch (err) {
      console.warn("Pinecone initialization warning:", err.message);
      return null;
    }
  }
  return pineconeIndex;
}

/**
 * Upsert vectors into Pinecone in batches of 100
 * @param {Array<{id: string, values: number[], metadata: Object}>} vectors
 */
async function upsertVectors(vectors) {
  const index = getPineconeIndex();
  if (!index) return false;
  if (!vectors || vectors.length === 0) return true;

  const BATCH_SIZE = 100;
  for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
    const batch = vectors.slice(i, i + BATCH_SIZE);
    await index.upsert(batch);
  }
  return true;
}

/**
 * Query Pinecone for topK nearest vectors
 * @param {number[]} queryVector - 1536-dim embedding vector
 * @param {number} topK - Number of results to return (default 5)
 * @param {Object} [filter] - Metadata filter
 */
async function queryVectors(queryVector, topK = 5, filter = null) {
  const index = getPineconeIndex();
  if (!index) return null;

  const queryOptions = {
    vector: queryVector,
    topK,
    includeMetadata: true,
  };
  if (filter) {
    queryOptions.filter = filter;
  }

  const res = await index.query(queryOptions);
  return res.matches || [];
}

/**
 * Delete vectors matching a specific URL or document ID
 * @param {string} url
 */
async function deleteVectorsByUrl(url) {
  const index = getPineconeIndex();
  if (!index) return false;

  try {
    await index.deleteMany({ url: { $eq: url } });
    return true;
  } catch (err) {
    console.warn(`Failed to delete Pinecone vectors for URL ${url}:`, err.message);
    return false;
  }
}

/**
 * Delete vectors matching an ID prefix or list of IDs
 * @param {Array<string>} ids
 */
async function deleteVectorsByIds(ids) {
  const index = getPineconeIndex();
  if (!index) return false;
  if (!ids || ids.length === 0) return true;

  try {
    await index.deleteMany(ids);
    return true;
  } catch (err) {
    console.warn("Failed to delete Pinecone vector IDs:", err.message);
    return false;
  }
}

module.exports = {
  isPineconeEnabled,
  getPineconeIndex,
  upsertVectors,
  queryVectors,
  deleteVectorsByUrl,
  deleteVectorsByIds,
};
