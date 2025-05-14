import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Por favor, preencha todos os campos");
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            Alert.alert("Erro", "Por favor, insira um email válido");
            return;
        }

        setLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                console.log("Login bem-sucedido, redirecionando...");
                // navigation.navigate('Dashboard' as never)
            }
        } catch (error: any) {
            console.error("Erro completo no login:", error);
            
            let errorMessage = "Falha no login. Verifique suas credenciais";
            
            if (error.response?.data?.errors) {
                errorMessage = error.response.data.errors[0].message;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert("Erro", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
         <Text style={styles.title}>TODO-LIST</Text>
            <Image 
                source={require('./tasklogo.png')} 
                style={styles.logo}
                resizeMode="contain"
            />
           
            
            <Text style={styles.title}>Login</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#B8D8E0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#B8D8E0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            
            <TouchableOpacity 
                style={styles.button} 
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Carregando..." : "Entrar"}
                </Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Não tem uma conta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
                    <Text style={styles.registerLink}>Cadastre-se</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

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
        marginBottom: 20,
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
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 19,
    },
    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
       
    },
    registerText: {
        color: "rgba(255, 255, 255, 0.8)",
          fontSize: 18,
    },
    registerLink: {
        color: "#18ACDE",
        fontWeight: "bold",
         fontSize: 18,
    },
});

export default Login;