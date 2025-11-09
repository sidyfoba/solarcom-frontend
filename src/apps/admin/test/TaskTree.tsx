// src/components/TaskFlow.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// import "./taskflow.css"; // Optional: add your own styles here

// Define types for tasks and React Flow elements
interface Task {
  id: string;
  title: string;
  status: string;
  parentTaskId: string | null;
}

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const TaskTree: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [nodeName, setNodeName] = useState("Node 1");
  const [nodeBg, setNodeBg] = useState("#eee");
  const [nodeHidden, setNodeHidden] = useState(false);

  // Fetch task data from API
  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>("http://localhost:8080/tasks");
      const tasks = response.data;
      const { nodes, edges } = transformTasksToFlowElements(tasks);
      setNodes(nodes);
      setEdges(edges);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  // Convert tasks into React Flow nodes and edges
  const transformTasksToFlowElements = (tasks: Task[]) => {
    const nodeMap = new Map<string, Node>();
    const edges: Edge[] = [];

    // Create nodes
    tasks.forEach((task) => {
      nodeMap.set(task.id, {
        id: task.id,
        type: "default",
        data: { label: `${task.title}\n(${task.status})` },
        position: { x: Math.random() * 600, y: Math.random() * 400 },
        style: {
          border: "1px solid #222",
          borderRadius: "5px",
          padding: "10px",
          backgroundColor: "#fff",
        },
      });
    });

    // Create edges
    tasks.forEach((task) => {
      if (task.parentTaskId) {
        edges.push({
          id: `e${task.parentTaskId}-${task.id}`,
          source: task.parentTaskId,
          target: task.id,
          animated: true,
          style: { stroke: "#ff0072", strokeWidth: 2 },
        });
      }
    });

    return { nodes: Array.from(nodeMap.values()), edges };
  };

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "1") {
          return {
            ...node,
            data: {
              ...node.data,
              label: nodeName,
            },
            style: {
              ...node.style,
              backgroundColor: nodeBg,
            },
            hidden: nodeHidden,
          };
        }
        return node;
      })
    );
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === "e1-2") {
          return {
            ...edge,
            hidden: nodeHidden,
          };
        }
        return edge;
      })
    );
  }, [nodeName, nodeBg, nodeHidden, setNodes, setEdges]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ height: "800px", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        defaultViewport={defaultViewport}
        minZoom={0.2}
        maxZoom={4}
        attributionPosition="bottom-left"
        fitView
        fitViewOptions={{ padding: 0.5 }}
      >
        <MiniMap nodeColor={(node) => "#ff0072"} />
        <Controls />
        <Background />
      </ReactFlow>
      <div className="taskflow__controls">
        <label>Node Label:</label>
        <input
          value={nodeName}
          onChange={(evt) => setNodeName(evt.target.value)}
        />

        <label className="taskflow__bglabel">Background Color:</label>
        <input
          type="color"
          value={nodeBg}
          onChange={(evt) => setNodeBg(evt.target.value)}
        />

        <div className="taskflow__checkboxwrapper">
          <label>Hide Node 1:</label>
          <input
            type="checkbox"
            checked={nodeHidden}
            onChange={(evt) => setNodeHidden(evt.target.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskTree;
