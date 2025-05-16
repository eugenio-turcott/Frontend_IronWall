import { useState } from "react";
import logo from "../assets/xcien_logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Correo:", email);
    console.log("Contraseña:", password);
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
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
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
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

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
