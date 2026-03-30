"use client";

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/modal';
import Alert from '@/components/ui/alert';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { validateLogin, validateRegister, AuthFormErrors } from '@/lib/validation';
import { login, register } from '@/lib/api';

type Mode = 'login' | 'register' | null;

export default function Home() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<Mode>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const isLogin = activeModal === 'login';
  const modalTitle = 'TaskFlow';
  const formHeadline = isLogin ? 'Log in to continue managing your projects' : 'Create your account';
  const formSubtitle = isLogin
    ? 'Enter your credentials to access your workspace.'
    : 'Start managing your projects efficiently.';

  const openLogin = () => {
    setActiveModal('login');
    setFormData({ name: '', email: '', password: '' });
    setErrors({});
    setIsRememberMe(false);
  };

  const openRegister = () => {
    setActiveModal('register');
    setFormData({ name: '', email: '', password: '' });
    setErrors({});
    setIsRememberMe(false);
  };

  const closeModal = () => setActiveModal(null);

  const validateField = (fieldName: string, fieldValue: string) => {
    if (fieldName === 'name' && !isLogin) {
      const { name, email, password } = { ...formData, name: fieldValue };
      const fieldErrors = validateRegister({ name, email, password });
      setErrors((prev) => ({ ...prev, name: fieldErrors.name }));
      return;
    }

    if (fieldName === 'email' || fieldName === 'password') {
      const nextData = { ...formData, [fieldName]: fieldValue };
      const fieldErrors = isLogin
        ? validateLogin({ email: nextData.email, password: nextData.password })
        : validateRegister(nextData);

      setErrors((prev) => ({
        ...prev,
        email: fieldErrors.email,
        password: fieldErrors.password,
        ...(isLogin ? {} : { name: fieldErrors.name }),
      }));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;

    if (type === 'checkbox') {
      if (name === 'remember') {
        setIsRememberMe(checked);
      } else if (name === 'terms') {
        setIsTermsAccepted(checked);
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const isFormValid = isLogin
    ? Boolean(formData.email && formData.password)
    : Boolean(formData.name && formData.email && formData.password && isTermsAccepted);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = isLogin
      ? validateLogin({ email: formData.email, password: formData.password })
      : validateRegister({ name: formData.name, email: formData.email, password: formData.password });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length) {
      const firstIssue = Object.values(validationErrors).find(Boolean) as string;
      setAlert({ message: firstIssue || 'Please fix the errors and try again.', type: 'error' });
      setTimeout(() => setAlert(null), 2000);
      return;
    }

    setSubmitting(true);
    try {
      const response = isLogin
        ? await login(formData.email, formData.password)
        : await register(formData.email, formData.password, formData.name);

      // Store the token
      if (response.session?.access_token) {
        sessionStorage.setItem('taskflow_token', response.session.access_token);
      }

      // Store user data
      const userData = {
        id: response.user?.id,
        name: response.user?.user_metadata?.name || formData.name || formData.email.split('@')[0],
        email: response.user?.email || formData.email,
        remembered: isRememberMe,
      };
      sessionStorage.setItem('taskflow_user', JSON.stringify(userData));

      setAlert({ message: `${isLogin ? 'Logged in' : 'Registered'} successfully!`, type: 'success' });
      setTimeout(() => setAlert(null), 2000);

      closeModal();
      router.push('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setAlert({ message: errorMessage, type: 'error' });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eef2ff_0%,_#ffffff_45%,_#f8fafc_100%)] text-slate-900">
      {alert && <Alert message={alert.message} type={alert.type} />}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500" />
          <span className="text-xl font-bold tracking-tight text-slate-900">TaskFlow</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          <a href="#features" className="hover:text-slate-900">Features</a>
          <a href="#solutions" className="hover:text-slate-900">Solutions</a>
          <a href="#pricing" className="hover:text-slate-900">Pricing</a>
          <a href="#resources" className="hover:text-slate-900">Resources</a>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={openLogin} type="button">Log in</Button>
          <Button onClick={openRegister} type="button">Get Started Free</Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-20 pt-10 sm:px-10">
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold text-blue-700">TaskFlow 2.0 is here</p>
            <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-6xl">Organize your work, master your flow.</h1>
            <p className="max-w-xl text-lg text-slate-600">The unified workspace for modern teams. Bring projects, tasks, docs, and communication into one seamlessly integrated platform.</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button onClick={openRegister} type="button">Start for free</Button>
              <Button variant="secondary" type="button">Watch Demo</Button>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80" alt="Product screenshot" className="h-72 w-full rounded-2xl object-cover" />
          </div>
        </section>

        <section id="features" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Projects', desc: 'Centralized roadmaps with status updates and analytics.' },
            { title: 'Tasks', desc: 'Prioritize work with checklists, labels, and due dates.' },
            { title: 'Docs', desc: 'Share knowledge using editable docs inside your workspace.' },
            { title: 'Team Chat', desc: 'Collaborate asynchronously with context-rich messaging.' },
          ].map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.desc}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Ready to transform your team workflow?</h2>
          <p className="mt-3 text-slate-600">Try TaskFlow free today and get all core features at no cost.</p>
          <Button onClick={openRegister} className="mt-5">Get Started Free</Button>
        </section>
      </main>

      <footer className="w-full border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 sm:flex-row sm:items-start sm:justify-between sm:px-10">
          <div>
            <h4 className="text-lg font-semibold text-slate-900">TaskFlow</h4>
            <p className="mt-2 text-sm text-slate-600">The unified workspace for project teams, fully integrated.</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h5 className="text-sm font-semibold text-slate-800">Product</h5>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li><a href="#features" className="hover:text-slate-900">Features</a></li>
                <li><a href="#pricing" className="hover:text-slate-900">Pricing</a></li>
                <li><a href="#solutions" className="hover:text-slate-900">Solutions</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-slate-800">Resources</h5>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-slate-900">Docs</a></li>
                <li><a href="#" className="hover:text-slate-900">Guides</a></li>
                <li><a href="#" className="hover:text-slate-900">Support</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-slate-800">Company</h5>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-slate-900">About</a></li>
                <li><a href="#" className="hover:text-slate-900">Careers</a></li>
                <li><a href="#" className="hover:text-slate-900">Blog</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 w-full max-w-6xl border-t border-slate-100 pt-6 px-6 text-center text-sm text-slate-500 sm:px-10">
          © {new Date().getFullYear()} TaskFlow. All rights reserved.
        </div>
      </footer>

      <Modal title={modalTitle} isOpen={!!activeModal} onClose={closeModal}>
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white">
            <div className="h-5 w-5 rounded-sm bg-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{formHeadline}</h2>
          <p className="mt-1 text-sm text-slate-500">{formSubtitle}</p>
        </div>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <Input
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="John Doe"
              required
            />
          )}

          <Input
            label={isLogin ? 'Email' : 'Work Email'}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="john@company.com"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter your password"
            required
            minLength={8}
          />

          {isLogin ? (
            <div className="flex items-center justify-between text-sm text-slate-600">
              <label className="inline-flex items-center gap-2">
                <input
                  name="remember"
                  type="checkbox"
                  checked={isRememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              <a href="#" className="font-medium text-blue-600 hover:text-blue-700">Forgot password?</a>
            </div>
          ) : (
            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              <input
                name="terms"
                type="checkbox"
                checked={isTermsAccepted}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              I agree to the{' '}
              <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">Terms of Service</a> and{' '}
              <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">Privacy Policy</a>
            </label>
          )}

          <Button type="submit" className="w-full" disabled={submitting || !isFormValid}>
            {submitting ? 'Please wait...' : isLogin ? 'Log In' : 'Create Account'}
          </Button>

          {!isLogin && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs uppercase tracking-wide text-slate-400">Or continue with</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" type="button" className="w-full">Google</Button>
                <Button variant="secondary" type="button" className="w-full">Apple</Button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-slate-500">
            {isLogin ? (
              <>Don&apos;t have an account?{' '}<button type="button" onClick={openRegister} className="font-semibold text-blue-600 hover:text-blue-700">Sign up</button></>
            ) : (
              <>Already have an account?{' '}<button type="button" onClick={openLogin} className="font-semibold text-blue-600 hover:text-blue-700">Log in here</button></>
            )}
          </p>
        </form>
      </Modal>
    </div>
  );
}

