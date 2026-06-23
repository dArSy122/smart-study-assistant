import { useState } from 'react';
import Button from '../ui/Button.jsx';
import FormField from '../ui/FormField.jsx';

export default function CreateFolderModal({ title, nameLabel, descriptionLabel, cancelLabel, saveLabel, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'blue'
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(formData);
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>{title}</h2>

        <form className="form-stack" onSubmit={handleSubmit}>
          <FormField
            label={nameLabel}
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label className="form-field" htmlFor="description">
            <span>{descriptionLabel}</span>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            />
          </label>

          <div className="modal-actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button type="submit">{saveLabel}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}