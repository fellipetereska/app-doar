import React, { useState } from 'react';

const FormEstoque = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: '', email: '', age: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Nome</label>
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Idade</label>
        <input
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className='flex justify-end'>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 transition-all duration-200 text-white font-medium px-8 py-2 rounded"
        >
          Salvar
        </button>
      </div>
    </form>
  );
};

export default FormEstoque;
