import React, { useState, useEffect } from 'react';
import { Settings, Save, Globe, Share2, MapPin, Building, ShieldCheck, CheckCircle2, User, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import { ImageUpload } from '../../components/common/ImageUpload';

interface AdminSettingsProps {
  onShowToast: (msg: string, type: 'success' | 'error') => void;
  onNavigateSection?: (section: string) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onShowToast, onNavigateSection }) => {
  const { settings, pengawas, refreshSettings, refreshPengawas } = useSettings();
  const [form, setForm] = useState({
    namaPortal: '',
    subjudul: '',
    namaPengawas: '',
    fotoPengawas: '',
    nipPengawas: '',
    jabatan: '',
    jenjang: '',
    kecamatan: '',
    kabupaten: '',
    provinsi: '',
    email: '',
    telepon: '',
    whatsapp: '',
    alamat: '',
    logo: '',
    favicon: '',
    deskripsi: '',
    footer: '',
    facebook: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    mapsUrl: '',
    latitude: 0.6931,
    longitude: 101.2185
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings || pengawas) {
      // Auto-prefer live pengawas profile details so user never has to re-type
      const pengawasNamaFull = pengawas?.nama
        ? (pengawas.gelar ? `${pengawas.nama}, ${pengawas.gelar}` : pengawas.nama)
        : (settings?.namaPengawas || '');

      setForm({
        namaPortal: settings?.namaPortal || 'PORTAL PENGAWAS SEKOLAH',
        subjudul: settings?.subjudul || '',
        namaPengawas: pengawasNamaFull || settings?.namaPengawas || '',
        fotoPengawas: pengawas?.foto || settings?.fotoPengawas || '',
        nipPengawas: pengawas?.nip || settings?.nipPengawas || '',
        jabatan: pengawas?.jabatan || settings?.jabatan || '',
        jenjang: settings?.jenjang || 'TK / SD',
        kecamatan: pengawas?.kecamatan || settings?.kecamatan || '',
        kabupaten: pengawas?.kabupaten || settings?.kabupaten || '',
        provinsi: pengawas?.provinsi || settings?.provinsi || '',
        email: pengawas?.email || settings?.email || '',
        telepon: pengawas?.noHp || settings?.telepon || '',
        whatsapp: settings?.whatsapp || (pengawas?.noHp ? pengawas.noHp.replace(/[^0-9]/g, '') : ''),
        alamat: settings?.alamat || '',
        logo: settings?.logo || '',
        favicon: settings?.favicon || '',
        deskripsi: settings?.deskripsi || '',
        footer: settings?.footer || '',
        facebook: settings?.facebook || '',
        instagram: settings?.instagram || '',
        youtube: settings?.youtube || '',
        tiktok: settings?.tiktok || '',
        mapsUrl: settings?.mapsUrl || '',
        latitude: settings?.latitude || 0.6931,
        longitude: settings?.longitude || 101.2185
      });
    }
  }, [settings, pengawas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings(form);
      await Promise.all([refreshSettings(), refreshPengawas()]);
      onShowToast('Pengaturan website dan identitas pengawas berhasil disimpan & tersinkronisasi!', 'success');
    } catch (err: any) {
      onShowToast(err.message || 'Gagal menyimpan pengaturan.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Pengaturan Identitas & Konfigurasi Portal</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ubah nama portal, pengawas pembina, footer, dan saluran media tanpa mengubah source code.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 1: Branding Portal */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Branding & Header Portal</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Nama Portal Website <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.namaPortal}
                onChange={(e) => setForm({ ...form, namaPortal: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Jenjang Pembinaan</label>
              <input
                type="text"
                value={form.jenjang}
                onChange={(e) => setForm({ ...form, jenjang: e.target.value })}
                placeholder="TK / SD"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Subjudul Tagline Portal</label>
            <input
              type="text"
              value={form.subjudul}
              onChange={(e) => setForm({ ...form, subjudul: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Deskripsi Meta Portal (SEO)
            </label>
            <textarea
              rows={2}
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl resize-none"
            />
          </div>

          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
            <ImageUpload
              label="Logo Portal Website"
              value={form.logo}
              onChange={(url) => setForm({ ...form, logo: url })}
              helperText="Unggah file logo portal (format JPG, JPEG, atau PNG, maks 10MB)"
              aspectRatio="square"
            />
          </div>
        </div>

        {/* Section 2: Identitas Pengawas Pembina (Otomatis Terhubung) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>Pengawas Pembina & Wilayah Tugas</span>
            </h3>
            <span className="inline-flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 w-fit">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Otomatis Terhubung dari Profil Pengawas (Tanpa Input Ulang)</span>
            </span>
          </div>

          {/* Connected Pengawas Live Profile Card */}
          <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/60 to-slate-50 border border-emerald-200 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-5 shadow-xs">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <img
                src={
                  form.fotoPengawas ||
                  pengawas?.foto ||
                  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600'
                }
                alt={form.namaPengawas}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0 bg-white"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Pengawas Pembina Terdaftar
                </span>
                <h4 className="font-bold text-slate-900 text-base sm:text-lg leading-snug">
                  {form.namaPengawas || 'H. Ahmad Syafii, M.Pd.'}
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  NIP. {form.nipPengawas || '-'} • {form.jabatan || 'Pengawas Sekolah'}
                </p>
                <p className="text-[11px] text-slate-600 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-emerald-600 inline shrink-0" />
                  <span>
                    Wilayah Tugas: {form.kecamatan || 'Tapung Hilir'}, {form.kabupaten || 'Kampar'}, {form.provinsi || 'Riau'}
                  </span>
                </p>
                <p className="text-[11px] text-slate-500">
                  Email: <span className="font-semibold text-slate-700">{form.email || '-'}</span> • Telepon/WA: <span className="font-semibold text-slate-700">{form.telepon || '-'}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2.5 w-full md:w-auto">
              <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 text-xs text-slate-600 max-w-sm space-y-1">
                <p className="text-[11px] font-bold text-emerald-900 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Single Source of Truth</span>
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Data nama, NIP, gelar, foto, dan kontak Pengawas Pembina diambil langsung dari <strong>Profil Pengawas</strong> dan otomatis tersinkronisasi ke seluruh bagian (Header, Footer, Berita, & Detail Sekolah).
                </p>
              </div>
              {onNavigateSection && (
                <button
                  type="button"
                  onClick={() => onNavigateSection('pengawas')}
                  className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Buka & Edit Profil Pengawas</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Kontak Resmi Kantor Pengawas & Peta */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Alamat Kantor Resmi & Titik Peta</span>
          </h3>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Alamat Kantor Resmi Pengawas</label>
            <input
              type="text"
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              placeholder="Contoh: Kantor Koordinator Wilayah Pendidikan Kecamatan Tapung Hilir..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tautan Google Maps</label>
              <input
                type="url"
                value={form.mapsUrl}
                onChange={(e) => setForm({ ...form, mapsUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Latitude Peta</label>
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Longitude Peta</label>
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Media Sosial & Footer */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Share2 className="w-4 h-4 text-purple-600" />
            <span>Tautan Media Sosial & Catatan Kaki (Footer)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">URL Facebook</label>
              <input
                type="url"
                value={form.facebook}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">URL Instagram</label>
              <input
                type="url"
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">URL YouTube</label>
              <input
                type="url"
                value={form.youtube}
                onChange={(e) => setForm({ ...form, youtube: e.target.value })}
                placeholder="https://youtube.com/..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">URL TikTok</label>
              <input
                type="url"
                value={form.tiktok}
                onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
                placeholder="https://tiktok.com/@..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Teks Hak Cipta & Catatan Footer
            </label>
            <input
              type="text"
              value={form.footer}
              onChange={(e) => setForm({ ...form, footer: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
