import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import FormField from '../../components/ui/FormField.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';

export default function LoginPage() {
  return (
    <div className="page-grid">
      <Card>
        <PageHeader
          eyebrow="Authentication"
          title="Login"
          description="This form will connect to the backend login endpoint in the next frontend auth stage."
        />

        <form className="form-stack">
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="student@smartstudy.local"
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            placeholder="Student123!"
          />

          <Button type="button">Login</Button>
        </form>
      </Card>

      <Card className="side-card">
        <h2>Test accounts</h2>
        <div className="info-list">
          <p>
            <strong>Student</strong>
            <span>student@smartstudy.local / Student123!</span>
          </p>
          <p>
            <strong>Admin</strong>
            <span>admin@smartstudy.local / Admin123!</span>
          </p>
        </div>
      </Card>
    </div>
  );
}