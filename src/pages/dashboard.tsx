import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { FontAwesome , Ionicons} from '@expo/vector-icons';

const Dashboard = () => {
  const {
    user,
    logout,
    tasks: contextTasks,
    fetchTasks,
    createTask,
    toggleTask,
    deleteTask
  } = useAuth();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        await fetchTasks();
        setError(null);
      } catch (error) {
        setError("Falha ao carregar tarefas");
        console.error("Erro ao carregar tarefas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert("Ops!", "Digite um título para a tarefa");
      return;
    }

    try {
      await createTask(newTaskTitle, newTaskDescription.trim() || undefined);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setShowDescriptionInput(false);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      Alert.alert("Erro", "Não foi possível adicionar a tarefa");
    }
  };

  const handleToggleTask = async (id: number) => {
    try {
      await toggleTask(id);
      if (expandedTaskId === id) {
        setExpandedTaskId(null);
      }
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      Alert.alert("Erro", "Não foi possível atualizar a tarefa");
    }
  };

  const handleRemoveTask = async (id: number) => {
    try {
      await deleteTask(id);
      if (expandedTaskId === id) {
        setExpandedTaskId(null);
      }
    } catch (error) {
      console.error("Erro ao remover tarefa:", error);
      Alert.alert("Erro", "Não foi possível remover a tarefa");
    }
  };

  const toggleTaskExpansion = (id: number) => {
    setExpandedTaskId(expandedTaskId === id ? null : id);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Carregando tarefas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          onPress={() => fetchTasks()} 
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{`Olá, ${user?.name || 'Usuário'}`}</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.addTaskContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nova tarefa"
          placeholderTextColor="#B8D8E0"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity 
          onPress={() => setShowDescriptionInput(!showDescriptionInput)} 
          style={styles.descriptionToggleButton}
        >
          <Text style={styles.descriptionToggleText}>Descrição</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity> */}
        <TouchableOpacity 
          onPress={handleAddTask} 
          style={styles.addButton}
        >
          <Ionicons name="bulb-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {showDescriptionInput && (
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Descrição (opcional)"
          placeholderTextColor="#B8D8E0"
          value={newTaskDescription}
          onChangeText={setNewTaskDescription}
          multiline
        />
      )}

      <FlatList
        data={contextTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <TouchableOpacity
              onPress={() => toggleTaskExpansion(item.id)}
              style={styles.taskContent}
              activeOpacity={0.7}
            >
              <View style={styles.taskItem}>
                <TouchableOpacity
                  onPress={() => handleToggleTask(item.id)}
                  style={[
                    styles.taskCheckbox,
                    item.done && styles.taskCheckboxCompleted,
                  ]}
                >
                  {item.done && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>

                <Text
                  style={[
                    styles.taskText,
                    item.done && styles.taskTextCompleted,
                  ]}
                >
                  {item.title}
                </Text>

                <TouchableOpacity
                  onPress={() => handleRemoveTask(item.id)}
                  style={styles.deleteButton}
                >
                  <FontAwesome name="trash" size={18} color="#ff6b6b" />
                </TouchableOpacity>
              </View>

              {expandedTaskId === item.id && item.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionText}>{item.description}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma tarefa cadastrada</Text>
        }
        contentContainerStyle={styles.taskList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3D7689",
    padding: 20,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 18,
    marginBottom: 20,
  },
  retryButton: {
    padding: 10,
    backgroundColor: "#18ACDE",
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop:49,
    marginBottom:30,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: "#ff6b6b",
    borderRadius: 2,
    marginTop:50,
    marginBottom:30,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addTaskContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
    fontSize: 16,
  },
  descriptionInput: {
    height: 80,
    marginBottom: 10,
    textAlignVertical: "top",
  },
  descriptionToggleButton: {
    paddingHorizontal: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    backgroundColor: "#283134",
    borderRadius: 4,
     fontWeight: "bold",
  },
  descriptionToggleText: {
    color: "#B8D8E0",
    fontSize: 12,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: "#a18d30",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
  },
  taskList: {
    flexGrow: 1,
  },
  taskContainer: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  taskContent: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#18ACDE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  taskCheckboxCompleted: {
    backgroundColor: "#18ACDE",
  },
  checkmark: {
    color: "#fff",
    fontWeight: "bold",
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: "#B8D8E0",
  },
  deleteButton: {
    padding: 4,
    marginLeft: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "#B8D8E0",
    marginTop: 20,
    fontSize: 16,
  },
  descriptionContainer: {
    padding: 15,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  descriptionText: {
    color: "#B8D8E0",
    fontSize: 14,
  },
});

export default Dashboard;