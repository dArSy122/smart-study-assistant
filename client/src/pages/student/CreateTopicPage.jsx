import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import FormField from '../../components/ui/FormField.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

export default function CreateTopicPage() {
  return (
    <Card>
      <PageHeader
        eyebrow="Study topics"
        title="Create Topic"
        description="This screen will support manual text input, image upload and OCR extraction."
      />

      <form className="form-stack">
        <FormField label="Title" name="title" placeholder="Example: Artificial Intelligence" />

        <label className="form-field" htmlFor="language">
          <span>Topic language</span>
          <select id="language" name="language" defaultValue="BG">
            <option value="BG">Bulgarian</option>
            <option value="EN">English</option>
          </select>
        </label>

        <label className="form-field" htmlFor="originalText">
          <span>Study text</span>
          <textarea
            id="originalText"
            name="originalText"
            rows="8"
            placeholder="Paste or type your study text here..."
          />
        </label>

        <Button type="button">Save draft</Button>
      </form>
    </Card>
  );
}