"use client"
import { motion } from "framer-motion"; // Importa el componente motion
import { useRouter } from 'next/navigation'; // Importa el hook useRouter
import { useState, useEffect } from 'react'; // Importa los hooks useState y useEffect
import axios from 'axios'; // Importa axios

// Define la interfaz Usuario
interface Usuario {
    id: number;
    nombre: string;
    tiempo: string;
}


export default function Home() {
    const router = useRouter(); // Inicializa el hook useRouter
    const [showPage, setShowPage] = useState(false); // Nuevo estado para controlar la animación
    const [usuarios, setUsuarios] = useState<Usuario[]>([]); // Nuevo estado para almacenar los usuarios
    const [isLoading, setIsLoading] = useState(true); // Nuevo estado para controlar la carga

    // Define la función handleClick
    const handleClick = () => {
        setShowPage(true);
    };

    // Define el efecto useEffect
    useEffect(() => {
        // Define la función fetchUsers
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/usuarios`); // Llama a la base de datos
                const sortedUsers = response.data.sort((a:Usuario, b:Usuario) => Number(a.tiempo) - Number(b.tiempo)); // Ordena los usuarios por tiempo
                setUsuarios(sortedUsers); // Actualiza el estado usuarios
                setIsLoading(false); // Actualiza el estado isLoading
            } catch (error) {
                console.error(error); // Muestra un error en la consola
            }
        };

        fetchUsers(); // Llama a la función fetchUsers
    }, []);

    // Renderiza el componente
    if (isLoading) {
        return (
            <div role="status" className="flex min-h-screen flex-col items-center justify-center">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"/>
                <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
        );
    } else {


        return (
            <main className="flex min-h-screen flex-col items-center justify-center ">
                <motion.div className="text-center"
                            animate={{x: showPage ? -1000 : 0}} // Mueve el div fuera de la vista de la pantalla
                            transition={{duration: 0.3}} // Duración de la animación
                            onAnimationComplete={() => {
                                if (showPage) {
                                    router.push('/acertijo');
                                }
                            }}
                >
                    <h1 className="text-3xl nunito-bold">ACERTIJO</h1>
                    <div className="m-20">
                        <div className="relative inline-flex  group">
                            <button
                                className="learn-more nunito"
                                onClick={handleClick}
                            >
                                Comenzar
                            </button>
                        </div>
                    </div>
                    {usuarios.length > 0 ? (
                        <div>
                        <h2 className=" nunito-bold text-[20px] m-4">Top 5</h2>
                        <table className="w-full text-center rtl:text-right text-gray-500 nunito ">
                            <thead className=" text-gray-700 uppercase m-5 ">
                            <tr className="px-6 py-3 text-[18px] ">
                                <th className="w-1/2">Nombre</th>
                                <th className="w-1/2">Tiempo</th>
                            </tr>
                            </thead>
                            <tbody className=" border-b text-[18px]">
                            {usuarios.slice(0, 5).map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.nombre}</td>
                                    <td>{usuario.tiempo} segundos</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    ) : null}
                    
                </motion.div>
            </main>
        );
    }
}