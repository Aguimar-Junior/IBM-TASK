import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  StatusBar,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { getDatabase, ref, set, onValue } from "firebase/database";

const Tasks = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const auth = getAuth();
  const router = useRouter();
  const database = getDatabase();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error("Erro ao sair:", error);
      });
  };

  const handleAddTask = () => {
    if (task) {
      const newTask = {
        id: Date.now().toString(),
        text: task,
        status: "pendente",
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setTask("");
      saveTasks(updatedTasks);
    }
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
    setSelectedTask(null);
  };

  const handleUpdateTask = (updatedText, updatedStatus) => {
    const updatedTasks = tasks.map((t) =>
      t.id === selectedTask.id
        ? { ...t, text: updatedText, status: updatedStatus }
        : t
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setIsEditing(false);
    setSelectedTask(null);
    filterTasks(updatedTasks);
  };

  const filterTasks = (tasksToFilter = tasks) => {
    if (statusFilter === "all") {
      setFilteredTasks(tasksToFilter);
    } else {
      setFilteredTasks(tasksToFilter.filter((task) => task.status === statusFilter));
    }
  };

  // Salva as tarefas no Firebase Realtime Database usando o UID do usuário
  const saveTasks = (tasks) => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      set(ref(database, `tasks/${userId}`), tasks)
        .then(() => console.log("Tarefas salvas com sucesso."))
        .catch((error) => console.error("Erro ao salvar tarefas:", error));
    }
  };

  // Carrega as tarefas do Firebase Realtime Database usando o UID do usuário
  const loadTasks = () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const tasksRef = ref(database, `tasks/${userId}`);
      onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setTasks(data);
        }
      });
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pendente":
        return "red";
      case "em andamento":
        return "#0094d8";
      case "concluída":
        return "green";
      default:
        return "black";
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#007BFF" />
      <View style={styles.header}>
        <Text style={styles.title}>
          <Text style={styles.ibm}>IBM</Text> TASKS
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Digite uma tarefa"
        value={task}
        onChangeText={setTask}
        multiline={true}
        numberOfLines={2}
        maxLength={100}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Criar Tarefa</Text>
      </TouchableOpacity>

      <View style={styles.filterContainer}>
        {["all", "pendente", "em andamento", "concluída"].map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setStatusFilter(filter)}
            style={[
              styles.filterButton,
              statusFilter === filter && styles.activeFilter(filter),
            ]}
          >
            <Text style={styles.filterText(statusFilter === filter)}>
              {filter === "all" ? "Todas" : filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={styles.taskText}>
              {item.text} - <Text style={{ color: getStatusColor(item.status) }}>{item.status}</Text>
            </Text>
            <View style={styles.taskActions}>
              <TouchableOpacity
                onPress={() => handleOpenEdit(item)}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteTask(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {isEditing && selectedTask && (
        <View style={styles.cardContainer}>
          <View style={styles.editCard}>
            <TextInput
              style={styles.modalInput}
              placeholder="Editar tarefa"
              value={selectedTask.text}
              onChangeText={(text) => setSelectedTask({ ...selectedTask, text })}
              multiline={true}
              numberOfLines={1}
            />

            <View style={styles.modalStatusContainer}>
              <Text style={styles.modalStatusText}>Status:</Text>
              <View>
                {["pendente", "em andamento", "concluída"].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[styles.statusButton, selectedTask.status === status && styles.activeStatus]}
                    onPress={() => setSelectedTask((prev) => ({ ...prev, status }))}
                  >
                    <Text style={styles.statusButtonText}>{status}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={() => handleUpdateTask(selectedTask.text, selectedTask.status)}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCancelButton} onPress={handleCloseEdit}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  ibm: {
    color: "#007BFF",
  },
  logoutButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filterButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  activeFilter: (filter) => ({
    backgroundColor: filter === "all"
      ? "#0056b3" // Azul mais escuro para 'Todas'
      : filter === "pendente"
      ? "#c70000" // Vermelho mais forte para 'Pendente'
      : filter === "em andamento"
      ? "#0094d8" // Azul claro para 'Em Andamento'
      : filter === "concluída"
      ? "#218838" // Verde mais forte para 'Concluída'
      : "#ccc",
  }),
  filterText: (isActive) => ({
    color: isActive ? "white" : "#007BFF", // Muda a cor com base na atividade
    fontWeight: "bold",
  }),
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  taskText: {
    fontSize: 16,
    flex: 1,
  },
  taskActions: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  editButtonText: {
    color: "white",
  },
  deleteButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
  },
  cardContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  editCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    height: "70%",
    justifyContent: "space-between",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    flex: 1,
    maxHeight: 150, 
    textAlignVertical: "top",
  },
  modalStatusContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalStatusText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  activeStatus: {
    backgroundColor: "#007BFF",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalSaveButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Tasks;
