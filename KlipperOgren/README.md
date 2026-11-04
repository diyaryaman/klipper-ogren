# Klipper Öğren

Klipper'ı (3D yazıcı firmware'i) Duolingo tarzında, kolaydan zora öğreten kişisel iPhone uygulaması.

- **15 ünite, 45 ders, 296 soru.** Kurulumdan CAN bus'a, makrolardan gerçek arıza vakalarına kadar. İçerik Klipper'ın resmi dokümanlarından (klipper3d.org) ve kaynak kodundaki hata mesajlarından Türkçe hazırlandı.
- **Oyun gibi:** maskot Nozi, günlük görevler, makara (🧵) ödülleri, ünite sandıkları, rozetler, seviye, seri koruyucu, ses efektleri, konfeti. Her ünite derslerin bittikçe katman katman "basılan" bir parça olarak görünür.
- **6 soru tipi:** çoktan seçmeli, doğru/yanlış, boşluk doldurma, sıralama, eşleştirme, yazarak cevaplama.
- **Aralıklı tekrar:** Doğru bildiğin soru 1, 3, 7, 16, 35 ve 90 gün sonra tekrar sorulur. Yanlış yaptığın soru hemen geri gelir. Yeni derslerin arasına eski konulardan sorular da karışır.
- **XP, günlük seri, günlük hedef** ve "zayıf noktalar" listesi.
- **Yenilikler sekmesi:** Klipper'ın GitHub deposundan config değişikliklerini, son commit'leri ve son sürümü çeker. Wiki'ye yeni bir komut eklenirse ya da biri kaldırılırsa gösterir.
- **Rehber:** Türkçe açıklamalı komut listesi, arama ve wiki linkleri.

## Klasörler

```
web/                      Uygulamanın kendisi (HTML/JS, internet gerekmez)
  content1-3.js             Dersler ve sorular (yeni soru eklemek için burayı düzenle)
  reference.js              Rehber sekmesindeki komutlar
  snapshot.js               Uygulama hazırlandığında wiki'deki komut listesi
ios/                      iPhone kabuğu (SwiftUI + WKWebView)
.github/workflows/        GitHub'ın .ipa dosyasını derlediği ayar
```

## iPhone'a kurulum (Mac olmadan, Sideloadly ile)

1. GitHub'da yeni bir repo aç (private olabilir) ve bu klasörün içindekileri yükle.
2. Repo'da **Actions** sekmesine gir. "iPhone uygulamasını derle (.ipa)" iş akışı her yüklemede kendiliğinden çalışır (elle çalıştırmak için **Run workflow**). Yaklaşık 5-10 dakika sürer.
3. Bitince çalışmanın sayfasının altındaki **Artifacts** kısmından `KlipperOgren-ipa` dosyasını indir ve zip'ten çıkar: `KlipperOgren.ipa`
4. Windows'ta **Sideloadly** + **iTunes** (Apple'ın sitesinden indirilen sürüm) kur. iPhone'u kabloyla bağla.
5. .ipa'yı Sideloadly'ye sürükle, Apple ID'ni gir, **Start**.
6. iPhone'da: **Ayarlar → Gizlilik ve Güvenlik → Geliştirici Modu**'nu aç. Sonra **Ayarlar → Genel → VPN ve Cihaz Yönetimi**'nde kendi Apple ID'ne **Güven** de.

Ücretsiz Apple ID'de uygulama 7 günde bir kapanır. Sideloadly ile tekrar yükleyince ilerlemen silinmez. Sideloadly'nin otomatik yenileme özelliğini açarsan bunu kendisi yapar.

## İşyerindeki Mac ile kurulum

```
brew install xcodegen
cd ios && xcodegen generate && open KlipperOgren.xcodeproj
```
Xcode'da **Signing & Capabilities** sekmesinde kendi Apple ID'ni (Personal Team) seç, telefonu tak, **▶ Run**.

## Bilgisayarda denemek

`web/index.html` dosyasını tarayıcıda aç ya da `web` klasöründe `python3 -m http.server` çalıştırıp `http://localhost:8000` adresine git.
