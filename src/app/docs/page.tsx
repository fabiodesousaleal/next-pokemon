import { promises as fs } from 'fs';
import path from 'path';
import CodeBlock from './_components/code-block';


export default async function DocsPage() {
  const filePath = path.join(process.cwd(), '/src/app/docs/_wiki', 'next-auth.txt');
  const code = await fs.readFile(filePath, 'utf-8');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Exemplo de Componente de Bloco de Código</h1>
      <CodeBlock code={code} />
    </div>
  );
}


