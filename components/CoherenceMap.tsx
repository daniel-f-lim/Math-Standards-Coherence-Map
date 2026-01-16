
import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Standard, GraphNode, GraphLink } from '../types';

interface CoherenceMapProps {
  standards: Standard[];
  onSelectStandard: (standard: Standard) => void;
  selectedStandard: Standard | null;
  searchQuery: string;
}

const CoherenceMap: React.FC<CoherenceMapProps> = ({ standards, onSelectStandard, selectedStandard, searchQuery }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

  // Identify relationship categories
  const relationshipMaps = useMemo(() => {
    const prerequisites = new Set<string>();
    const dependents = new Set<string>();
    if (!selectedStandard) return { prerequisites, dependents };

    if (selectedStandard.Dependencies) {
      selectedStandard.Dependencies.split('|').forEach(d => prerequisites.add(d.trim()));
    }

    standards.forEach(s => {
      const deps = s.Dependencies?.split('|').map(d => d.trim()) || [];
      if (deps.includes(selectedStandard.Code)) {
        dependents.add(s.Code);
      }
    });

    return { prerequisites, dependents };
  }, [selectedStandard, standards]);

  // Identify nodes that match the search string
  const searchMatchIds = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 1) return new Set<string>();
    return new Set(
      standards
        .filter(s => s.Code.toLowerCase().includes(q))
        .map(s => s.Code)
    );
  }, [searchQuery, standards]);

  // INITIAL LAYOUT: Only runs when standards (grade) changes
  useEffect(() => {
    if (!svgRef.current || standards.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");
    containerRef.current = g.node() as SVGGElement;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    zoomRef.current = zoom;
    svg.call(zoom);

    const nodes: GraphNode[] = standards.map(s => ({ id: s.Code, standard: s }));
    const links: GraphLink[] = [];

    standards.forEach(s => {
      if (s.Dependencies) {
        const deps = s.Dependencies.split('|').map(d => d.trim());
        deps.forEach(depCode => {
          if (standards.find(st => st.Code === depCode)) {
            links.push({ source: depCode, target: s.Code });
          }
        });
      }
    });

    // Create markers
    const defs = svg.append("defs");
    defs.append("marker").attr("id", "arrow-std").attr("viewBox", "0 -5 10 10").attr("refX", 75).attr("refY", 0).attr("orient", "auto").attr("markerWidth", 5).attr("markerHeight", 5).append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#94a3b8");
    defs.append("marker").attr("id", "arrow-pre").attr("viewBox", "0 -5 10 10").attr("refX", 75).attr("refY", 0).attr("orient", "auto").attr("markerWidth", 7).attr("markerHeight", 7).append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#0ea5e9");
    defs.append("marker").attr("id", "arrow-dep").attr("viewBox", "0 -5 10 10").attr("refX", 75).attr("refY", 0).attr("orient", "auto").attr("markerWidth", 7).attr("markerHeight", 7).append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#8b5cf6");

    const linkGroup = g.append("g").attr("class", "links");
    const nodeGroup = g.append("g").attr("class", "nodes");

    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(280))
      .force("charge", d3.forceManyBody().strength(-2200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(140))
      .velocityDecay(0.4); // Faster stabilization

    simulationRef.current = simulation;

    const linkSelection = linkGroup.selectAll("path")
      .data(links)
      .enter().append("path")
      .attr("class", "link transition-all duration-300")
      .attr("fill", "none")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow-std)");

    const nodeSelection = nodeGroup.selectAll("g")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node-group cursor-pointer transition-all duration-300")
      .on("click", (event, d) => onSelectStandard(d.standard))
      .call(d3.drag<SVGGElement, GraphNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.1).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x; d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        }) as any);

    nodeSelection.append("rect").attr("width", 140).attr("height", 80).attr("rx", 12).attr("x", -70).attr("y", -40).attr("fill", "white").attr("stroke", "#e2e8f0").attr("stroke-width", 2).attr("class", "node-rect transition-all duration-300");
    nodeSelection.append("text").text(d => d.id).attr("text-anchor", "middle").attr("dy", "-12").attr("class", "node-code font-black text-[14px] fill-slate-800 transition-colors duration-300 pointer-events-none");
    nodeSelection.append("text").text(d => d.standard.Description.length > 25 ? d.standard.Description.substring(0, 22) + "..." : d.standard.Description).attr("text-anchor", "middle").attr("dy", "8").attr("class", "node-desc text-[9px] fill-slate-500 font-medium transition-colors duration-300 pointer-events-none");
    nodeSelection.append("text").text(d => d.standard.Domain).attr("text-anchor", "middle").attr("dy", "24").attr("class", "node-domain text-[8px] font-bold uppercase tracking-wider fill-slate-400 transition-colors duration-300 pointer-events-none");

    simulation.on("tick", () => {
      linkSelection.attr("d", (d: any) => `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`);
      nodeSelection.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Stop simulation after a few seconds to prevent constant movement
    const timer = setTimeout(() => {
      simulation.stop();
    }, 4000);

    return () => {
      clearTimeout(timer);
      simulation.stop();
    };
  }, [standards]);

  // VISUAL UPDATES: Selected, Search Matches (WITHOUT simulation restart)
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    const svg = d3.select(svgRef.current);
    const { prerequisites, dependents } = relationshipMaps;
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Pan & Zoom to Selection
    if (selectedStandard && zoomRef.current) {
      const allNodes = simulationRef.current?.nodes() || [];
      const target = allNodes.find(n => n.id === selectedStandard.Code);
      if (target && target.x !== undefined && target.y !== undefined) {
        svg.transition().duration(800).ease(d3.easeCubicInOut).call(
          zoomRef.current.transform,
          d3.zoomIdentity.translate(width / 2, height / 2).scale(1.2).translate(-target.x, -target.y)
        );
      }
    }

    // Update Nodes
    svg.selectAll<SVGGElement, GraphNode>(".node-group")
      .style("opacity", d => {
        if (!selectedStandard) return 1;
        const isRelated = d.id === selectedStandard.Code || prerequisites.has(d.id) || dependents.has(d.id);
        const isSearchMatch = searchMatchIds.has(d.id);
        return (isRelated || isSearchMatch) ? 1 : 0.15;
      });

    svg.selectAll<SVGRectElement, GraphNode>(".node-rect")
      .attr("fill", d => {
        if (d.id === selectedStandard?.Code) return "#2563eb";
        if (prerequisites.has(d.id)) return "#f0f9ff";
        if (dependents.has(d.id)) return "#f5f3ff";
        if (searchMatchIds.has(d.id)) return "#fffbeb";
        return "white";
      })
      .attr("stroke", d => {
        if (d.id === selectedStandard?.Code) return "#1d4ed8";
        if (prerequisites.has(d.id)) return "#0ea5e9";
        if (dependents.has(d.id)) return "#8b5cf6";
        if (searchMatchIds.has(d.id)) return "#f59e0b";
        return "#e2e8f0";
      })
      .attr("stroke-width", d => {
        if (d.id === selectedStandard?.Code) return 5;
        if (prerequisites.has(d.id) || dependents.has(d.id)) return 3;
        if (searchMatchIds.has(d.id)) return 4;
        return 2;
      })
      .attr("stroke-dasharray", d => {
        if (searchMatchIds.has(d.id) && d.id !== selectedStandard?.Code && !prerequisites.has(d.id) && !dependents.has(d.id)) return "4,2";
        return null;
      });

    // Update Node Text
    svg.selectAll<SVGTextElement, GraphNode>(".node-code").style("fill", d => d.id === selectedStandard?.Code ? "white" : prerequisites.has(d.id) ? "#0369a1" : dependents.has(d.id) ? "#6d28d9" : searchMatchIds.has(d.id) ? "#92400e" : "#1e293b");
    svg.selectAll<SVGTextElement, GraphNode>(".node-desc").style("fill", d => d.id === selectedStandard?.Code ? "#dbeafe" : prerequisites.has(d.id) ? "#0ea5e9" : dependents.has(d.id) ? "#8b5cf6" : searchMatchIds.has(d.id) ? "#b45309" : "#64748b");
    svg.selectAll<SVGTextElement, GraphNode>(".node-domain").style("fill", d => d.id === selectedStandard?.Code ? "#93c5fd" : prerequisites.has(d.id) ? "#0ea5e9" : dependents.has(d.id) ? "#8b5cf6" : searchMatchIds.has(d.id) ? "#b45309" : "#94a3b8");

    // Update Links
    svg.selectAll<SVGPathElement, GraphLink>(".link")
      .attr("stroke", (d: any) => {
        if (!selectedStandard) return "#cbd5e1";
        if (d.target.id === selectedStandard.Code) return "#0ea5e9";
        if (d.source.id === selectedStandard.Code) return "#8b5cf6";
        return "#e2e8f0";
      })
      .attr("stroke-width", (d: any) => {
        if (!selectedStandard) return 2;
        const isRelated = d.source.id === selectedStandard.Code || d.target.id === selectedStandard.Code;
        return isRelated ? 4 : 1;
      })
      .attr("marker-end", (d: any) => {
        if (!selectedStandard) return "url(#arrow-std)";
        if (d.target.id === selectedStandard.Code) return "url(#arrow-pre)";
        if (d.source.id === selectedStandard.Code) return "url(#arrow-dep)";
        return "url(#arrow-std)";
      })
      .style("opacity", (d: any) => {
        if (!selectedStandard) return 1;
        const isRelated = d.source.id === selectedStandard.Code || d.target.id === selectedStandard.Code;
        return isRelated ? 1 : 0.05;
      });

  }, [selectedStandard, relationshipMaps, searchMatchIds]);

  return (
    <div className="w-full h-full bg-slate-50 relative overflow-hidden">
      <svg ref={svgRef} className="w-full h-full block" />
      <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-10">
        <button onClick={() => svgRef.current && d3.select(svgRef.current).transition().call(zoomRef.current!.scaleBy as any, 1.5)} className="w-10 h-10 bg-white shadow-md border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></button>
        <button onClick={() => svgRef.current && d3.select(svgRef.current).transition().call(zoomRef.current!.scaleBy as any, 0.7)} className="w-10 h-10 bg-white shadow-md border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg></button>
        <button onClick={() => { if (!svgRef.current || !zoomRef.current) return; d3.select(svgRef.current).transition().duration(750).call(zoomRef.current.transform, d3.zoomIdentity); }} className="w-10 h-10 bg-white shadow-md border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
      </div>
    </div>
  );
};

export default CoherenceMap;
