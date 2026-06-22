export default function FormField({
  label,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false
}) {
  return (
    <label className="form-field" htmlFor={name}>
      <span>{label}</span>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </label>
  );
}