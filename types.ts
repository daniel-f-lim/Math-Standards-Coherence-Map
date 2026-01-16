
// Import d3 to access SimulationNodeDatum and SimulationLinkDatum types
import * as d3 from 'd3';

export interface Standard {
  Code: string;
  Description: string;
  Domain: string;
  Grade: string;
  Cluster: string;
  Clarifications?: string;
  Examples?: string;
  Limitations?: string;
  StudentLearningOpportunities?: string;
  Dependencies?: string; // '|' delimited codes
}

export interface ClusterInfo {
  Cluster: string;
  Grade: string;
  Clarifications?: string;
  Limitations?: string;
  Terminology?: string;
}

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  standard: Standard;
  x?: number;
  y?: number;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}
