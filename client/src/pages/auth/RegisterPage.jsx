import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import FormField from '../../components/ui/FormField.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

export default function RegisterPage() {
  return (
    <Card className="narrow-card">
      <PageHeader
        eyebrow="Authentication"
        title="Register"
        description="New users will be created as STUDENT accounts."
      />

      <form className="form-stack">
        <FormField label="Name" name="name" placeholder="Your name" />
        <FormField label="Email" name="email" type="email" placeholder="you@example.com" />
        <FormField label="Password" name="password" type="password" placeholder="Minimum 6 characters" />

        <label className="form-field" htmlFor="languagePreference">
          <span>Preferred language</span>
          <select id="languagePreference" name="languagePreference" defaultValue="BG">
            <option value="BG">Bulgarian</option>
            <option value="EN">English</option>
          </select>
        </label>

        <Button type="button">Create account</Button>
      </form>
    </Card>
  );
}