// Klipper Öğren — ders içeriği (Ünite 1-5)
// Kaynak: Klipper resmi dokümanları (klipper3d.org) — G-Codes, Config_Reference,
// Command_Templates, FAQ, Rotation_Distance, Pressure_Advance.
// Soru tipleri: mc (çoktan seçmeli), tf (doğru/yanlış), fill (boşluk doldur),
// order (sırala), match (eşleştir), type (yazarak cevapla)
window.KLIPPER_UNITS = window.KLIPPER_UNITS || [];
window.KLIPPER_UNITS.push(
{
  id: 'u1', title: 'Klipper\'a Giriş', desc: 'Klipper nasıl çalışır, ayarlar nerede durur', color: '#22c55e', icon: '🚀',
  lessons: [
  {
    id: 'u1l1', title: 'Klipper nedir?', doc: 'Features.html',
    teach: [
      { title: 'İki beyinli firmware', body: 'Klipper\'da işi iki parça paylaşır:\n\n• **Host** (genelde Raspberry Pi gibi küçük bir bilgisayar): bütün hareket hesaplarını yapar.\n• **MCU** (yazıcının anakartındaki mikrodenetleyici): host\'un hesapladığı adımları tam zamanında motorlara uygular.\n\nBu sayede eski 8-bit kartlar bile çok hızlı ve hassas adım atabilir.' },
      { title: 'Ayarlar tek dosyada', body: 'Marlin\'de bir ayarı değiştirmek için firmware\'i derleyip karta yüklemen gerekir. Klipper\'da bütün ayarlar host\'taki **printer.cfg** dosyasındadır. Dosyayı düzenle, **RESTART** ver, bitti.', code: '[printer]\nkinematics: cartesian\nmax_velocity: 300\nmax_accel: 3000' }
    ],
    questions: [
      { t: 'mc', q: 'Klipper\'da hareket hesaplarını (ivme, adım zamanlaması) kim yapar?', o: ['Host bilgisayar (örn. Raspberry Pi)', 'Yazıcının anakartı (MCU)', 'Dilimleyici (slicer)', 'Yazıcının ekranı'], a: 0, e: 'Hesaplar host\'ta yapılır, MCU sadece hazır gelen adımları zamanında uygular.' },
      { t: 'tf', q: 'Klipper\'da bir ayarı değiştirmek için her seferinde firmware\'i yeniden derleyip karta yüklemek gerekir.', a: false, e: 'Hayır. Ayarlar printer.cfg\'de durur; değiştirip RESTART vermek yeterli. Firmware\'i sadece Klipper\'ın MCU kodunu güncellerken yüklersin.' },
      { t: 'mc', q: 'Klipper\'ın ana ayar dosyasının adı nedir?', o: ['printer.cfg', 'Configuration.h', 'klipper.ini', 'config.json'], a: 0, e: 'printer.cfg. Configuration.h Marlin\'in dosyasıdır.' },
      { t: 'mc', q: '"MCU" neyin kısaltmasıdır?', o: ['Micro-controller (mikrodenetleyici)', 'Main Control Unit Software', 'Motor Control Utility', 'Multi Core Unit'], a: 0, e: 'MCU = micro-controller. Yazıcının anakartındaki çiptir.' },
      { t: 'tf', q: 'Klipper aynı anda birden fazla mikrodenetleyiciyi (örneğin ana kart + kafa kartı) yönetebilir.', a: true, e: 'Evet. Host saatleri senkronize eder; bir kart ekstrüderi, diğeri geri kalanı yönetebilir.' },
      { t: 'match', q: 'Parçaları görevleriyle eşleştir', pairs: [['Host', 'Hareketi hesaplar'], ['MCU', 'Adımları zamanında uygular'], ['printer.cfg', 'Tüm ayarlar burada'], ['Mainsail / Fluidd', 'Web arayüzü']], e: 'Mainsail ve Fluidd, Klipper\'ı tarayıcıdan kontrol ettiğin arayüzlerdir (Moonraker üzerinden).' },
      { t: 'mc', q: 'Klipper adım olaylarını hangi hassasiyetle zamanlar?', o: ['25 mikrosaniye veya daha iyi', '1 milisaniye', '10 milisaniye', '1 saniye'], a: 0, e: 'Dokümana göre her adım olayı 25 mikrosaniye veya daha iyi hassasiyetle planlanır.' }
    ]
  },
  {
    id: 'u1l2', title: 'printer.cfg yapısı', doc: 'Config_Reference.html',
    teach: [
      { title: 'Bölümler ve ayarlar', body: 'Dosya **bölümlerden** oluşur. Bölüm adı köşeli parantez içindedir. Altındaki satırlar **ayar: değer** şeklindedir. **#** ile başlayan satırlar yorumdur.', code: '[stepper_x]\nstep_pin: PB13\ndir_pin: !PB12   # ! = yönü ters çevir\nmicrosteps: 16' },
      { title: 'include ve SAVE_CONFIG', body: '**[include dosya.cfg]** ile başka bir dosyayı ekleyebilirsin (örn. makrolar ayrı dursun).\n\nKalibrasyon sonuçları (PID, mesh, probe ofseti) **SAVE_CONFIG** ile dosyanın en altındaki özel bloğa yazılır. Bu bloğa elle dokunma.', code: '[include macros.cfg]\n\n#*# <---------------------- SAVE_CONFIG ---------------------->\n#*# DO NOT EDIT THIS BLOCK OR BELOW.' }
    ],
    questions: [
      { t: 'mc', q: 'printer.cfg\'de bir bölüm nasıl yazılır?', o: ['[stepper_x]', '<stepper_x>', '{stepper_x}', 'stepper_x:'], a: 0, e: 'Bölüm adları köşeli parantez içinde yazılır.' },
      { t: 'fill', q: 'Ayar satırını tamamla', code: 'max_velocity___ 300', o: [':', '=', ' ->', ';'], a: ':', e: 'Klipper ayarlarında genelde "ayar: değer" yazılır.' },
      { t: 'mc', q: 'printer.cfg\'de yorum satırı hangi karakterle başlar?', o: ['#', '//', '--', '%'], a: 0, e: '# ile başlayan satırlar yorumdur, Klipper onları okumaz.' },
      { t: 'mc', q: 'Makroları ayrı bir dosyada tutmak istiyorsun. printer.cfg\'ye ne yazarsın?', o: ['[include macros.cfg]', 'import macros.cfg', '#include "macros.cfg"', '[load macros.cfg]'], a: 0, e: '[include dosya.cfg] başka bir config dosyasını ekler. Joker karakter de çalışır: [include configs/*.cfg]' },
      { t: 'tf', q: 'SAVE_CONFIG\'in dosyanın sonuna yazdığı #*# bloğunu elle düzenlemek önerilir.', a: false, e: 'Hayır. O blok Klipper tarafından yönetilir. Bir değeri değiştirmek istiyorsan kalibrasyonu tekrar yapıp SAVE_CONFIG ver.' },
      { t: 'mc', q: 'SAVE_CONFIG komutu ne yapar?', o: ['Kalibrasyon sonuçlarını printer.cfg\'ye yazar ve host yazılımını yeniden başlatır', 'Baskıyı SD karta kaydeder', 'Firmware\'i karta yükler', 'Sadece ayarları ekrana yazdırır'], a: 0, e: 'SAVE_CONFIG ana config dosyasının üzerine yazar ve Klipper\'ı yeniden başlatır.' },
      { t: 'tf', q: 'Pin adının başındaki ! işareti, pinin tersine (low = aktif) çalışacağını gösterir.', a: true, e: 'Evet. ! ters polarite demektir, örneğin dir_pin: !PB12 motor yönünü çevirir.' }
    ]
  },
  {
    id: 'u1l3', title: 'Yeniden başlatma ve durum', doc: 'G-Codes.html#gcode',
    teach: [
      { title: 'RESTART mı FIRMWARE_RESTART mı?', body: '• **RESTART**: Host config\'i yeniden okur. MCU\'daki hata durumunu temizlemez.\n• **FIRMWARE_RESTART**: RESTART gibi, ama MCU\'daki hata durumunu da temizler.\n\nConfig\'i değiştirdiysen RESTART yeter. "Shutdown" hatası aldıysan FIRMWARE_RESTART gerekir.' },
      { title: 'Acil durdurma', body: '**M112** acil durdurmadır. Klipper "shutdown" durumuna geçer, her şeyi durdurur. Sonra tekrar çalışmak için **FIRMWARE_RESTART** verilir.\n\n**STATUS** host durumunu, **HELP** kullanılabilir komutların listesini gösterir.' }
    ],
    questions: [
      { t: 'mc', q: 'printer.cfg\'yi düzenledin. Değişikliklerin geçerli olması için en basit komut hangisi?', o: ['RESTART', 'M112', 'SAVE_CONFIG', 'G28'], a: 0, e: 'RESTART host\'un config\'i yeniden okumasını sağlar.' },
      { t: 'mc', q: 'Yazıcı "MCU shutdown" hatasına düştü. Hatayı temizlemek için hangi komutu verirsin?', o: ['FIRMWARE_RESTART', 'RESTART', 'M84', 'STATUS'], a: 0, e: 'RESTART MCU\'daki hata durumunu temizlemez. FIRMWARE_RESTART temizler.' },
      { t: 'type', q: 'Acil durdurma G-code\'unu yaz', a: ['M112'], e: 'M112 Klipper\'ı anında shutdown durumuna geçirir.' },
      { t: 'tf', q: 'RESTART komutu MCU\'daki hata durumunu da temizler.', a: false, e: 'Temizlemez. Bunun için FIRMWARE_RESTART var.' },
      { t: 'match', q: 'Komutları işleriyle eşleştir', pairs: [['HELP', 'Komut listesini gösterir'], ['STATUS', 'Host durumunu bildirir'], ['M112', 'Acil durdurma'], ['M115', 'Firmware sürümünü sorar']], e: 'Bunlar her Klipper kurulumunda hazır gelen temel komutlar.' },
      { t: 'order', q: 'M109 ile ısınmayı beklerken vazgeçtin. Doğru sırayı kur:', items: ['M112 gönder (shutdown)', 'Arayüzü yeniden bağla', 'FIRMWARE_RESTART gönder', 'Yeni baskıyı başlat'], e: 'Klipper FAQ\'daki yol budur: M112 → yeniden bağlan → FIRMWARE_RESTART.' },
      { t: 'tf', q: 'Klipper\'daki uzun komutlar (SET_SERVO gibi) büyük/küçük harfe duyarlı değildir; set_servo da çalışır.', a: true, e: 'Doğru. Dokümanda büyük harfle yazılır ama küçük harf de aynı komutu çalıştırır.' }
    ]
  }
  ]
},
{
  id: 'u2', title: 'Temel G-code', desc: 'Hareket, koordinat, sıcaklık ve fan', color: '#3b82f6', icon: '🧭',
  lessons: [
  {
    id: 'u2l1', title: 'Hareket komutları', doc: 'G-Codes.html#g-code-commands',
    teach: [
      { title: 'G28 ve G1', body: '• **G28**: Eksenleri sıfır noktasına (home) götürür. G28 X sadece X\'i yapar.\n• **G1**: Hareket. X Y Z konumu, E ekstrüzyonu, F hızı belirler.\n• **G0**, G1 ile aynı şeydir.\n\n⚠️ **F** değeri **mm/dakika** cinsindendir. F3000 = 50 mm/s.', code: 'G28\nG1 X100 Y100 Z10 F3000\nG4 P500   ; 500 ms bekle' }
    ],
    questions: [
      { t: 'mc', q: 'Bütün eksenleri home\'a gönderen komut hangisi?', o: ['G28', 'G1', 'G92', 'M84'], a: 0, e: 'G28 eksenleri sıfır noktasına götürür.' },
      { t: 'fill', q: 'Kafayı X=50 Y=50 noktasına götür', code: '___ X50 Y50 F6000', o: ['G1', 'G28', 'M104', 'G92'], a: 'G1', e: 'G1 (veya G0) hareket komutudur.' },
      { t: 'mc', q: 'G1 komutundaki F değerinin birimi nedir?', o: ['mm/dakika', 'mm/saniye', 'adım/saniye', 'yüzde'], a: 0, e: 'G-code\'da F her zaman mm/dakika\'dır. 60\'a bölersen mm/s bulursun.' },
      { t: 'mc', q: 'F6000 kaç mm/s eder?', o: ['100 mm/s', '6000 mm/s', '60 mm/s', '10 mm/s'], a: 0, e: '6000 mm/dk ÷ 60 = 100 mm/s.' },
      { t: 'tf', q: 'Klipper\'da G0 ve G1 aynı şekilde çalışır.', a: true, e: 'Evet, Klipper\'da G0, G1\'in takma adıdır.' },
      { t: 'mc', q: '"G4 P2000" ne yapar?', o: ['2000 milisaniye (2 sn) bekler', '2000 mm ilerler', 'Fanı %20 yapar', 'Nozulu 200 °C yapar'], a: 0, e: 'G4 bekleme komutudur, P milisaniye cinsindendir.' },
      { t: 'type', q: 'Sadece Y eksenini home\'a gönderen komutu yaz', a: ['G28 Y'], e: 'G28\'den sonra eksen harfi yazarsan sadece o eksen home olur.' },
      { t: 'tf', q: 'Motorlar M84 ile kapatıldıktan sonra kafa hareket ettirilmeden önce tekrar home yapılmalıdır.', a: true, e: 'Evet. Motorlar serbest kalınca konum bilgisi kaybolur; FAQ\'a göre tekrar home gerekir.' }
    ]
  },
  {
    id: 'u2l2', title: 'Koordinat modları', doc: 'G-Codes.html#g-code-commands',
    teach: [
      { title: 'Mutlak ve göreli', body: '• **G90**: Mutlak mod. G1 X10 = "X=10 noktasına git".\n• **G91**: Göreli mod. G1 X10 = "bulunduğun yerden 10 mm git".\n\nEkstrüder için:\n• **M83**: E değerlerini zorla göreli yapar (G90\'dayken bile).\n• **M82**: Bu zorlamayı kaldırır (E\'yi zorla mutlak yapmaz).', code: 'G91        ; göreli\nG1 Z5 F600 ; 5 mm yukarı\nG90        ; tekrar mutlak' },
      { title: 'G92 ve M114', body: '• **G92**: Mevcut konumu "şu değer" olarak tanımlar. En çok G92 E0 ile ekstrüderi sıfırlamak için kullanılır.\n• **M114**: Mevcut konumu gösterir.\n• **M400**: Kuyruktaki hareketlerin bitmesini bekler.' }
    ],
    questions: [
      { t: 'mc', q: 'Kafayı bulunduğu yerden 10 mm yukarı kaldırmak istiyorsun. Hangi mod lazım?', o: ['G91 (göreli)', 'G90 (mutlak)', 'M82', 'G92'], a: 0, e: 'Göreli modda G1 Z10 "10 mm daha yukarı" demektir.' },
      { t: 'order', q: 'Kafayı 5 mm kaldır ve mutlak moda geri dön', items: ['G91', 'G1 Z5 F600', 'G90'], e: 'Önce göreli moda geç, hareket et, sonra mutlak moda dön.' },
      { t: 'mc', q: 'G92 E0 ne yapar?', o: ['Ekstrüder konumunu 0 olarak tanımlar', 'Ekstrüderi 0 °C yapar', 'Filamanı geri çeker', 'Ekstrüderi kapatır'], a: 0, e: 'G92 mevcut konumu verilen değer olarak ayarlar. Filaman hareket etmez.' },
      { t: 'tf', q: 'M82 ekstrüderi zorla mutlak moda alır.', a: false, e: 'Dokümana göre M82 sadece M83\'ün zorla-göreli modunu kapatır; E\'yi zorla mutlak yapmaz.' },
      { t: 'tf', q: 'M83 verildiğinde, G90 mutlak moddayken bile ekstrüzyon (E) göreli olur.', a: true, e: 'Evet, M83 E\'yi zorla göreli yapar.' },
      { t: 'match', q: 'Komutları eşleştir', pairs: [['G90', 'Mutlak koordinat'], ['G91', 'Göreli koordinat'], ['M114', 'Mevcut konumu göster'], ['M400', 'Hareketlerin bitmesini bekle']], e: 'Bu dördü makrolarda çok sık geçer.' },
      { t: 'fill', q: 'Ekstrüder konumunu sıfırla', code: 'G92 ___', o: ['E0', 'X0', 'Z0', 'S0'], a: 'E0', e: 'G92 E0, ekstrüder sayacını sıfırlar.' }
    ]
  },
  {
    id: 'u2l3', title: 'Sıcaklık ve fan', doc: 'G-Codes.html#g-code-commands',
    teach: [
      { title: 'Isıtma komutları', body: '• **M104 S200**: Nozulu 200 °C yap, **beklemeden** devam et.\n• **M109 S200**: Nozulu 200 °C yap ve **bekle**.\n• **M140 S60**: Tablayı 60 °C yap, bekleme.\n• **M190 S60**: Tablayı 60 °C yap ve bekle.\n• **M105**: Sıcaklıkları sor.', code: 'M140 S60\nM104 S200\nM190 S60\nM109 S200' },
      { title: 'Fan ve motorlar', body: '• **M106 S255**: Parça fanı tam güç (0-255).\n• **M107**: Fanı kapat.\n• **M84** veya **M18**: Motorları serbest bırak.\n• **M220 S80**: Hızı %80 yap.\n• **M221 S105**: Ekstrüzyonu %105 yap.' }
    ],
    questions: [
      { t: 'mc', q: 'Nozulu 210 °C\'ye ısıtıp sıcaklığa ulaşana kadar bekleyen komut hangisi?', o: ['M109 S210', 'M104 S210', 'M190 S210', 'M140 S210'], a: 0, e: 'M109 ısıtır ve bekler. M104 beklemez.' },
      { t: 'mc', q: 'Tablayı ısıtıp BEKLEMEYEN komut hangisi?', o: ['M140', 'M190', 'M109', 'M106'], a: 0, e: 'M140 tablayı ayarlar ve devam eder; M190 bekler.' },
      { t: 'match', q: 'Komutları eşleştir', pairs: [['M104', 'Nozul, beklemez'], ['M109', 'Nozul, bekler'], ['M140', 'Tabla, beklemez'], ['M190', 'Tabla, bekler']], e: 'Kural: 104/140 bekletmez, 109/190 bekletir.' },
      { t: 'mc', q: 'Parça fanını yarı güçte çalıştırmak için?', o: ['M106 S127', 'M106 S50', 'M107 S50', 'M106 S0.5'], a: 0, e: 'M106\'da S değeri 0-255 arasıdır; yarısı yaklaşık 127.' },
      { t: 'type', q: 'Parça fanını kapatan komutu yaz', a: ['M107', 'M106 S0'], e: 'M107 fanı kapatır (M106 S0 da olur).' },
      { t: 'order', q: 'Tipik bir başlangıç ısıtma sırası: önce tablayı başlat, sonra nozulu, sonra ikisini bekle', items: ['M140 S60', 'M104 S200', 'M190 S60', 'M109 S200'], e: 'Beklemeyen komutlarla ikisini aynı anda ısıtmaya başlatıp sonra beklemek zaman kazandırır.' },
      { t: 'tf', q: 'M220 S50 baskı hızını %50\'ye düşürür.', a: true, e: 'M220 hız çarpanını yüzde olarak ayarlar.' },
      { t: 'mc', q: 'Bütün ısıtıcıları tek komutla kapatan Klipper komutu hangisi?', o: ['TURN_OFF_HEATERS', 'M84', 'HEATERS_OFF', 'M112'], a: 0, e: 'TURN_OFF_HEATERS tüm ısıtıcıları kapatır. M112 de durdurur ama acil durdurmadır.' }
    ]
  }
  ]
},
{
  id: 'u3', title: 'Klipper Komutları', desc: 'Uzun komutlar, ofset, sorgular', color: '#a855f7', icon: '⌨️',
  lessons: [
  {
    id: 'u3l1', title: 'Söz dizimi ve ısıtıcılar', doc: 'G-Codes.html#additional-commands',
    teach: [
      { title: 'KOMUT PARAMETRE=değer', body: 'Klipper\'ın kendi komutları okunabilir isimlerdir. Parametreler **AD=değer** şeklinde yazılır.', code: 'SET_HEATER_TEMPERATURE HEATER=extruder TARGET=200\nTEMPERATURE_WAIT SENSOR=extruder MINIMUM=195' },
      { title: 'Isıtıcı komutları', body: '• **SET_HEATER_TEMPERATURE HEATER=… TARGET=…**: Isıtıcıya hedef verir. TARGET yazmazsan 0 olur (kapatır).\n• **TEMPERATURE_WAIT SENSOR=… MINIMUM=… MAXIMUM=…**: Sensör bu aralığa gelene kadar bekler.\n• **TURN_OFF_HEATERS**: Hepsini kapatır.' }
    ],
    questions: [
      { t: 'fill', q: 'Tablayı 60 °C yap', code: 'SET_HEATER_TEMPERATURE HEATER=heater_bed ___=60', o: ['TARGET', 'TEMP', 'S', 'VALUE'], a: 'TARGET', e: 'SET_HEATER_TEMPERATURE\'da hedef sıcaklık TARGET ile verilir.' },
      { t: 'mc', q: '"SET_HEATER_TEMPERATURE HEATER=extruder" (TARGET yok) ne yapar?', o: ['Isıtıcıyı kapatır (hedef 0)', 'Hata verir', 'Son sıcaklığa ısıtır', '200 °C yapar'], a: 0, e: 'Dokümana göre TARGET verilmezse hedef 0 olur.' },
      { t: 'mc', q: 'Nozul en az 190 °C olana kadar beklemek için hangisi?', o: ['TEMPERATURE_WAIT SENSOR=extruder MINIMUM=190', 'M104 S190', 'WAIT_TEMP extruder 190', 'SET_HEATER_TEMPERATURE HEATER=extruder MINIMUM=190'], a: 0, e: 'TEMPERATURE_WAIT, sensör MINIMUM\'a ulaşana kadar bekler. M109\'dan farkı tam sabitlenmeyi beklememesi.' },
      { t: 'tf', q: 'Klipper komutlarında parametreler "AD=değer" biçiminde yazılır.', a: true, e: 'Evet, örneğin SET_SERVO SERVO=my_servo ANGLE=5.3' },
      { t: 'type', q: 'Tüm ısıtıcıları kapatan Klipper komutunu yaz', a: ['TURN_OFF_HEATERS'], e: 'TURN_OFF_HEATERS. Bitiş G-code\'una koymak iyi bir alışkanlıktır.' },
      { t: 'mc', q: 'Bir Klipper komutunun parametrelerini ve açıklamasını nerede bulursun?', o: ['klipper3d.org → G-Codes sayfası', 'Marlin dokümanı', 'Cura ayarları', 'printer.cfg\'nin sonu'], a: 0, e: 'Bütün komutlar G-Codes sayfasında, modül adına göre gruplanmış halde.' }
    ]
  },
  {
    id: 'u3l2', title: 'Hız sınırı ve G-code ofseti', doc: 'G-Codes.html#set_gcode_offset',
    teach: [
      { title: 'SET_VELOCITY_LIMIT', body: 'Config\'teki hız/ivme sınırlarını baskı sırasında değiştirir. Restart sonrası config\'teki değerlere döner.', code: 'SET_VELOCITY_LIMIT VELOCITY=200 ACCEL=2000\nSET_VELOCITY_LIMIT SQUARE_CORNER_VELOCITY=1' },
      { title: 'SET_GCODE_OFFSET', body: 'Sonraki hareketlere ofset ekler. En çok Z\'yi baskı sırasında ince ayarlamak (babystep) için kullanılır.\n\n• **Z=0.1**: Toplam ofseti 0.1 yapar.\n• **Z_ADJUST=0.05**: Mevcut ofsete 0.05 ekler.\n• **MOVE=1**: Hemen hareket ederek uygular.', code: 'SET_GCODE_OFFSET Z=-0.2\nSET_GCODE_OFFSET Z_ADJUST=0.3   ; toplam = 0.1' }
    ],
    questions: [
      { t: 'mc', q: '"SET_GCODE_OFFSET Z=-0.2" sonra "SET_GCODE_OFFSET Z_ADJUST=0.3" verildi. Toplam Z ofseti kaç?', o: ['0.1', '0.3', '-0.2', '0.5'], a: 0, e: 'Z_ADJUST mevcut değere ekler: -0.2 + 0.3 = 0.1. Bu örnek doğrudan dokümandan.' },
      { t: 'mc', q: 'Baskı sırasında ilk katman çok ezik. Nozulu biraz yukarı almak için?', o: ['SET_GCODE_OFFSET Z_ADJUST=0.02', 'SET_GCODE_OFFSET Z_ADJUST=-0.02', 'G92 Z0.02', 'G28 Z'], a: 0, e: 'Pozitif Z ofseti nozulu yukarı alır.' },
      { t: 'tf', q: 'SET_VELOCITY_LIMIT ile yapılan değişiklikler config dosyasına kalıcı olarak yazılır.', a: false, e: 'Hayır, çalışma anında geçerlidir. Kalıcı olsun istiyorsan [printer] bölümünü düzenle.' },
      { t: 'fill', q: 'Maksimum ivmeyi 1500 yap', code: 'SET_VELOCITY_LIMIT ___=1500', o: ['ACCEL', 'VELOCITY', 'MAX_ACCEL', 'A'], a: 'ACCEL', e: 'SET_VELOCITY_LIMIT parametreleri: VELOCITY, ACCEL, MINIMUM_CRUISE_RATIO, SQUARE_CORNER_VELOCITY.' },
      { t: 'mc', q: 'SET_GCODE_OFFSET\'te MOVE=1 ne işe yarar?', o: ['Ofseti hemen bir hareketle uygular', 'Ofseti kalıcı kaydeder', 'Kafayı home\'a gönderir', 'Ofseti sıfırlar'], a: 0, e: 'MOVE=1 yoksa ofset, o ekseni içeren bir sonraki mutlak harekette devreye girer.' },
      { t: 'mc', q: 'Babystep ile bulduğun Z ofsetini probe ayarına kalıcı aktarmak için?', o: ['Z_OFFSET_APPLY_PROBE + SAVE_CONFIG', 'SET_GCODE_OFFSET SAVE=1', 'G92 Z0', 'RESTART'], a: 0, e: 'Z_OFFSET_APPLY_PROBE babystep değerini probe z_offset\'ine işler; SAVE_CONFIG ile kalıcı olur. Endstop kullanıyorsan Z_OFFSET_APPLY_ENDSTOP.' }
    ]
  },
  {
    id: 'u3l3', title: 'Sorgu ve durum komutları', doc: 'G-Codes.html#query_endstops',
    teach: [
      { title: 'Sorgular', body: '• **QUERY_ENDSTOPS**: Endstoplar "triggered" mı "open" mı?\n• **GET_POSITION**: Kafanın konumunu ayrıntılı gösterir.\n• **QUERY_PROBE**: Probe tetiklenmiş mi?\n• **M119** da çalışır ama yerine QUERY_ENDSTOPS önerilir.' },
      { title: 'Durumu kaydet/geri yükle', body: 'Makrolarda G90/G91, M83, hız gibi ayarları bozmamak için:', code: 'SAVE_GCODE_STATE NAME=my_state\nG91\nG1 Z10 F300\nRESTORE_GCODE_STATE NAME=my_state' }
    ],
    questions: [
      { t: 'mc', q: 'Endstop kablosunu taktın, çalışıyor mu bakmak istiyorsun. Hangi komut?', o: ['QUERY_ENDSTOPS', 'GET_POSITION', 'STATUS', 'G28'], a: 0, e: 'QUERY_ENDSTOPS her endstop için "triggered" veya "open" yazar. Elinle basıp tekrar sorarak test edersin.' },
      { t: 'tf', q: 'Klipper M119\'u desteklese de dokümanda yerine QUERY_ENDSTOPS kullanılması önerilir.', a: true, e: 'Doğru.' },
      { t: 'order', q: 'Makroda durumu bozmadan 10 mm yukarı çık', items: ['SAVE_GCODE_STATE NAME=s', 'G91', 'G1 Z10 F300', 'RESTORE_GCODE_STATE NAME=s'], e: 'Durumu kaydet, göreli moda geç, hareket et, durumu geri yükle.' },
      { t: 'mc', q: 'SAVE_GCODE_STATE hangisini KAYDETMEZ?', o: ['Nozul sıcaklığı', 'G90/G91 modu', 'M220 hız çarpanı', 'SET_GCODE_OFFSET ofseti'], a: 0, e: 'G-code ayrıştırma durumunu kaydeder (mod, ofset, çarpanlar, konum). Sıcaklık bunun parçası değil.' },
      { t: 'type', q: 'Kafanın mevcut konumunu ayrıntılı gösteren Klipper komutunu yaz', a: ['GET_POSITION'], e: 'GET_POSITION; standart karşılığı M114.' },
      { t: 'mc', q: 'QUERY_PROBE ne döndürür?', o: ['"triggered" veya "open"', 'Z yüksekliği', 'Probe sıcaklığı', 'Mesh haritası'], a: 0, e: 'Probe\'un o anki durumunu bildirir.' }
    ]
  }
  ]
},
{
  id: 'u4', title: 'Motorlar ve Eksenler', desc: '[printer], [stepper], rotation_distance', color: '#f97316', icon: '⚙️',
  lessons: [
  {
    id: 'u4l1', title: '[printer] bölümü', doc: 'Config_Reference.html#printer',
    teach: [
      { title: 'Zorunlu ayarlar', body: '**kinematics**, **max_velocity** ve **max_accel** zorunludur.\n\nkinematics örnekleri: cartesian, corexy, delta, corexz, polar, none.', code: '[printer]\nkinematics: corexy\nmax_velocity: 300   # mm/s\nmax_accel: 3000     # mm/s²\nmax_z_velocity: 15' },
      { title: 'Köşe ve kısa hareketler', body: '• **square_corner_velocity** (varsayılan 5 mm/s): 90° köşeden geçiş hızı.\n• **minimum_cruise_ratio** (varsayılan 0.5): Kısa zikzak hareketlerin tepe hızını kısar. Eski **max_accel_to_decel** ayarının yerini aldı.' }
    ],
    questions: [
      { t: 'mc', q: 'Voron 2.4 gibi yazıcılarda X/Y hareketi iki motorla ortak yapılır. kinematics ne olur?', o: ['corexy', 'cartesian', 'delta', 'polar'], a: 0, e: 'CoreXY\'de iki motor kayışlarla birlikte X ve Y hareketini üretir.' },
      { t: 'mc', q: '[printer] bölümünde hangisi zorunlu DEĞİLDİR?', o: ['square_corner_velocity', 'kinematics', 'max_velocity', 'max_accel'], a: 0, e: 'square_corner_velocity isteğe bağlıdır, varsayılanı 5 mm/s.' },
      { t: 'mc', q: 'square_corner_velocity\'nin varsayılan değeri nedir?', o: ['5 mm/s', '0', '50 mm/s', '1 mm/s'], a: 0, e: 'Varsayılan 5 mm/s.' },
      { t: 'tf', q: 'minimum_cruise_ratio, eski max_accel_to_decel ayarının yerini aldı.', a: true, e: 'Klipper 0.13.0 sürüm notlarında yazıyor.' },
      { t: 'mc', q: 'max_accel\'in birimi nedir?', o: ['mm/s²', 'mm/s', 'mm/dk', 'adım/s'], a: 0, e: 'İvme mm/s² cinsindendir.' },
      { t: 'fill', q: 'Kartezyen yazıcı tanımla', code: '[printer]\nkinematics: ___', o: ['cartesian', 'corexy', 'linear', 'xyz'], a: 'cartesian', e: 'Ender 3 gibi klasik yazıcılar cartesian\'dır.' },
      { t: 'tf', q: 'max_velocity değeri baskı sırasında SET_VELOCITY_LIMIT ile değiştirilebilir.', a: true, e: 'Evet, dokümanda açıkça yazıyor.' }
    ]
  },
  {
    id: 'u4l2', title: '[stepper] ve pinler', doc: 'Config_Reference.html#stepper',
    teach: [
      { title: 'Bir motor bölümü', body: 'Her eksenin bir stepper bölümü vardır:', code: '[stepper_x]\nstep_pin: PB13\ndir_pin: !PB12\nenable_pin: !PB14\nmicrosteps: 16\nrotation_distance: 40\nendstop_pin: ^PC0\nposition_endstop: 0\nposition_max: 235\nhoming_speed: 50' },
      { title: 'Pin önekleri', body: '• **!** → ters polarite (örn. dir_pin\'de yönü çevirir)\n• **^** → pull-up direncini aç (endstoplarda)\n• **~** → pull-down direncini aç (destekleyen kartlarda)\n\nPin adları kartın donanım adlarıdır: PA4, PB13 gibi.' }
    ],
    questions: [
      { t: 'mc', q: 'X motoru ters yöne gidiyor. En kolay düzeltme?', o: ['dir_pin\'in başına ! eklemek/kaldırmak', 'step_pin\'i değiştirmek', 'microsteps\'i 32 yapmak', 'Kabloyu sökmek zorundasın'], a: 0, e: 'dir_pin\'e ! eklemek yönü ters çevirir.' },
      { t: 'match', q: 'Pin öneklerini eşleştir', pairs: [['!', 'Ters polarite'], ['^', 'Pull-up aç'], ['~', 'Pull-down aç']], e: 'Önekler birleştirilebilir, örn. ^!PC0.' },
      { t: 'mc', q: 'Kartezyen yazıcıda stepper_x için hangisi zorunludur?', o: ['position_max', 'homing_speed', 'position_min', 'second_homing_speed'], a: 0, e: 'Kartezyen yazıcıda X/Y/Z için endstop_pin, position_endstop ve position_max zorunludur.' },
      { t: 'mc', q: 'homing_speed\'in varsayılan değeri?', o: ['5 mm/s', '50 mm/s', '20 mm/s', '100 mm/s'], a: 0, e: 'Varsayılan 5 mm/s; çoğu kişi daha yüksek ayarlar.' },
      { t: 'tf', q: 'position_min\'in varsayılan değeri 0 mm\'dir.', a: true, e: 'Evet.' },
      { t: 'fill', q: 'Endstop pinine pull-up ekle', code: 'endstop_pin: ___PC0', o: ['^', '!', '~', '#'], a: '^', e: '^ pull-up direncini açar; mekanik endstoplarda yaygındır.' },
      { t: 'mc', q: 'homing_retract_dist: 0 yaparsan ne olur?', o: ['İkinci (yavaş) homing yapılmaz', 'Homing iptal olur', 'Eksen ters home olur', 'Hata verir'], a: 0, e: 'Varsayılan 5 mm geri çekilip ikinci kez home yapar; 0 bu ikinci homing\'i kapatır.' }
    ]
  },
  {
    id: 'u4l3', title: 'rotation_distance', doc: 'Rotation_Distance.html',
    teach: [
      { title: 'Nedir?', body: 'Motor **bir tam tur** döndüğünde eksenin kaç mm gittiği.\n\n**Kayışlı eksen:** kayış adımı × kasnak diş sayısı\nÖrnek: 2 mm (GT2) × 20 diş = **40**\n\n**steps_per_mm biliyorsan:**\nrotation_distance = full_steps × microsteps ÷ steps_per_mm\nÖrnek: 200 × 16 ÷ 80 = **40**' },
      { title: 'Ekstrüder: ölç ve düzelt', body: '1. Filamanı ekstrüderden ~70 mm uzakta işaretle, ölç.\n2. **G91** sonra **G1 E50 F60** (yavaş!).\n3. Tekrar ölç; gerçek ekstrüzyon = ilk ölçüm − son ölçüm.\n4. yeni = eski × gerçek ÷ 50\n\n⚠️ Bu yöntem X/Y/Z için kullanılmaz, sadece ekstrüder için.' }
    ],
    questions: [
      { t: 'mc', q: 'GT2 kayış (2 mm adım) ve 20 dişli kasnak. rotation_distance kaç?', o: ['40', '20', '80', '10'], a: 0, e: '2 × 20 = 40.' },
      { t: 'mc', q: 'GT2 kayış ve 16 dişli kasnak. rotation_distance kaç?', o: ['32', '16', '40', '8'], a: 0, e: '2 × 16 = 32.' },
      { t: 'mc', q: 'Marlin\'de steps_per_mm = 80, microsteps = 16, motor 1.8°. rotation_distance?', o: ['40', '80', '20', '16'], a: 0, e: '200 × 16 ÷ 80 = 40. (1.8° motor = 200 tam adım)' },
      { t: 'mc', q: 'Ekstrüderde rotation_distance 22 iken 50 mm istedin, 48 mm çıktı. Yeni değer?', o: ['21.12', '22.92', '24', '20'], a: 0, e: '22 × 48 ÷ 50 = 21.12. Az çıkıyorsa değer küçülür (motor daha çok döner).' },
      { t: 'tf', q: '"Ölç ve düzelt" yöntemi X ve Y eksenleri için de önerilir.', a: false, e: 'Hayır. Doküman bunu açıkça yasaklıyor; X/Y/Z donanıma bakılarak hesaplanır.' },
      { t: 'mc', q: 'Ekstrüder testinde neden G1 E50 F60 gibi YAVAŞ ekstrüzyon kullanılır?', o: ['Hızlıda basınç oluşup sonucu bozar', 'Motor yanmasın diye', 'Filaman kopmasın diye', 'Fark etmez'], a: 0, e: 'Hızlı ekstrüzyon nozulda basınç yapar ve ölçümü saptırır. Arayüzdeki "extrude" butonunu da kullanma.' },
      { t: 'mc', q: '0.9° adımlı bir motorun tam tur adım sayısı?', o: ['400', '200', '360', '800'], a: 0, e: '360 ÷ 0.9 = 400. Config\'te full_steps_per_rotation: 400 yazılır.' },
      { t: 'tf', q: 'X/Y/Z için hesaplanan rotation_distance genelde tam sayıdır.', a: true, e: 'Doküman: sonuç tam sayıya 0.01\'den yakınsa tam sayıya yuvarla.' }
    ]
  }
  ]
},
{
  id: 'u5', title: 'Hotend, Tabla, Güvenlik', desc: '[extruder], PID, verify_heater', color: '#ef4444', icon: '🔥',
  lessons: [
  {
    id: 'u5l1', title: '[extruder] bölümü', doc: 'Config_Reference.html#extruder',
    teach: [
      { title: 'Motor + ısıtıcı bir arada', body: '[extruder] hem ekstrüder motorunu hem de hotend ısıtıcısını tanımlar.', code: '[extruder]\nstep_pin: PB3\ndir_pin: !PB4\nenable_pin: !PD1\nmicrosteps: 16\nrotation_distance: 22.67\nnozzle_diameter: 0.400\nfilament_diameter: 1.750\nheater_pin: PC8\nsensor_type: EPCOS 100K B57560G104F\nsensor_pin: PA0\ncontrol: pid\npid_Kp: 21.5\npid_Ki: 1.06\npid_Kd: 108.6\nmin_temp: 0\nmax_temp: 260' },
      { title: 'Koruma ayarları', body: '• **min_extrude_temp** (varsayılan 170 °C): Bunun altında ekstrüder hareket etmez → "Extrude below minimum temp" hatası.\n• **max_extrude_only_distance** (varsayılan 50 mm): Tek seferde bundan uzun ekstrüzyon/geri çekme hata verir.\n• **min_temp / max_temp**: Ölçülen sıcaklık bu aralıktan çıkarsa MCU kapanır.' }
    ],
    questions: [
      { t: 'mc', q: '[extruder] bölümünde hangisi zorunludur?', o: ['nozzle_diameter', 'pressure_advance', 'max_power', 'smooth_time'], a: 0, e: 'nozzle_diameter ve filament_diameter zorunludur.' },
      { t: 'mc', q: 'Soğuk nozulla filaman ittin ve "Extrude below minimum temp" hatası aldın. Varsayılan sınır kaç?', o: ['170 °C', '150 °C', '200 °C', '180 °C'], a: 0, e: 'min_extrude_temp varsayılanı 170 °C.' },
      { t: 'mc', q: 'control ayarı hangi değerleri alabilir?', o: ['pid veya watermark', 'pid veya bang', 'auto veya manual', 'pwm veya on/off'], a: 0, e: 'Dokümana göre kontrol algoritması pid veya watermark olabilir.' },
      { t: 'tf', q: 'Sensör min_temp/max_temp aralığının dışına çıkarsa MCU kendini shutdown durumuna alır.', a: true, e: 'Evet; bu MCU tarafında çalışan bir güvenlik özelliğidir.' },
      { t: 'mc', q: '100 mm filaman yüklemek için tek G1 E100 verdin, hata aldın. Neden?', o: ['max_extrude_only_distance varsayılanı 50 mm', 'min_extrude_temp düşük', 'F değeri yok', 'G92 E0 yapılmamış'], a: 0, e: 'Tek ekstrüzyon hareketi 50 mm\'yi aşamaz; ya iki parça yap ya da ayarı büyüt.' },
      { t: 'fill', q: '1.75 mm filaman tanımla', code: 'filament_diameter: ___', o: ['1.750', '0.400', '2.85', '175'], a: '1.750', e: 'filament_diameter filamanın çapıdır; 0.4 nozulun çapı olurdu.' },
      { t: 'tf', q: '[heater_bed] bölümü [extruder] ile aynı ısıtıcı ayarlarını (heater_pin, sensor_type, control…) kullanır.', a: true, e: 'Dokümanda heater_bed\'in extruder ile aynı ısıtıcı ayarlarını kullandığı yazıyor.' }
    ]
  },
  {
    id: 'u5l2', title: 'PID kalibrasyonu', doc: 'G-Codes.html#pid_calibrate',
    teach: [
      { title: 'PID_CALIBRATE', body: 'Isıtıcı hedefe ulaşır, sonra birkaç kez kapanıp açılır ve en uygun Kp/Ki/Kd değerlerini hesaplar. Sonuçları kaydetmek için **SAVE_CONFIG** verilir.', code: 'PID_CALIBRATE HEATER=extruder TARGET=210\nSAVE_CONFIG\n\nPID_CALIBRATE HEATER=heater_bed TARGET=60\nSAVE_CONFIG' },
      { title: 'Yeni bilgi (Ekim 2026)', body: 'Klipper\'da PID_CALIBRATE hesaplarındaki bir hata düzeltildi. Eskiden önerilen değerler istenenin iki katı çıkıyordu. Isınmada salınım yaşıyorsan PID_CALIBRATE\'i tekrar çalıştır.' }
    ],
    questions: [
      { t: 'fill', q: 'Nozul PID kalibrasyonu', code: 'PID_CALIBRATE HEATER=___ TARGET=210', o: ['extruder', 'nozzle', 'hotend', 'E0'], a: 'extruder', e: 'HEATER, config\'teki bölüm adıdır: extruder veya heater_bed.' },
      { t: 'order', q: 'Tabla PID\'ini kalibre et ve kaydet', items: ['PID_CALIBRATE HEATER=heater_bed TARGET=60', 'Testin bitmesini bekle', 'SAVE_CONFIG'], e: 'SAVE_CONFIG yeni Kp/Ki/Kd değerlerini dosyaya yazar ve Klipper\'ı yeniden başlatır.' },
      { t: 'tf', q: 'PID_CALIBRATE sonuçları SAVE_CONFIG verilmeden de kalıcı olarak kaydedilir.', a: false, e: 'Hayır, SAVE_CONFIG şart.' },
      { t: 'mc', q: 'PID_CALIBRATE\'te WRITE_FILE=1 ne yapar?', o: ['Sıcaklık örneklerini /tmp/heattest.txt dosyasına yazar', 'Sonucu printer.cfg\'ye yazar', 'Testi tekrarlar', 'Ekrana grafik çizer'], a: 0, e: 'Test boyunca alınan tüm sıcaklık örneklerini log dosyasına yazar.' },
      { t: 'mc', q: 'Ekim 2026 Klipper değişikliğine göre eski PID_CALIBRATE ne yapıyordu?', o: ['İstenen değerlerin iki katını öneriyordu', 'Hiç çalışmıyordu', 'Tablayı desteklemiyordu', 'Sadece watermark öneriyordu'], a: 0, e: 'Config_Changes 20261018: hesaplama hatası düzeltildi, eskiden değerler iki katı çıkıyordu.' },
      { t: 'tf', q: 'PID kalibrasyonunu, baskıda kullandığın sıcaklığa yakın bir TARGET ile yapmak mantıklıdır.', a: true, e: 'Evet, PLA basıyorsan 200-210 civarı, tabla için 60 gibi.' }
    ]
  },
  {
    id: 'u5l3', title: 'Isıtıcı güvenliği', doc: 'Config_Reference.html#verify_heater',
    teach: [
      { title: 'verify_heater', body: 'Her ısıtıcı için **otomatik açıktır**. Isıtıcı ısınamıyorsa (sensör düşmüş, kartuş bozuk) hata verip durdurur → "Heater extruder not heating at expected rate".\n\n• **check_gain_time**: Isınma sırasında bu sürede en az **heating_gain** (2 °C) artış bekler. Varsayılan: ekstrüder 20 sn, tabla 60 sn.\n• **max_error** (120): Biriken hata sınırı.' },
      { title: 'idle_timeout', body: 'Yazıcı belli süre boşta kalırsa ısıtıcıları ve motorları kapatır.\n\nVarsayılan: **600 saniye**, çalıştırdığı komutlar **TURN_OFF_HEATERS** ve **M84**.', code: '[idle_timeout]\ntimeout: 1800' }
    ],
    questions: [
      { t: 'tf', q: 'verify_heater korumasını kullanmak için config\'e [verify_heater] bölümü eklemek zorunludur.', a: false, e: 'Hayır, tüm ısıtıcılar için otomatik açıktır. Bölüm sadece varsayılanları değiştirmek için eklenir.' },
      { t: 'mc', q: 'Ekstrüder için check_gain_time varsayılanı kaç saniye?', o: ['20', '60', '120', '5'], a: 0, e: 'Ekstrüder 20 sn, tabla 60 sn.' },
      { t: 'mc', q: 'Büyük, yavaş ısınan bir tabla sürekli "not heating at expected rate" hatası veriyor. Hangi ayar?', o: ['[verify_heater heater_bed] check_gain_time\'ı artırmak', 'max_temp\'i düşürmek', 'pid_Kp\'yi sıfırlamak', 'min_extrude_temp\'i artırmak'], a: 0, e: 'check_gain_time büyüdükçe ısınmaya daha çok süre tanınır. Ama önce kablo/sensörü kontrol et!' },
      { t: 'mc', q: 'idle_timeout varsayılan süresi?', o: ['600 saniye (10 dk)', '60 saniye', '1 saat', 'Kapalı'], a: 0, e: 'Varsayılan 600 saniye.' },
      { t: 'match', q: 'Eşleştir', pairs: [['idle_timeout', 'Boşta kalınca kapatır'], ['verify_heater', 'Isınmayan ısıtıcıyı yakalar'], ['min_temp/max_temp', 'Sensör sınırı, MCU kapanır'], ['min_extrude_temp', 'Soğuk ekstrüzyonu engeller']], e: 'Bunlar Klipper\'ın temel güvenlik katmanları.' },
      { t: 'type', q: 'Boşta kalma süresini 30 dakika (1800 sn) yapan komutu yaz', a: ['SET_IDLE_TIMEOUT TIMEOUT=1800'], e: 'SET_IDLE_TIMEOUT TIMEOUT=1800. Config\'te kalıcı yapmak için [idle_timeout] timeout: 1800.' }
    ]
  }
  ]
}
);
