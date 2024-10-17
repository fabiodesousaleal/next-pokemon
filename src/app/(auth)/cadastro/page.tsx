import FormAccountCadastro from "./_components/account_cadastro_form";

export default function Page() { 
  return (
    <div className="mx-auto max-w-md space-y-6 p-6 bg-card rounded-lg shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Crie sua conta</h1>
        <p className="text-muted-foreground">Entre com suas informações básicas</p>
      </div>
      <FormAccountCadastro/>
    </div>
  )
}
