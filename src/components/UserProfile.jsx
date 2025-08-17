export function UserProfile({ onBack, usuario }) {
  return (
    <div className="min-h-screen bg-white p-6">
      <button onClick={onBack} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
        Back
      </button>
      <h1 className="text-2xl font-bold">UserProfile Simple Test</h1>
      <p>Usuario: {usuario}</p>
      <p>Si esto funciona, el problema está en el componente complejo.</p>
    </div>
  );
}