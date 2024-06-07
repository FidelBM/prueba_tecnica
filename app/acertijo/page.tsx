"use client"
import { useEffect, useState } from "react"; // Importa los hooks useEffect y useState
import acertijo from "@/img/acertijo.png"; // Importa la imagen del acertijo
import { motion } from "framer-motion"; // Importa los componentes motion
import Image from "next/image"; // Importa el componente Image
import axios from 'axios'; // Importa axios
import { useRouter } from 'next/navigation'; // Importa el hook useRouter

export default function Acertijo() {
    const [seconds, setSeconds] = useState(60); // Nuevo estado para el tiempo
    const [respuestaC, setRespuestaC] = useState(''); // Nuevo estado para la respuesta C
    const [respuestaD, setRespuestaD] = useState(''); // Nuevo estado para la respuesta D
    const [nombre, setNombre] = useState(''); // Nuevo estado para el nombre del usuario
    const [mensajePerder, setMensajePerder] = useState(false); // Nuevo estado para el mensaje de perder
    const [mensajeGanar, setMensajeGanar] = useState(false); // Nuevo estado para el mensaje de ganar
    const [mensajeEmpezar, setMensajeEmpezar] = useState(true); // Nuevo estado para el mensaje de empezar
    const [respuestaIncorrecta, setRespuestaIncorrecta] = useState(false); // Nuevo estado para la respuesta incorrecta
    const [intervalId, setIntervalId] = useState<number | null>(null); // Nuevo estado para el identificador del intervalo
    const router = useRouter(); // Inicializa el hook useRouter
    const [errorNombre, setErrorNombre] = useState(false); // Nuevo estado para el error del nombre

    // Define la función startTimer
    const startTimer = () => {
        // Inicializa el intervalo
        let interval = setInterval(() => {
            setSeconds(seconds => seconds - 1);
        }, 1000) as unknown as number; // Afirmación de tipo

        setIntervalId(interval); // Guardar el identificador del intervalo
        setMensajeEmpezar(false); // Hide the start message
    };

    // Define el efecto useEffect
    useEffect(() => {
        // Verifica si el tiempo ha llegado a 0
        if(seconds === 0){
            setMensajePerder(true); // Muestra el mensaje de perder
            if (intervalId !== null) {
                clearInterval(intervalId); // Detener el tiempo si el tiempo ha llegado a 0
            }
        }
    }, [seconds]);

    // Define la función onSubmit
    const onSubmit = (event : React.FormEvent) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto para que no recarge la página
        // Verifica si las respuestas son correctas
        if (
            respuestaC === undefined || respuestaC === '' ||
            respuestaD === undefined || respuestaD === ''
        ) {
            setRespuestaIncorrecta(true); // Muestra que la respuesta es incorrecta
        } else {
            // Verifica si las respuestas son correctas
            if (parseInt(respuestaC) == 1 && parseInt(respuestaD) == 0) {
                setMensajeGanar(true); // Muestra el mensaje de ganar
                if (intervalId !== null) {
                    clearInterval(intervalId); // Detener el tiempo si la respuesta es correcta
                }
            }else{
                setRespuestaIncorrecta(true); // Muestra que la respuesta es incorrecta
            }
        }
    }

    // Define la función subir el nombre si contestaste correctamente
    const subirTiempo = async (event : React.FormEvent) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto para que no recarge la página
        const tiempo = 60 - seconds; // Calcula el tiempo

        if (nombre === undefined || nombre === '') {
            setErrorNombre(true); // Muestra el error del nombre
            return;
        }

        // Crea un objeto usuario
        const usuario = {
            nombre: nombre,
            tiempo: tiempo.toString()
        }

        // Sube el tiempo a la base de datos
        try {
            const response = await axios.post('http://localhost:8000/usuarios', usuario); // Llama a la base de datos
            router.push('/'); // Redirige a la página principal
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            {mensajeEmpezar && (
            <div
                className="nunito flex h-full w-full items-center justify-center bg-[#80808080] absolute m-1 z-40 p-3 ">

                <motion.div
                    className="bg-white h-4/5 sm:h-1/2 md:w-1/2 w-full rounded-2xl flex flex-col items-center justify-center p-12"
                    initial={{scale: 0.1}} // Tamaño inicial pequeño
                    animate={{scale: [0, 1.1, 1]}} // Secuencia de tamaños: normal, más grande, normal
                    transition={{duration: 0.3, times: [0, 0.8, 1]}}>
                    <h1 className="md:text-3xl font-bold text-black m-3 text-2xl text-center">Como jugar</h1>
                    <p className="text-black text-[18px] text-center"> A continuacion se te mostrara una suma, sin
                        embargo falta descubrir algunos números.</p>
                    <p className="text-black text-[18px] text-center"> Descubre el valor de los números faltantes y escribe sus valores, solo tienes 1 minuto.</p>
                    <button
                        onClick={() => startTimer()}
                        className="learn-more mt-4">Empezar
                    </button>
                </motion.div>
            </div>
            )}
            {mensajePerder && (
                <div
                    className="nunito flex h-full w-full items-center justify-center bg-[#80808080] absolute m-1 z-40 p-3 ">

                    <motion.div
                        className="bg-white h-4/5 sm:h-1/2 md:w-1/2 w-full rounded-2xl flex flex-col items-center justify-center p-12"
                        initial={{scale: 0.1}} // Tamaño inicial pequeño
                        animate={{scale: [0, 1.1, 1]}} // Secuencia de tamaños: normal, más grande, normal
                        transition={{duration: 0.3, times: [0, 0.8, 1]}}>
                        <h1 className="md:text-3xl font-bold text-black m-3 text-2xl text-center">¡Haz perdido!</h1>
                        <p className="text-black text-[18px] text-center"> El tiempo se ha agotado y no descubriste la
                            respuesta
                            correcta.</p>
                        <button
                            onClick={() => location.reload()}
                            className="learn-more mt-4">Reintentar
                        </button>
                    </motion.div>

                </div>
            )}

            {mensajeGanar && (
                <div className="nunito flex h-full w-full items-center justify-center bg-[#80808080] absolute m-1 z-40 p-3">

                    <motion.div
                        className="bg-white h-4/5 sm:h-1/2 md:w-1/2 w-full rounded-2xl flex flex-col items-center justify-center p-12"
                        initial={{scale: 0.1}} // Tamaño inicial pequeño
                        animate={{scale: [0, 1.1, 1]}} // Secuencia de tamaños: normal, más grande, normal
                        transition={{duration: 0.3, times: [0, 0.8, 1]}}
                    >
                        <h1 className="text-3xl font-bold text-black m-3 text-center">¡Haz ganado!</h1>
                        <p className="text-black text-[18px] text-center"> Felicidades haz resuelto el acertijo en {60 -seconds } segundos.</p>
                        <p className="text-black text-[18px] text-center"> Ingresa tu nombre o sobrenombre para guardar tu tiempo.</p>
                        <form onSubmit={subirTiempo}>
                            <div className="flex items-center space-x-2 m-4">
                                <label className="min-w-max">
                                    <p className="text-black text-[18px] text-center"> Nombre: </p>
                                </label>
                                <input
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    type="text"
                                    placeholder="Nombre"
                                    className="w-full border-gray-400 rounded border-[1px] border-stroke bg-transparent px-4 py-1 text-black outline-none transition focus:border-gray-400 active:border-gray-500"
                                />
                            </div>
                            {errorNombre  && <p className="text-red-500 text-center">Porfavor coloque su nombre o sobrenombre</p>}
                            <div className="w-full flex justify-center text-center">
                                <button

                                    className="learn-more m-4">Enviar
                                </button>
                            </div>
                        </form>
                    </motion.div>

                </div>
            )}
            <motion.div
                className="flex nunito min-h-screen flex-col items-center justify-center"
                initial={{x: 2000}} // Posición inicial fuera de la vista
                animate={{x: 0}} // Posición final en la vista
                transition={{duration: 0.5}} // Duración de la transición
            >
                <p className={`text-[24px]  nunito m-3  `}> Tiempo
                    restante: {seconds}</p>
                <div className="progress-bar m-1"
                     style={{width: `${seconds - 1}%`, backgroundColor: seconds <= 10 ? 'red' : '#4CAF50'}}></div>
                <Image src={acertijo.src} alt="Acertijo" height={acertijo.height} width={acertijo.width}
                       className="rounded md:h-2/5 md:w-2/5 m-2  h-1/3 w-[90%]"/>

                <p className=" text-[18px] m-2">Ingresa la respuesta:</p>


                <form className="text-[18px]">


                    <div className="mb-4.5 m-2">
                        <div className="max-w">
                            <div className="flex items-center space-x-2">
                                <label htmlFor="checkbox" className="min-w-max">
                                    C =
                                </label>
                                <input
                                    value={respuestaC}
                                    onChange={(e) => setRespuestaC(e.target.value)}
                                    type="number"
                                    placeholder="Valor de C"
                                    className="w-full border-gray-400 rounded border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-gray-400 active:border-gray-500 "
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-4.5 m-2">
                        <div className="max-w">
                            <div className="flex items-center space-x-2">
                                <label htmlFor="checkbox" className="min-w-max">
                                    D =
                                </label>
                                <input
                                    value={respuestaD}
                                    onChange={(e) => setRespuestaD(e.target.value)}
                                    type="number"
                                    placeholder="Valor de D"
                                    className="w-full border-gray-400  rounded border-[1.5px] border-stroke bg-transparent px-5 py-2 text-black outline-none transition focus:border-gray-400 active:border-gray-500"
                                />
                            </div>
                        </div>
                    </div>
                    {respuestaIncorrecta && <p className="text-red-500 text-center">Respuesta incorrecta</p>}

                    <div className="w-full flex justify-center text-center">
                        <button
                            className="learn-more m-2 justify-center"
                            onClick={onSubmit}
                        >
                            Subir
                        </button>
                    </div>

                </form>


            </motion.div>

        </div>
    );
}
