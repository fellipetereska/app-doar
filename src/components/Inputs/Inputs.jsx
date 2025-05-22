export const Input = ({ label, name, value, onChange, required = true, type = 'text', min = 0 }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={name === "senha" ? "password" : type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500"
    />
  </div>
);

export const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = true,
  placeholder = 'Selecione uma opção',
  disable = false
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}{required && '*'}
        </label>
      )}
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disable}
        className="mt-1 w-full border rounded-md px-3 py-2"
      >
        <option value="">{placeholder}</option>
        {options && options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const Textarea = ({
  label,
  name,
  value,
  onChange,
  required = true,
  placeholder = 'Digite aqui...',
  rows = 3
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}{required && '*'}
        </label>
      )}
      <textarea
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-y min-h-16"
      />
    </div>
  );
};
