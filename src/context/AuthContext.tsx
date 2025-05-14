import { createContext, useState, useEffect, PropsWithChildren } from "react"
import { api } from "../services/api"
import { Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

type User = {
    id: number
    name: string
    email: string
    token: string
}

type Task = {
    id: number
    title: string
    description: string | null
    done: boolean
    created_at: string
    updated_at: string | null
}

type AuthContextProps = {
    user: User | null
    tasks: Task[]
    login: (email: string, password: string) => Promise<boolean>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    fetchTasks: () => Promise<void>
    createTask: (title: string, description?: string) => Promise<void>
    toggleTask: (taskId: number) => Promise<void>
    deleteTask: (taskId: number) => Promise<void>
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>(null)
    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(() => {
        async function loadStorageData() {
            const storageData = await AsyncStorage.getItem("@hehehe");
            if (storageData) {
                const userData = JSON.parse(storageData) as User;
                
                api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
                
                try {
                    await api.get("/task");
                    setUser(userData);
                    await fetchTasks();
                } catch (error) {
                    await logout();
                }
            }
        }
        loadStorageData();
    }, []);


    async function login(email: string, password: string): Promise<boolean> {
        try {
            const response = await api.post('/session', { email, password });
            
          

            const userData = {
                id: response.data.user.id,
                name: response.data.user.name,
                email: response.data.user.email,
                token: response.data.user.token.token
            };

            await AsyncStorage.setItem('@hehehe', JSON.stringify(userData));
            api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
            setUser(userData);

            return true;
        } catch (error: any) {
            console.error('Erro no login:', {
                message: error.message,
                response: error.response?.data
            });

            if (error.response) {
                if (error.response.status === 401) {
                    throw new Error('Credenciais inválidas');
                }
                throw new Error(error.response.data?.message || 'Erro no servidor');
            }
            throw new Error('Sem conexão com o servidor');
        }
    }

    const register = async (name: string, email: string, password: string) => {
        try {
            const registerResponse = await api.post("/users", { name, email, password });
            const loginResponse = await api.post("/session", { email, password });


            
            const userData = {
                id: loginResponse.data.user?.id || registerResponse.data.id,
                name: loginResponse.data.user?.name || name,
                email: email,
                token: loginResponse.data.user.token.token
            };

            api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
            setUser(userData);
            await AsyncStorage.setItem("@hehehe", JSON.stringify(userData));
            await fetchTasks();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               error.message;
            
            console.error("Erro no registro:", {
                message: errorMessage,
                status: error.response?.status
            });

            throw new Error(errorMessage);
        }
    }

    const logout = async () => {
        try {
            setUser(null);
            setTasks([]);
            await AsyncStorage.removeItem("@hehehe");
            delete api.defaults.headers.common['Authorization'];
        } catch (error) {
            console.error("Erro no logout:", error);
            throw error;
        }
    }

    const fetchTasks = async () => {
        try {
            const response = await api.get("/task");
            setTasks(response.data);
        } catch (error) {
            console.error("Erro ao buscar tasks:", error);
            throw error;
        }
    }

    const createTask = async (title: string, description?: string) => {
        try {
            await api.post("/task", { title, description });
            await fetchTasks();
        } catch (error) {
            console.error("Erro ao criar tarefa:", error);
            throw error;
        }
    }

    const toggleTask = async (taskId: number) => {
        try {
            const taskToUpdate = tasks.find(task => task.id === taskId);
            if (!taskToUpdate) return;

            await api.put(`/task/${taskId}`, { done: !taskToUpdate.done });
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? { ...task, done: !task.done } : task
                )
            );
        } catch (error) {
            console.error("Erro ao alternar tarefa:", error);
            Alert.alert("Erro", "Não foi possível alternar o status da tarefa.");
        }
    }

    const deleteTask = async (taskId: number) => {
        try {
            await api.delete(`/task/${taskId}`);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error("Erro ao deletar tarefa:", error);
            throw error;
        }
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            tasks,
            login, 
            logout,
            register,
            fetchTasks,
            createTask,
            toggleTask,
            deleteTask
        }}>
            {children}
        </AuthContext.Provider>
    )
}