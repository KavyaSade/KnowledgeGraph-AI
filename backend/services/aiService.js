const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
let isMock = true;

if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    isMock = false;
    console.log('[AI Service] Gemini API initialized successfully.');
  } catch (err) {
    console.error('[AI Service] Failed to initialize Gemini API. Running in Mock fallback mode:', err.message);
  }
} else {
  console.log('[AI Service] No GEMINI_API_KEY environment variable found. Running in Mock fallback mode.');
}


const cleanJsonResponse = (text) => {
  let cleanText = text.trim();
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.substring(7);
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.substring(3);
  }
  if (cleanText.endsWith('```')) {
    cleanText = cleanText.substring(0, cleanText.length - 3);
  }
  return JSON.parse(cleanText.trim());
};

const aiService = {
  // 1. Generate summary for a single node and its related knowledge
  generateSummary: async (node, relatedNodes) => {
    if (isMock) {
      // Intelligent Heuristic Mock Generator
      const relatedTitles = relatedNodes.map(rn => `"${rn.title}" (${rn.type})`).join(', ');
      const tagsList = node.tags.length > 0 ? node.tags.join(', ') : 'General Knowledge';
      const cleanContent = node.content ? node.content.replace(/\r?\n/g, ' ') : 'No content available.';
      const snippets = cleanContent.slice(0, 150) + (cleanContent.length > 150 ? '...' : '');

      return `## Overview
This resource, titled **${node.title}** (${node.type.toUpperCase()}), centers on: "${snippets}"

## Key Topics
- **Core Subject**: ${node.title}
- **Metadata Tags**: ${tagsList}
- **Entity Type**: ${node.type}

## Important Findings
- Analyzed content contains keywords: ${node.tags.slice(0, 3).join(', ') || 'personal data'}.
- Connected directly with: ${relatedTitles || 'No neighboring nodes currently linked.'}.

## Related Work
- Matches context files: ${relatedNodes.filter(rn => rn.type === 'document').map(d => d.title).join(', ') || 'No reference papers found.'}
- Connected planning streams: ${relatedNodes.filter(rn => rn.type === 'project').map(p => p.title).join(', ') || 'No active projects linked.'}

## Next Steps
- Link further details regarding tags: ${tagsList}.
- Perform a natural language search to locate additional nodes in similar semantic clusters.`;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are an AI Personal Knowledge assistant. Summarize the following resource:
Title: ${node.title}
Type: ${node.type}
Content: ${node.content}
Tags: ${node.tags.join(', ')}

Related Knowledge Nodes:
${relatedNodes.map(rn => `- [${rn.type.toUpperCase()}] ${rn.title}: ${rn.content.slice(0, 100)}`).join('\n')}

Format your response exactly as a structured markdown summary with these sections:
## Overview
[A concise summary of what this resource is about]

## Key Topics
[Key themes and topics discussed, with bullet points]

## Important Findings
[Key details, findings, or facts, with bullet points]

## Related Work
[How this resource connects to the related knowledge nodes listed above]

## Next Steps
[Actions the user could take next to expand this knowledge]`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini generateSummary failed, using mock fallback:', error);
      isMock = true;
      const fallback = await aiService.generateSummary(node, relatedNodes);
      isMock = false;
      return fallback;
    }
  },

  // 2. Suggest connections from node against a list of other nodes
  suggestConnections: async (node, allNodes) => {
    if (isMock) {
      // Heuristic Mock Suggestion Engine
      const suggestions = [];
      const nodeTags = node.tags.map(t => t.toLowerCase());
      const nodeWords = (node.title + ' ' + node.content).toLowerCase().split(/\W+/);

      allNodes.forEach(other => {
        if (other._id.toString() === node._id.toString()) return;

        let score = 0;
        let reasons = [];

        // Reason A: Shared tags
        const otherTags = other.tags.map(t => t.toLowerCase());
        const sharedTags = nodeTags.filter(t => otherTags.includes(t));
        if (sharedTags.length > 0) {
          score += 3;
          reasons.push(`Shares tag(s): ${sharedTags.map(t => `'${t}'`).join(', ')}`);
        }

        // Reason B: Title mention
        const otherTitleLower = other.title.toLowerCase();
        if (nodeWords.includes(otherTitleLower) || (node.content && node.content.toLowerCase().includes(otherTitleLower))) {
          score += 4;
          reasons.push(`Mentions "${other.title}" in details`);
        }

        // Reason C: Semantic overlap
        const otherWords = (other.title + ' ' + other.content).toLowerCase().split(/\W+/);
        const sharedWords = nodeWords.filter(w => w.length > 4 && otherWords.includes(w));
        if (sharedWords.length > 2) {
          score += 2;
          reasons.push(`Shares keyword concepts: ${[...new Set(sharedWords)].slice(0, 3).map(w => `'${w}'`).join(', ')}`);
        }

        if (score >= 2 && suggestions.length < 5) {
          suggestions.push({
            id: other._id.toString(),
            title: other.title,
            type: other.type,
            reason: reasons.join(' and ')
          });
        }
      });

      return suggestions;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Given the following node:
Title: ${node.title}
Type: ${node.type}
Content: ${node.content}
Tags: ${node.tags.join(', ')}

And the list of other nodes in the user's database:
${allNodes.map(n => `- ID: ${n._id.toString()}, Title: ${n.title}, Type: ${n.type}, Content: ${n.content.slice(0, 100)}, Tags: ${n.tags.join(', ')}`).join('\n')}

Identify which of these other nodes are potentially related to this node. Return a JSON array of objects, each containing:
- "id": target node ID string
- "title": target node title string
- "type": target node type string
- "reason": brief explanation (e.g. "Shares tag 'AI' and discusses similar model architectures")

Return ONLY the raw JSON array. Do not include markdown codeblocks or backticks. If no nodes are related, return an empty array [].`;

      const result = await model.generateContent(prompt);
      return cleanJsonResponse(result.response.text());
    } catch (error) {
      console.error('Gemini suggestConnections failed, using mock fallback:', error);
      isMock = true;
      const fallback = await aiService.suggestConnections(node, allNodes);
      isMock = false;
      return fallback;
    }
  },

  // 3. Generate graph insights based on current node density
  generateInsights: async (nodes, links) => {
    if (isMock) {
      
      const insights = [];

      // A. Strong Connection 
      const degreeMap = {};
      links.forEach(l => {
        degreeMap[l.source] = (degreeMap[l.source] || 0) + 1;
        degreeMap[l.target] = (degreeMap[l.target] || 0) + 1;
      });

      let hubId = null;
      let maxConnections = 0;
      Object.keys(degreeMap).forEach(id => {
        if (degreeMap[id] > maxConnections) {
          maxConnections = degreeMap[id];
          hubId = id;
        }
      });

      const hubNode = hubId ? nodes.find(n => n._id.toString() === hubId) : null;
      if (hubNode && maxConnections >= 3) {
        insights.push({
          type: 'New Connection',
          title: 'Central Knowledge Hub',
          description: `"${hubNode.title}" (${hubNode.type.toUpperCase()}) acts as a major link in your graph with ${maxConnections} active relationships. Building more links around it will optimize cluster synthesis.`,
          sourceIds: [hubId]
        });
      }

      // B. Emerging Topic (Common Tag)
      const tagCounts = {};
      nodes.forEach(n => {
        n.tags.forEach(t => {
          const lower = t.toLowerCase();
          tagCounts[lower] = (tagCounts[lower] || 0) + 1;
        });
      });

      let topTag = null;
      let maxTagCount = 0;
      Object.keys(tagCounts).forEach(tag => {
        if (tagCounts[tag] > maxTagCount) {
          maxTagCount = tagCounts[tag];
          topTag = tag;
        }
      });

      if (topTag && maxTagCount >= 3) {
        const matchingIds = nodes.filter(n => n.tags.map(t => t.toLowerCase()).includes(topTag)).map(n => n._id.toString());
        insights.push({
          type: 'Emerging Topic',
          title: `Emerging Topic: #${topTag}`,
          description: `The tag "${topTag}" is trending across ${maxTagCount} resources. Consider summarizing these nodes collectively to extract unified principles.`,
          sourceIds: matchingIds.slice(0, 3)
        });
      }

      // C. Knowledge Gap (Isolated Nodes)
      const isolated = nodes.filter(n => !degreeMap[n._id.toString()]);
      if (isolated.length > 0) {
        insights.push({
          type: 'Knowledge Gap',
          title: 'Isolated Knowledge Nodes',
          description: `You have ${isolated.length} resource(s) with zero connections, including "${isolated[0].title}". Synthesize their placement to integrate them into your workspace.`,
          sourceIds: [isolated[0]._id.toString()]
        });
      } else {
        // D. Recurring Theme Fallback
        insights.push({
          type: 'Recurring Theme',
          title: 'Unified Personal Taxonomies',
          description: 'A stable connection ratio detected. Your notes and project deliverables demonstrate highly coordinated terminology.',
          sourceIds: nodes.slice(0, 2).map(n => n._id.toString())
        });
      }

      // E. Related Knowledge
      if (nodes.length > 2 && links.length > 1) {
        insights.push({
          type: 'Related Knowledge',
          title: 'Implicit Related Concept Cluster',
          description: `The network structure suggests potential implicit connections between several topics in your graph. Explore their overlap manually.`,
          sourceIds: [nodes[0]._id.toString(), nodes[nodes.length - 1]._id.toString()]
        });
      }

      return insights;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Given these personal knowledge nodes:
${nodes.map(n => `- ID: ${n._id.toString()}, Title: ${n.title}, Type: ${n.type}, Content: ${n.content.slice(0, 120)}, Tags: ${n.tags.join(', ')}`).join('\n')}

And these active connections:
${links.map(l => `- Node ${l.source} connects to Node ${l.target} (labeled: "${l.label}")`).join('\n')}

Analyze this personal knowledge network and generate 3 to 5 highly relevant insights. Each insight must belong to one of these types: "New Connection", "Emerging Topic", "Knowledge Gap", "Related Knowledge", "Recurring Theme".

Return a JSON array of objects:
[
  {
    "type": "New Connection | Emerging Topic | Knowledge Gap | Related Knowledge | Recurring Theme",
    "title": "A short descriptive title for the insight",
    "description": "A detailed explanation of why this insight was generated from their graph data",
    "sourceIds": ["array of node ID strings that this insight is based on"]
  }
]
Return ONLY the raw JSON array. Do not include markdown codeblocks or backticks. If no insights can be derived, return an empty array [].`;

      const result = await model.generateContent(prompt);
      return cleanJsonResponse(result.response.text());
    } catch (error) {
      console.error('Gemini generateInsights failed, using mock fallback:', error);
      isMock = true;
      const fallback = await aiService.generateInsights(nodes, links);
      isMock = false;
      return fallback;
    }
  },

  // 4. Answers a conversational question in natural language about the graph
  answerKnowledgeQuestion: async (query, nodes, links) => {
    if (isMock) {
      const queryLower = query.toLowerCase();
      const matchedNodeIds = [];
      const reasons = {};

      // Match query terms
      nodes.forEach(n => {
        let matched = false;
        let reason = '';

        if (queryLower.includes(n.title.toLowerCase())) {
          matched = true;
          reason = `Explicit match for title "${n.title}"`;
        } else if (n.tags.some(t => queryLower.includes(t.toLowerCase()))) {
          matched = true;
          reason = `Connected through tag match: ${n.tags.filter(t => queryLower.includes(t.toLowerCase())).join(', ')}`;
        } else if (n.content && n.content.toLowerCase().includes(queryLower)) {
          matched = true;
          reason = 'Matches query keywords inside content details';
        } else {
          // Check for keyword overlap in title
          const queryWords = queryLower.split(/\W+/).filter(w => w.length > 3);
          const titleWords = n.title.toLowerCase().split(/\W+/);
          const sharedWords = queryWords.filter(w => titleWords.includes(w));
          if (sharedWords.length > 0) {
            matched = true;
            reason = `Keyword overlap in title: ${sharedWords.map(w => `'${w}'`).join(', ')}`;
          }
        }

        if (matched) {
          matchedNodeIds.push(n._id.toString());
          reasons[n._id.toString()] = reason;
        }
      });

      // Expand to direct neighbors of matches
      matchedNodeIds.forEach(mId => {
        links.forEach(l => {
          let neighborId = null;
          if (l.source.toString() === mId) neighborId = l.target.toString();
          if (l.target.toString() === mId) neighborId = l.source.toString();

          if (neighborId && !matchedNodeIds.includes(neighborId)) {
            matchedNodeIds.push(neighborId);
            const neighborNode = nodes.find(n => n._id.toString() === neighborId);
            const hubNode = nodes.find(n => n._id.toString() === mId);
            reasons[neighborId] = `Connected to match "${hubNode.title}" via relationship "${l.label}"`;
          }
        });
      });

      // Group matches by type for answer formatting
      const matches = nodes.filter(n => matchedNodeIds.includes(n._id.toString()));
      let answerMarkdown = `### AI Search Analysis

Based on your personal knowledge base, I interpreted your query **"${query}"** and mapped it to **${matches.length}** related resources.

`;

      if (matches.length > 0) {
        answerMarkdown += `#### Relevant Knowledge Categories:\n`;
        const grouped = matches.reduce((acc, curr) => {
          acc[curr.type] = acc[curr.type] || [];
          acc[curr.type].push(curr);
          return acc;
        }, {});

        Object.keys(grouped).forEach(type => {
          answerMarkdown += `- **${type.toUpperCase()}s**:\n`;
          grouped[type].forEach(n => {
            answerMarkdown += `  - **${n.title}** — _Relevance: ${reasons[n._id.toString()] || 'Indirect cluster match'}_\n`;
          });
        });
        
        answerMarkdown += `\nWould you like me to generate a combined summary of these resources, or explore their connections in the interactive graph above?`;
      } else {
        answerMarkdown += `I couldn't find any resources that directly matched your query keywords. Try searching for specific tags or project names active in your workspace.`;
      }

      return {
        answer: answerMarkdown,
        relevantNodeIds: matchedNodeIds,
        reasons
      };
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are a conversational AI Knowledge Assistant for a user's personal knowledge graph.
User query: "${query}"

User's Graph Nodes:
${nodes.map(n => `- ID: ${n._id.toString()}, Title: ${n.title}, Type: ${n.type}, Content: ${n.content.slice(0, 150)}, Tags: ${n.tags.join(', ')}`).join('\n')}

User's Graph Connections:
${links.map(l => `- Node ${l.source} connects to Node ${l.target} (relationship: "${l.label}")`).join('\n')}

Analyze the user's query, search for relevant resources in the graph, resolve relationship matches (e.g. if they ask "What is connected to Project Alpha?", find Project Alpha and its connected neighbors).
Provide a structured response. Write a conversational explanation ("answer") in markdown, identify all relevant node IDs, and provide a short relevance explanation for each.

Your output must be in EXACT JSON format:
{
  "answer": "A markdown string containing the conversational response, grouping nodes and explaining findings. Make sure it is descriptive.",
  "relevantNodeIds": ["array of node ID strings that are relevant to this query"],
  "reasons": {
    "node_id_1": "Brief explanation of why it is relevant (e.g. 'Shares tag AI', 'Directly connected to Project Alpha')"
  }
}
Return ONLY the raw JSON object. Do not include markdown codeblocks or backticks.`;

      const result = await model.generateContent(prompt);
      return cleanJsonResponse(result.response.text());
    } catch (error) {
      console.error('Gemini answerKnowledgeQuestion failed, using mock fallback:', error);
      isMock = true;
      const fallback = await aiService.answerKnowledgeQuestion(query, nodes, links);
      isMock = false;
      return fallback;
    }
  },
  // 5. Generate combined summary for multiple selected nodes
  generateMultiSummary: async (nodes) => {
    if (isMock) {
      const titles = nodes.map(n => `"${n.title}" (${n.type})`).join(', ');
      const allTags = [...new Set(nodes.flatMap(n => n.tags))];
      const tagString = allTags.length > 0 ? allTags.join(', ') : 'None';
      
      return `## Combined Summary

This combined report synthesizes information from **${nodes.length} selected resources**: ${titles}.

## Key Concepts
- **Core Topics**: ${tagString}
- **Aggregated Scope**: Multi-type knowledge elements including notes, documents, and reference resources.

## Important Relationships
- Explicit connections are maintained via shared tags: ${allTags.slice(0, 3).join(', ') || 'No overlapping tags'}.
- Close semantic association is suggested based on text proximity.

## Common Themes
- Terminology overlaps heavily around key concepts like: ${allTags.slice(0, 2).join(', ') || 'general categories'}.
- High concentration of reference content supporting your workspace deliverables.

## Contradictions or Gaps
- **Gap**: Ensure reference URLs are active for bookmark resources.
- **Gap**: Verify if any notes contradict active deliverables.

## Suggested Next Actions
1. Form explicit connections in the "Connection Explorer" tab for these resources.
2. Generate individual AI summaries for each node to build a high-fidelity semantic index.`;
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are an AI Personal Knowledge assistant. Summarize the following selected resources together:
${nodes.map((n, i) => `Resource ${i+1} [${n.type.toUpperCase()}]: "${n.title}"
Content: ${n.content}
Tags: ${n.tags.join(', ')}`).join('\n\n')}

Format your response exactly as a structured markdown summary with these sections:
## Combined Summary
[A summary of what these combined resources cover]

## Key Concepts
[Key themes and concepts across all selected resources, with bullet points]

## Important Relationships
[How these resources are linked or connected by tags or references, with bullet points]

## Common Themes
[Common themes emerging from these items, with bullet points]

## Contradictions or Gaps
[Any gaps in information or contradictions between these items, with bullet points]

## Suggested Next Actions
[Actionable next steps to synthesize this knowledge cluster]`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini generateMultiSummary failed, using mock fallback:', error);
      isMock = true;
      const fallback = await aiService.generateMultiSummary(nodes);
      isMock = false;
      return fallback;
    }
  }
};

module.exports = aiService;
