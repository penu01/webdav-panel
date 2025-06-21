# WebDAV Panel

Modern ve kullanıcı dostu bir WebDAV istemci paneli. Dosyalarınızı güvenle yönetin, görüntüleyin ve düzenleyin.

![WebDAV Panel](https://img.shields.io/badge/WebDAV-Panel-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black)
![React](https://img.shields.io/badge/React-18.2.0-blue)

## 🌟 Özellikler

- **Modern Arayüz**: Koyu/açık tema desteği ile modern ve responsive tasarım
- **Dosya Yönetimi**: Dosya yükleme, silme, yeniden adlandırma ve klasör oluşturma
- **Dosya Önizleme**: Resim, video, ses ve metin dosyalarını doğrudan görüntüleme
- **Sürükle & Bırak**: Kolay dosya yükleme için sürükle-bırak desteği
- **Güvenli Bağlantı**: HTTPS desteği ile güvenli WebDAV bağlantısı
- **Hızlı Erişim**: Son kullanılan bağlantıları hatırlama
- **Performans**: Optimize edilmiş dosya listeleme ve önizleme

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/your-username/webdav-panel.git
cd webdav-panel
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

4. **Tarayıcınızda açın:**
```
http://localhost:3000
```

## 📦 Kullanılabilir Scriptler

```bash
npm run dev      # Geliştirme sunucusu
npm run build    # Production build
npm run start    # Production sunucusu
npm run lint     # Kod kalitesi kontrolü
npm run export   # Static export
```

## 🔧 Konfigürasyon

### WebDAV Sunucu Ayarları
- **URL**: `https://your-server.com/webdav`
- **Kullanıcı Adı**: WebDAV kullanıcı adınız
- **Şifre**: WebDAV şifreniz

### Desteklenen Dosya Türleri
- **Resimler**: JPG, PNG, GIF, BMP, WebP, SVG
- **Videolar**: MP4, MOV, AVI, MKV
- **Ses**: MP3, WAV, OGG
- **Belgeler**: PDF, DOC, DOCX
- **Arşivler**: ZIP, RAR, 7Z, TAR, GZ
- **Kod**: JS, JSX, TS, TSX, HTML, CSS, JSON, PY

## 🎨 Tema Desteği

- **Açık Tema**: Gün ışığında rahat görüntüleme
- **Koyu Tema**: Gece kullanımı için göz dostu

## 🔒 Güvenlik

- HTTPS bağlantı desteği
- Şifreler tarayıcı belleğinde güvenli saklanır
- Oturum bilgileri session storage'da tutulur

## 🛠️ Teknolojiler

- **Frontend**: Next.js 15, React 18
- **Styling**: CSS Modules
- **Icons**: React Icons
- **WebDAV**: webdav library
- **Deployment**: Netlify

## 📁 Proje Yapısı

```
webdav-panel/
├── components/          # React bileşenleri
├── context/            # React Context'leri
├── pages/              # Next.js sayfaları
├── styles/             # Global stiller
├── public/             # Statik dosyalar
└── pages/api/          # API routes
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🐛 Sorun Bildirimi

Bir hata bulduysanız, lütfen [Issues](https://github.com/your-username/webdav-panel/issues) sayfasında bildirin.

## 📞 İletişim

- **GitHub**: [@your-username](https://github.com/your-username)
- **Email**: your-email@example.com

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
