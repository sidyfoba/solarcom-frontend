// // App.tsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import TaskGraph from "./TaskGraph";
// // import { Task } from './types';
// // types.ts
// interface Task {
//   id: string;
//   title: string;
//   description?: string;
//   status?: string;
//   dueDate?: string; // ISO date string
//   recurrence?: Recurrence;
//   recurrenceValue?: number;
//   nextDueDate?: string; // ISO date string
//   parentTaskId?: string; // Reference to the parent task
// }

// enum Recurrence {
//   DAILY = "DAILY",
//   WEEKLY = "WEEKLY",
//   MONTHLY = "MONTHLY",
// }

// export interface NodeData {
//   id: string;
//   title: string;
// }

// const TaskGraphView: React.FC = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const response = await axios.get<Task[]>("http://localhost:8080/tasks");
//         setTasks(response.data);
//         // setFilteredTasks(response.data); // Initialize filteredTasks with fetched tasks
//       } catch (err) {
//         // setError("Failed to fetch tasks");
//         // setSnackbarMessage("Failed to fetch tasks");
//         // setSnackbarSeverity("error");
//         // setSnackbarOpen(true);
//       } finally {
//         // setLoading(false);
//       }
//     };

//     fetchTasks();
//   }, []);

//   return (
//     <div>
//       <TaskGraph tasks={tasks} />
//     </div>
//   );
// };

// export default TaskGraphView;
