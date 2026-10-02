import { runCypher } from '../integrations/neo4j.client';
import { PropertyGraph, GraphNode, GraphEdge } from '@salaahkaar/shared-contracts';

export class GraphService {
  async getTopologyGraph(projectId: string): Promise<PropertyGraph> {
    // Fetch all nodes for this project
    const nodeRecords = await runCypher(
      `MATCH (n)
       WHERE n.projectId = $projectId
          OR (n:Building AND EXISTS { MATCH (p:Parcel {projectId: $projectId})-[:CONTAINS_BUILDING]->(n) })
          OR (n:Unit AND EXISTS { MATCH (p:Parcel {projectId: $projectId})-[:CONTAINS_BUILDING]->(:Building)-[:CONTAINS_UNIT]->(n) })
          OR (n:EasementPath AND EXISTS { MATCH (p:Parcel {projectId: $projectId})-[:SUBJECT_TO_EASEMENT]->(n) })
          OR (n:Conflict AND EXISTS { MATCH (n)-[:AFFECTS]->(p:Parcel {projectId: $projectId}) })
          OR (n:LegalEntity AND EXISTS { MATCH (n)-[:OWNS_PARCEL|OWNS|LEASES|MANAGES]->(t) WHERE t.projectId = $projectId OR EXISTS { MATCH (p:Parcel {projectId: $projectId})-[:CONTAINS_BUILDING]->(:Building)-[:CONTAINS_UNIT]->(t) } })
       RETURN n, labels(n) as labels, elementId(n) as eid`,
      { projectId }
    );

    const nodes: GraphNode[] = nodeRecords.map((r) => {
      const n = r.get('n');
      const labels: string[] = r.get('labels');
      const props = n.properties;
      const nodeType = labels.find((l: string) => ['Parcel', 'Building', 'Unit', 'EasementPath', 'LegalEntity', 'Conflict'].includes(l)) || 'Unknown';

      return {
        id: props.id || r.get('eid'),
        label: props.name || props.khasraNumber || props.identifier || props.title || props.id || '',
        type: nodeType as GraphNode['type'],
        properties: this.cleanNeo4jProps(props),
      };
    });

    // Fetch all relationships between project nodes
    const edgeRecords = await runCypher(
      `MATCH (a)-[r]->(b)
       WHERE a.projectId = $projectId
          OR b.projectId = $projectId
          OR EXISTS { MATCH (p:Parcel {projectId: $projectId})-[*1..3]-(a) }
       RETURN a.id as sourceId, type(r) as relType, properties(r) as relProps, b.id as targetId, elementId(r) as rid`,
      { projectId }
    );

    const edges: GraphEdge[] = edgeRecords
      .filter((r) => r.get('sourceId') && r.get('targetId'))
      .map((r) => ({
        id: r.get('rid') || `edge-${Math.random().toString(36).slice(2)}`,
        source: r.get('sourceId'),
        target: r.get('targetId'),
        type: r.get('relType'),
        properties: this.cleanNeo4jProps(r.get('relProps') || {}),
      }));

    // Deduplicate nodes by id
    const uniqueNodes = Array.from(new Map(nodes.map((n) => [n.id, n])).values());

    return { nodes: uniqueNodes, edges };
  }

  async getParcelNeighbors(parcelId: string) {
    const records = await runCypher(
      `MATCH (p:Parcel {id: $parcelId})-[r]-(n)
       RETURN p, type(r) as relType, properties(r) as relProps, n, labels(n) as labels`,
      { parcelId }
    );

    return records.map((r) => ({
      relationship: r.get('relType'),
      relProperties: this.cleanNeo4jProps(r.get('relProps') || {}),
      neighbor: {
        ...this.cleanNeo4jProps(r.get('n').properties),
        type: r.get('labels')[0],
      },
    }));
  }

  private cleanNeo4jProps(props: Record<string, any>): Record<string, any> {
    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(props)) {
      // Convert Neo4j Integer to JS number
      if (value && typeof value === 'object' && 'low' in value && 'high' in value) {
        clean[key] = value.low;
      } else {
        clean[key] = value;
      }
    }
    return clean;
  }
}
