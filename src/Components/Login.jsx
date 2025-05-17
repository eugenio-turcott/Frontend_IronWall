import { useState, useEffect } from "react";
import logo from "../assets/xcien_logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  // Limpiar mensajes después de 10 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setEmailError("");
      setPasswordError("");
      setLoginError("");
    }, 10000);

    return () => clearTimeout(timer);
  }, [emailError, passwordError, loginError]);

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Limpiar errores anteriores
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    let valid = true;

    // Validaciones
    if (!email && !password) {
      setEmailError("Por favor ingresa tu correo.");
      setPasswordError("Por favor ingresa tu contraseña.");
      valid = false;
    } else {
      if (!email) {
        setEmailError("Por favor ingresa tu correo.");
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setEmailError("Formato de correo inválido.");
        valid = false;
      }

      if (!password) {
        setPasswordError("Por favor ingresa tu contraseña.");
        valid = false;
      }
    }

    if (!valid) return;

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Credenciales incorrectas");

      const data = await response.json();
      console.log("Login exitoso:", data);

      // Guarda datos o redirige
      // localStorage.setItem("token", data.access_token);
      window.location.href = "/alerts";
    } catch (error) {
      console.error("Error de login:", error);
      setLoginError(
        "Credenciales incorrectas. Intenta de nuevo o verifica con un administrador."
      );
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen">
      <div className="absolute inset-0 bg-[url(/fondo_xcien.jpg)] bg-cover brightness-75 z-0"></div>
      <div className="relative z-10 bg-white rounded-lg shadow-md w-full max-w-md overflow-hidden">
        {/* Encabezado con logo */}
        <div className="bg-blue-950 p-4 text-center">
          <img src={logo} alt="Logo XCIEN" className="max-w-[80px] mx-auto" />
        </div>
        {/* Formulario */}
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6 text-left">
              <label
                htmlFor="email"
                className="block mb-2 font-bold text-gray-700 text-sm"
              >
                Correo:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full px-4 py-2 border ${
                  emailError ? "border-red-500" : "border-gray-300"
                } rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              {emailError && (
                <p className="mt-1 text-red-600 text-sm">{emailError}</p>
              )}
            </div>

            <div className="mb-6 text-left">
              <label
                htmlFor="password"
                className="block mb-2 font-bold text-gray-700 text-sm"
              >
                Contraseña:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-2 border ${
                  passwordError ? "border-red-500" : "border-gray-300"
                } rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              {passwordError && (
                <p className="mt-1 text-red-600 text-sm">{passwordError}</p>
              )}
            </div>

            {loginError && (
              <p className="mb-4 text-red-600 text-sm text-center">
                {loginError}
              </p>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-1/2 py-3 bg-blue-950 text-white rounded-md text-base hover:bg-blue-800 transition-colors duration-300 cursor-pointer"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
