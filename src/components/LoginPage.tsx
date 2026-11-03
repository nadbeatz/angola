import React, { useState } from 'react';
import { login } from '../auth';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      onLogin(await login(email, password));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível iniciar sessão.');
    } finally {
      setPassword('');
      setLoading(false);
    }
  };

  return (
    <main className="institution-login relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="circuit-backdrop" aria-hidden="true">
        <svg className="circuit-lines" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
          <g stroke="currentColor" strokeWidth="1.15" opacity=".52">
            <path d="M0 145H180L235 200H360L410 150H560L620 210H760" />
            <path d="M0 195H130L185 250H300L350 300H500L555 245H680" />
            <path d="M1440 125H1280L1225 180H1100L1050 130H920L860 190H720" />
            <path d="M1440 210H1320L1265 265H1140L1090 315H940L885 260H760" />
            <path d="M0 700H170L225 645H340L395 700H540L600 640H740" />
            <path d="M1440 720H1270L1215 665H1100L1045 720H900L845 660H700" />
            <path d="M180 0V90L235 145V200M360 0V95L410 145M1280 0V70L1225 125M1100 0V80L1050 130M170 900V755L225 700M1270 900V775L1215 720" />
          </g>
          <g fill="currentColor">
            <circle cx="180" cy="145" r="3"/><circle cx="360" cy="200" r="3"/>
            <circle cx="560" cy="150" r="3"/><circle cx="760" cy="210" r="3"/>
            <circle cx="1280" cy="125" r="3"/><circle cx="1100" cy="180" r="3"/>
            <circle cx="940" cy="315" r="3"/><circle cx="340" cy="645" r="3"/>
            <circle cx="540" cy="700" r="3"/><circle cx="1100" cy="665" r="3"/>
          </g>
        </svg>
        <div className="circuit-grid" />
      </div>

      <section className="login-shell relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl">
        <aside className="login-intro relative hidden flex-col justify-between p-10 lg:flex">
          <div className="relative z-10">
            <div className="mb-10 flex items-center gap-3">
              <div className="brand-monogram">MJ</div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.24em] text-[#c8a96a]">República de Angola</p>
                <p className="mt-1 text-sm text-white/65">Serviço público · Justiça</p>
              </div>
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.28em] text-[#c8a96a]">Plataforma institucional</p>
            <h1 className="max-w-md text-4xl font-semibold leading-tight text-white">Gestão pública com rigor, transparência e confiança.</h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
              Um ambiente digital integrado para apoiar os serviços, os processos e a administração da Justiça.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-3 text-xs text-white/50">
            <span className="h-px w-10 bg-[#c8a96a]" />
            Tecnologia ao serviço das instituições
          </div>
          <div className="intro-watermark" aria-hidden="true">MJ</div>
        </aside>

        <div className="login-panel p-7 sm:p-10 lg:p-12">
          <div className="mb-8 text-center lg:text-left">
            <img
              src="https://med.gov.ao/themes/portalweb/assets/public/app-assets/img/simbolos/RepublicaAngola_InsigniaOficial.png"
              alt="Insígnia da República de Angola"
              className="mx-auto mb-5 h-20 w-20 object-contain lg:mx-0"
            />
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9a7a43]">Ministério da Justiça e dos Direitos Humanos</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#242321] sm:text-3xl">Iniciar sessão</h2>
            <p className="mt-2 text-sm leading-6 text-[#77736c]">Aceda à plataforma integrada de gestão institucional.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-[#393631]">Endereço de email</label>
              <input id="login-email" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required
                className="login-input w-full rounded-xl border px-4 py-3.5 text-sm outline-none"
                placeholder="nome@instituicao.ao" />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-[#393631]">Palavra-passe</label>
              <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required
                className="login-input w-full rounded-xl border px-4 py-3.5 text-sm outline-none"
                placeholder="Introduza a sua palavra-passe" />
            </div>
            {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <button type="submit" disabled={loading}
              className="login-submit w-full rounded-xl px-4 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55">
              {loading ? 'A validar credenciais…' : 'Entrar na plataforma'}
            </button>
          </form>

          <div className="mt-8 border-t border-[#e9e4da] pt-5 text-center lg:text-left">
            <div className="flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[.13em] text-[#8a8378] lg:justify-start">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b89453]" />
              Acesso reservado a utilizadores autorizados
            </div>
            <p className="mt-4 text-xs text-[#99938a]">© 2026 Ministério da Justiça e dos Direitos Humanos. Todos os direitos reservados.</p>
          </div>
        </div>
      </section>

      <style>{`
        .institution-login {
          background: radial-gradient(ellipse at 50% 45%, #363330 0%, #22211f 48%, #171716 100%);
          isolation: isolate;
        }
        .circuit-backdrop { position:absolute; inset:0; overflow:hidden; color:#b89453; opacity:.42; pointer-events:none; }
        .circuit-lines { position:absolute; inset:0; width:100%; height:100%; }
        .circuit-grid {
          position:absolute; inset:0;
          background-image: linear-gradient(rgba(200,169,106,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(200,169,106,.035) 1px,transparent 1px);
          background-size:48px 48px;
          mask-image:radial-gradient(ellipse at center,black 12%,transparent 78%);
        }
        .login-shell { grid-template-columns: minmax(0,1fr) minmax(0, .92fr); background:#fdfcf9; box-shadow:0 32px 100px rgba(0,0,0,.38); border:1px solid rgba(200,169,106,.32); }
        .login-intro { min-height:620px; background:linear-gradient(145deg,#292825,#191918); }
        .login-intro:after { content:""; position:absolute; inset:0; background:linear-gradient(130deg,transparent 40%,rgba(184,148,83,.12)); pointer-events:none; }
        .brand-monogram { display:grid; place-items:center; width:48px;height:48px;border:1px solid rgba(200,169,106,.65);border-radius:14px;color:#d5b77a;font-size:15px;font-weight:700;letter-spacing:.08em; }
        .intro-watermark { position:absolute; right:-30px; bottom:65px; font-size:260px; line-height:1; font-weight:800; letter-spacing:-.1em; color:rgba(200,169,106,.045); user-select:none; }
        .login-panel { background:linear-gradient(180deg,#fffefa,#f8f6f1); }
        .login-input { border-color:#ded8cc; background:#fff; color:#292825; transition:border-color .2s,box-shadow .2s; }
        .login-input::placeholder { color:#aaa49a; }
        .login-input:focus { border-color:#b89453; box-shadow:0 0 0 3px rgba(184,148,83,.15); }
        .login-submit { background:linear-gradient(110deg,#383632,#242320); box-shadow:0 8px 18px rgba(37,35,31,.16); transition:transform .2s,box-shadow .2s,background .2s; }
        .login-submit:hover:not(:disabled) { background:linear-gradient(110deg,#4a463f,#2d2b27); box-shadow:0 10px 22px rgba(37,35,31,.22); transform:translateY(-1px); }
        @media(max-width:1023px) { .login-shell { grid-template-columns:minmax(0,1fr); max-width:480px; } }
        @media(max-width:640px) { .institution-login { padding:18px 14px; } .login-shell { border-radius:22px; } .login-panel { padding:28px 22px; } .circuit-backdrop { opacity:.24; } }
        @media(prefers-reduced-motion:reduce) { .login-submit { transition:none; } }
      `}</style>
    </main>
  );
}
