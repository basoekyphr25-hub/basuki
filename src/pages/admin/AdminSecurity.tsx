import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface AdminSecurityProps {
  onShowToast: (msg: string, type: 'success' | 'error') => void;
}

export const AdminSecurity: React.FC<AdminSecurityProps> = ({ onShowToast }) => {
  const { admin } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Password baru harus minimal 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi password baru tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      setSuccessMsg('Kata sandi berhasil diganti. Harap simpan kata sandi baru Anda dengan aman.');
      onShowToast('Kata sandi administrator berhasil diperbarui!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal mengganti password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h1 className="text-xl font-bold text-slate-900">Manajemen Admin & Keamanan Akun</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola kata sandi otentikasi administrator dan perlindungan akses sistem.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="flex items-center space-x-2 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Informasi Akun Masuk Aktif:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div>
              Email Terdaftar: <strong>{admin?.email || 'admin@pengawassekolah.id'}</strong>
            </div>
            <div>
              Peran: <strong>{admin?.role || 'SUPERADMIN'}</strong>
            </div>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Peringatan Keamanan Produksi:</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Jika Anda baru saja menyebarkan (deploy) aplikasi ini ke server publik seperti Railway, pastikan Anda telah mengganti kata sandi bawaan (<code className="bg-amber-100 font-bold px-1 rounded">Admin123!</code>) ke kata sandi unik yang kuat.
          </p>
        </div>

        {/* Change Password Form */}
        <form onSubmit={handleChangePassword} className="space-y-4 text-xs pt-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <KeyRound className="w-4 h-4 text-blue-600" />
            <span>Form Penggantian Kata Sandi</span>
          </h3>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Kata Sandi Saat Ini <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Masukkan kata sandi lama"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Kata Sandi Baru <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors cursor-pointer"
            >
              {loading ? 'Memproses...' : 'Simpan Kata Sandi Baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
