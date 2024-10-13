import Image from "next/image";

export default function Home() {
  const usuarios = [
    {
      "id": 1,
      "nome": "Fabio Leal",
      "email": "fsl2@msn.com",

    },
    {
      "id": 5,
      "nome": "João da Silva",
      "email": "joao@msn.com",

    },
  ]
  return (
    <>
      <h1 className="text-2xl font-bold text-blue-500 gap-4"> Usuários</h1>
      <div className="flex flex-col">
        {usuarios.map((usuario) => (
          <div className=" rounded-md bg-blue-200 text-indigo-800 gap-4 p-4 m-2">
              <span>{usuario.nome}</span>
              <span>{usuario.email}</span>
          </div>
   
         
        ))}
      </div>
      
    </>
  );
}
