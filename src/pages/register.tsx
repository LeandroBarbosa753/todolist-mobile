import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from "react-native"
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../hooks/useAuth"

const Register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation()
    const { register } = useAuth()

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert("Erro", "Por favor, preencha todos os campos")
            return
        }

        if (!email.includes('@') || !email.includes('.')) {
            Alert.alert("Erro", "Por favor, insira um email válido")
            return
        }

        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem")
            return
        }

        if (password.length < 6) {
            Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres")
            return
        }

        setLoading(true)

        try {
            await register(name, email, password)
            Alert.alert("Sucesso", "Cadastro realizado com sucesso!")
            //navigation.navigate('Login' as never)
        } catch (error: any) {
            console.error("Erro completo no registro:", error)
            
            let errorMessage = "Falha no cadastro. Tente novamente mais tarde."
            if (error.response?.data?.errors) {
                errorMessage = error.response.data.errors[0].message
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message
            } else if (error.message) {
                errorMessage = error.message
            }
            
            Alert.alert("Erro", errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.todo}>TODO-LIST</Text>
            <Image 
                source={require('./tasklogo.png')} 
                style={styles.logo}
                resizeMode="contain"
            />
            
            <Text style={styles.title}>Cadastro</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor="#B8D8E0"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#B8D8E0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Senha (mínimo 6 caracteres)"
                placeholderTextColor="#B8D8E0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            
            <TextInput
                style={styles.input}
                placeholder="Confirmar senha"
                placeholderTextColor="#B8D8E0"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            
            <TouchableOpacity 
                style={styles.button} 
                onPress={handleRegister}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Carregando..." : "Cadastrar"}
                </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Já tem uma conta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                    <Text style={styles.loginLink}>Faça login</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    
        backgroundColor: "#086788",
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginBottom: 20,
    },
    todo: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
        color: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
        color: '#fff',
    },
    input: {
        height: 50,
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 1,
        marginBottom: 15,
        padding: 15,
        borderRadius: 2,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        color: '#fff',
        fontSize: 16,
    },
    button: {
        backgroundColor: "#18ACDE",
        padding: 15,
        borderRadius: 2,
        alignItems: "center",
        marginBottom: 20,
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 19,
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
    },
    loginText: {
        color: "rgba(255, 255, 255, 0.8)",
         fontSize: 18,
    },
    loginLink: {
        color: "#18ACDE",
        fontWeight: "bold",
        fontSize: 18,
    },
})

export default Register